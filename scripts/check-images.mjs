import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadDemoSet } from './demo-image-set.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const demo = loadDemoSet(root)
const missing = []

for (const row of demo) {
  const menuPath = resolve(root, 'public/images/menu', `${row.key}.webp`)
  const signaturePath = row.signatureFile ? resolve(root, 'public/images/signature', row.signatureFile) : ''
  const menuMissing = !existsSync(menuPath)
  const signatureMissing = Boolean(signaturePath) && !existsSync(signaturePath)
  if (menuMissing || signatureMissing) {
    const where = [menuMissing ? 'menu' : '', signatureMissing ? 'signature' : ''].filter(Boolean).join(' + ')
    missing.push([row.no, row.key, row.dish, where])
  }
}

console.log(`Demo set: ${demo.length}`)
console.log(`Present: ${demo.length - missing.length}`)
console.log(`Missing: ${missing.length}`)
if (missing.length === 0) {
  console.log('Every demo-set image is in place.')
} else {
  const widths = missing[0].map((_, column) => Math.max(...missing.map((row) => String(row[column]).length), 'no'.length))
  console.log(`  ${['no', 'key', 'dish', 'missing'].map((cell, index) => cell.padEnd(widths[index])).join('  ')}`)
  for (const row of missing) {
    console.log(`  ${row.map((cell, index) => String(cell).padEnd(widths[index])).join('  ')}`)
  }
}
