/**
 * npm run images:plates
 *
 * Reads raw dish photos from public/images/ using an explicit source-map below,
 * and writes processed 1000×1000 JPEGs to public/images/signature/plates/<slug>.jpg.
 *
 * Processing strategy (mirrors the React plate component):
 *   - cover: crop around the dish using the focus + zoom values chosen per photo.
 *   - contain: place the full photo in the centre of a dark 1000×1000 canvas (at 80 %)
 *     with a blurred, darkened copy behind it.
 *
 * Usage:
 *   node scripts/make-plate-images.mjs
 *   node scripts/make-plate-images.mjs --dry-run   # preview only, no writes
 *
 * Originals are NEVER modified or overwritten.
 */

import { existsSync, readdirSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

// ── Resolve paths ────────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = join(__dirname, '..')
const srcDir    = join(root, 'public', 'images')
const outDir    = join(root, 'public', 'images', 'signature', 'plates')

const OUTPUT_SIZE = 1000
const QUALITY     = 85
const DRY_RUN     = process.argv.includes('--dry-run')

// ── Resolve the prawns biryani filename dynamically ─────────────────────────
// The file has Unicode math-bold characters + emoji in its name.
// We find it by detecting the only file that contains "Prawn" or "Biryani" with emoji.
function findPrawnsFile(dir) {
  try {
    return readdirSync(dir).find((f) =>
      (f.includes('Prawn') || f.toLowerCase().includes('prawn')) &&
      (f.includes('Biryani') || f.toLowerCase().includes('biryani')) &&
      f !== 'prawns-biryani.jpg'   // exclude the wrong restaurant-terrace file
    ) ?? null
  } catch {
    return null
  }
}

const prawnsFile = findPrawnsFile(srcDir)
if (!prawnsFile && !DRY_RUN) {
  console.warn('  ⚠  Could not locate the Prawns Biryani source photo in public/images/.')
  console.warn('     Expected a file whose name contains "Prawn" and "Biryani" (with Unicode bold chars).')
}

// ── Per-dish source map ───────────────────────────────────────────────────────
// Each entry:
//   slug    : output filename (without .jpg) — must match the slug in signature.ts IMG map
//   src     : filename inside public/images/ (exact, including spaces)
//   fit     : 'cover' (crop) or 'contain' (blurred bg + centred photo)
//   focus   : CSS-style "X% Y%" — only used for cover mode
//   zoom    : scale factor 1–1.4 — only used for cover mode
//
// Decisions based on visual inspection of each photo:
//
//   Chicken Fry Piece Biryani   : overhead bowl ~square → cover, dish at lower-centre
//   Spl. Chicken 65 Biryani     : tall portrait w/ raita/sauce surrounds → contain
//   Telangana Mutton Curry      : portrait, bowl well-centred → cover
//   Karimnagar Chicken Wings    : portrait, plate near-full frame → contain
//   Pachimirchi Kodi Vepudu     : wide landscape wok shot → cover
//                                 ⚠ photo shows orange butter curry, not green-chili fry — flag for replacement
//   Prawns Biryani              : tall portrait, prawn biryani in white bowl → contain
//   Rama Rao Gari Mutton Pulao  : landscape rectangular tray overhead → contain
//   Paneer Butter Masala        : nearly square bowl shot → cover

const DISHES = [
  {
    slug:  'chicken-fry-piece-biryani',
    src:   'chicken fry piece biryani.jpg',
    fit:   'cover',
    focus: '50% 60%',
    zoom:  1.1,
  },
  {
    slug:  'spl-chicken-65-biryani',
    src:   'spl chicek biryani.jpg',
    fit:   'contain',
    focus: '50% 55%',
    zoom:  1,
  },
  {
    slug:  'telangana-mutton-curry',
    src:   'telangana mutton curry.jpg',
    fit:   'cover',
    focus: '50% 50%',
    zoom:  1.05,
  },
  {
    slug:  'karimnagar-chicken-wings',
    src:   'karimnagar chicken wings.jpg',
    fit:   'contain',
    focus: '50% 55%',
    zoom:  1,
  },
  {
    // ⚠ This photo shows an orange butter-style curry in a wok — not an authentic
    //   Pachimirchi Kodi Vepudu (green-chili dry chicken fry). Flag for replacement.
    slug:  'pachimirchi-kodi-vepudu',
    src:   'kodi-vepudu.jpg',
    fit:   'cover',
    focus: '50% 50%',
    zoom:  1.0,
  },
  {
    // Using the actual prawn-biryani photo (long Unicode math-bold filename).
    // The old prawns-biryani.jpg was a restaurant terrace — wrong file, not used.
    slug:  'prawns-biryani',
    src:   prawnsFile,  // resolved dynamically above
    fit:   'contain',
    focus: '50% 55%',
    zoom:  1,
  },
  {
    slug:  'rama-rao-gari-mutton-pulao',
    src:   'rama roa mutton pulav.jpg',
    fit:   'contain',
    focus: '50% 55%',
    zoom:  1,
  },
  {
    slug:  'paneer-butter-masala',
    src:   'panner butter masala.jpg',
    fit:   'cover',
    focus: '50% 50%',
    zoom:  1.0,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert "50% 55%" → { x: 0.5, y: 0.55 } */
function parseFocus(focusStr) {
  const [xStr, yStr] = (focusStr ?? '50% 55%').split(' ')
  return {
    x: parseFloat(xStr ?? '50') / 100,
    y: parseFloat(yStr ?? '55') / 100,
  }
}

/** Compute a square extract region centred at focus, respecting zoom. */
function coverExtract(width, height, focus, zoom) {
  const extractSize = Math.min(width, height) / zoom
  const cx = Math.round(focus.x * width)
  const cy = Math.round(focus.y * height)
  const half = Math.round(extractSize / 2)
  const left = Math.max(0, Math.min(cx - half, width  - Math.round(extractSize)))
  const top  = Math.max(0, Math.min(cy - half, height - Math.round(extractSize)))
  const size = Math.min(Math.round(extractSize), width - left, height - top)
  return { left, top, width: size, height: size }
}

// ── Ensure output directory exists ───────────────────────────────────────────
if (!DRY_RUN) {
  await mkdir(outDir, { recursive: true })
}

// ── Process each dish ─────────────────────────────────────────────────────────
const rows = []

for (const dish of DISHES) {
  if (!dish.src) {
    rows.push({ slug: dish.slug, fit: dish.fit, ratio: '—', status: 'MISSING SRC (file not found)' })
    continue
  }

  const inPath  = join(srcDir, dish.src)
  const outPath = join(outDir, `${dish.slug}.jpg`)

  if (!existsSync(inPath)) {
    rows.push({ slug: dish.slug, fit: dish.fit, ratio: '—', status: `MISSING SRC: ${dish.src}` })
    continue
  }

  // Read metadata to get actual dimensions
  let meta
  try {
    meta = await sharp(inPath).metadata()
  } catch (err) {
    rows.push({ slug: dish.slug, fit: dish.fit, ratio: '—', status: `META ERROR: ${err.message}` })
    continue
  }

  const { width = 1, height = 1 } = meta
  const ratio = width / height

  if (DRY_RUN) {
    rows.push({ slug: dish.slug, fit: dish.fit, ratio: ratio.toFixed(2), status: 'dry-run' })
    continue
  }

  try {
    if (dish.fit === 'cover') {
      // ── COVER: square crop around the dish ───────────────────────────────
      const focus   = parseFocus(dish.focus)
      const extract = coverExtract(width, height, focus, dish.zoom)

      await sharp(inPath)
        .extract(extract)
        .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: 'cover' })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(outPath)

    } else {
      // ── CONTAIN: full photo on blurred dark background ────────────────────
      const innerSize = Math.round(OUTPUT_SIZE * 0.8) // 800 px

      let iW, iH
      if (ratio >= 1) {
        iW = innerSize
        iH = Math.round(innerSize / ratio)
      } else {
        iH = innerSize
        iW = Math.round(innerSize * ratio)
      }

      const offsetX = Math.round((OUTPUT_SIZE - iW) / 2)
      const offsetY = Math.round((OUTPUT_SIZE - iH) / 2)

      // Blurred background: cover-fill + blur + darken
      const bgBuffer = await sharp(inPath)
        .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: 'cover', position: 'centre' })
        .blur(22)
        .modulate({ brightness: 0.38 })
        .jpeg({ quality: 55 })
        .toBuffer()

      // Sharp foreground: contained at 80 % of canvas
      const fgBuffer = await sharp(inPath)
        .resize(iW, iH, { fit: 'inside', withoutEnlargement: false })
        .png()
        .toBuffer()

      await sharp(bgBuffer)
        .composite([{ input: fgBuffer, left: offsetX, top: offsetY }])
        .resize(OUTPUT_SIZE, OUTPUT_SIZE)
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(outPath)
    }

    rows.push({ slug: dish.slug, fit: dish.fit, ratio: ratio.toFixed(2), status: 'OK' })
  } catch (err) {
    rows.push({ slug: dish.slug, fit: dish.fit, ratio: ratio.toFixed(2), status: `ERROR: ${err.message}` })
  }
}

// ── Print table ───────────────────────────────────────────────────────────────
const colW = [36, 8, 7, 50]
const header = ['slug', 'fit', 'ratio', 'status']
const pad = (s, n) => String(s ?? '').padEnd(n).slice(0, n + 2)
console.log('\n' + header.map((h, i) => pad(h, colW[i])).join('  '))
console.log('-'.repeat(colW.reduce((a, c) => a + c, 0) + header.length * 2))
for (const row of rows) {
  console.log([row.slug, row.fit, row.ratio, row.status].map((v, i) => pad(v, colW[i])).join('  '))
}
console.log()
if (!DRY_RUN) {
  console.log(`Output: ${outDir}`)
}
