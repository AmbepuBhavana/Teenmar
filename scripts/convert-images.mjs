import { existsSync, mkdirSync, readdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadDemoSet } from './demo-image-set.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const incoming = resolve(root, 'incoming-images')
const doneDir = resolve(incoming, 'done')
const menuDir = resolve(root, 'public/images/menu')
const signatureDir = resolve(root, 'public/images/signature')
const extensions = new Set(['.png', '.jpg', '.jpeg', '.webp'])

const demo = loadDemoSet(root)
const byNumber = new Map(demo.map((row) => [Number(row.no), row]))
mkdirSync(incoming, { recursive: true })
mkdirSync(doneDir, { recursive: true })
mkdirSync(menuDir, { recursive: true })
mkdirSync(signatureDir, { recursive: true })

const files = readdirSync(incoming, { withFileTypes: true })
  .filter((entry) => entry.isFile() && extensions.has(extname(entry.name).toLowerCase()))
  .map((entry) => entry.name)
  .sort()

const converted = []
const unmatched = []
const used = new Set()

for (const name of files) {
  const number = leadingNumber(name)
  const row = number == null ? undefined : byNumber.get(number)
  if (!row || used.has(row.no)) {
    unmatched.push({ file: name, reason: !row ? 'no matching prompt number' : `number ${row.no} already converted` })
    continue
  }
  const sharp = (await import('sharp')).default
  const source = resolve(incoming, name)
  const webp = await sharp(source).resize(640, 480, { fit: 'cover', position: 'centre' }).webp({ quality: 80 }).toBuffer()
  const menuPath = resolve(menuDir, `${row.key}.webp`)
  writeFileSync(menuPath, webp)
  let signaturePath = ''
  if (row.signatureFile) {
    signaturePath = resolve(signatureDir, row.signatureFile)
    writeFileSync(signaturePath, webp)
  }
  const destination = resolve(doneDir, name)
  if (existsSync(destination)) unlinkSync(destination)
  renameSync(source, destination)
  used.add(row.no)
  converted.push({ no: row.no, key: row.key, file: name, signature: row.signatureFile || '' })
}

const missing = demo.filter((row) => !existsSync(resolve(menuDir, `${row.key}.webp`)) || (row.signatureFile && !existsSync(resolve(signatureDir, row.signatureFile))))

printTable('Converted', converted.map((row) => [row.no, row.key, row.file, row.signature || 'menu only']))
printTable('Unmatched', unmatched.map((row) => [row.file, row.reason]))
printTable('Still missing', missing.map((row) => [row.no, row.key, row.dish]))
console.log(`Converted ${converted.length}, unmatched ${unmatched.length}, still missing ${missing.length}.`)

function leadingNumber(name) {
  const match = name.match(/^(\d+)/)
  if (!match) return null
  return Number(match[1])
}

function printTable(title, rows) {
  console.log(`\n${title}`)
  if (rows.length === 0) {
    console.log('  (none)')
    return
  }
  const widths = rows[0].map((_, column) => Math.max(...rows.map((row) => String(row[column]).length)))
  for (const row of rows) {
    console.log(`  ${row.map((cell, index) => String(cell).padEnd(widths[index])).join('  ')}`)
  }
}
