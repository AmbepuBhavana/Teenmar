/**
 * One-time migration: copies existing photos from public/images/*.jpg
 * to public/images/signature/*.jpg so the new IMG paths in signature.ts work.
 *
 * Run once: node scripts/migrate-signature-images.mjs
 */
import { copyFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = join(__dirname, '..')
const src       = join(root, 'public', 'images')
const dest      = join(root, 'public', 'images', 'signature')

const files = [
  ['chicken-fry-biryani.jpg',  'chicken-fry-biryani.jpg'],
  ['chicken-65-biryani.jpg',   'chicken-65-biryani.jpg'],
  ['mutton-curry.jpg',         'mutton-curry.jpg'],
  ['chicken-wings.jpg',        'chicken-wings.jpg'],
  ['kodi-vepudu.jpg',          'kodi-vepudu.jpg'],
  ['prawns-biryani.jpg',       'prawns-biryani.jpg'],
  ['mutton-pulao.jpg',         'mutton-pulao.jpg'],
  ['paneer-butter.jpg',        'paneer-butter.jpg'],
]

await mkdir(dest, { recursive: true })

for (const [from, to] of files) {
  const srcFile  = join(src, from)
  const destFile = join(dest, to)
  if (!existsSync(srcFile)) {
    console.log(`  SKIP  ${from}  (not found in public/images/)`)
    continue
  }
  if (existsSync(destFile)) {
    console.log(`  EXIST ${to}  (already in signature/)`)
    continue
  }
  await copyFile(srcFile, destFile)
  console.log(`  COPY  ${from} → signature/${to}`)
}

console.log('\nDone. Check public/images/signature/ and delete the originals if you no longer need them.')
