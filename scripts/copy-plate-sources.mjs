/**
 * node scripts/copy-plate-sources.mjs
 *
 * A zero-dependency fallback for environments where npm run images:plates can't run.
 * Simply copies the source dish photos to public/images/signature/plates/<slug>.jpg
 * WITHOUT any resizing. The React component handles all display (cover/contain CSS).
 *
 * Run this whenever sharp/mozjpeg isn't available or the main script fails.
 */

import { readdirSync, copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root    = join(__dirname, '..')
const srcDir  = join(root, 'public', 'images')
const outDir  = join(root, 'public', 'images', 'signature', 'plates')

mkdirSync(outDir, { recursive: true })

// Find the prawns biryani file dynamically (has Unicode math-bold chars in name)
const files = readdirSync(srcDir)
const prawnsFile = files.find(
  (f) => (f.includes('Prawn') || f.toLowerCase().includes('prawn')) &&
         (f.includes('Biryani') || f.toLowerCase().includes('biryani')) &&
         f !== 'prawns-biryani.jpg'
)

const MAP = [
  { src: 'chicken fry piece biryani.jpg',  slug: 'chicken-fry-piece-biryani' },
  { src: 'spl chicek biryani.jpg',         slug: 'spl-chicken-65-biryani' },
  { src: 'telangana mutton curry.jpg',     slug: 'telangana-mutton-curry' },
  { src: 'karimnagar chicken wings.jpg',   slug: 'karimnagar-chicken-wings' },
  { src: 'kodi-vepudu.jpg',               slug: 'pachimirchi-kodi-vepudu' },
  { src: prawnsFile,                       slug: 'prawns-biryani' },
  { src: 'rama roa mutton pulav.jpg',      slug: 'rama-rao-gari-mutton-pulao' },
  { src: 'panner butter masala.jpg',       slug: 'paneer-butter-masala' },
]

let ok = 0, missing = 0
for (const { src, slug } of MAP) {
  if (!src) {
    console.log(`  SKIP   ${slug} — source file not resolved`)
    missing++
    continue
  }
  const inPath  = join(srcDir, src)
  const outPath = join(outDir, `${slug}.jpg`)
  if (!existsSync(inPath)) {
    console.log(`  MISS   ${slug} ← ${src}`)
    missing++
    continue
  }
  copyFileSync(inPath, outPath)
  console.log(`  OK     ${slug}.jpg`)
  ok++
}
console.log(`\nDone: ${ok} copied, ${missing} missing → ${outDir}`)
