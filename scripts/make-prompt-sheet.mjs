import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadDemoSet } from './demo-image-set.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docs = resolve(root, 'docs')
const rows = loadDemoSet(root)

mkdirSync(docs, { recursive: true })
writeFileSync(resolve(docs, 'menu-image-prompts.csv'), toCsv(rows))
writeFileSync(resolve(docs, 'menu-image-prompts.md'), toMarkdown(rows))
console.log(`Wrote ${rows.length} demo prompts`)
console.log('docs/menu-image-prompts.csv')
console.log('docs/menu-image-prompts.md')

function toCsv(rows) {
  const header = ['no', 'key', 'dish', 'category', 'prompt']
  const lines = [header.join(',')]
  for (const row of rows) {
    lines.push([row.no, row.key, row.dish, row.category, row.prompt].map(csvCell).join(','))
  }
  return `${lines.join('\n')}\n`
}

function csvCell(value) {
  const text = String(value)
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`
  return text
}

function toMarkdown(rows) {
  const lines = [
    '# Menu image prompts',
    '',
    'Demo set only. Copy one prompt at a time. Save each picture in `incoming-images/` with its number first, for example `03.png` or `03-mutton.jpg`, then run `npm run images:convert`.',
    '',
  ]
  for (const row of rows) {
    lines.push(`## ${row.no}. ${row.dish}`, '', row.prompt, '')
  }
  return `${lines.join('\n')}\n`
}
