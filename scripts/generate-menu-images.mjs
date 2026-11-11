import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const menuPath = resolve(root, 'src/data/menu.ts')
const signatureDir = resolve(root, 'public/images/signature')
const menuDir = resolve(root, 'public/images/menu')
const model = 'gemini-2.5-flash-image'
const gapMs = 7000

const style =
  'Professional editorial food photograph, shot from a 45-degree overhead angle, the dish served in a traditional brass or copper vessel on a dark rustic wooden table, warm cinematic restaurant lighting, natural steam, shallow depth of field, realistic textures, rich colours, 4:3 composition with the dish centred and 12% empty margin around it, no text, no logos, no people, no hands, no watermark, not illustrated, not CGI.'

const signatureByName = {
  'Chicken Fry Piece Biryani': {
    file: 'chicken-fry-piece-biryani.webp',
    detail:
      'Aromatic Telugu-style chicken biryani with fried chicken pieces on top, long-grain rice, fried onions, fresh coriander and mint.',
  },
  'Spl. Chicken 65 Biryani': {
    file: 'special-chicken-65-biryani.webp',
    detail: 'Biryani rice topped with crispy red Chicken 65 pieces, curry leaves and green chillies.',
  },
  'Telangana Mutton Curry': {
    file: 'telangana-mutton-curry.webp',
    detail:
      'Rich dark-red Telangana-style mutton curry with visible mutton pieces and glossy oil on top, served with steamed rice on the side.',
  },
  'Karimnagar Chicken Wings': {
    file: 'karimnagar-chicken-wings.webp',
    detail: 'Glazed spicy Telugu-style chicken wings stacked on a dark plate, with sliced onion and lemon wedge.',
  },
  'Pachimirchi Kodi Vepudu': {
    file: 'pachimirchi-kodi-vepudu.webp',
    detail: 'Green-chilli chicken fry, dry, deep green and golden pieces with whole green chillies and curry leaves.',
  },
  'Prawns Biryani': {
    file: 'prawns-biryani.webp',
    detail: 'Biryani with large whole prawns on top, saffron-coloured rice, fresh coriander.',
  },
  'Rama Rao Gari Mutton Pulao': {
    file: 'rama-rao-gari-mutton-pulao.webp',
    detail: 'Mutton pulao with mutton pieces, whole spices and fried onions, lightly spiced rice.',
  },
  'Paneer Butter Masala': {
    file: 'paneer-butter-masala.webp',
    detail: 'Creamy orange paneer butter masala with paneer cubes, a swirl of cream and coriander, with a naan on the side.',
  },
}

loadEnv(resolve(root, '.env'))

const options = parseArgs(process.argv.slice(2))
const dishes = selectDishes(readMenu(menuPath), options)
const skipped = []
const pending = []
for (const dish of dishes) {
  if (existsSync(dish.absolutePath)) skipped.push(dish)
  else pending.push(dish)
}
const queue = pending.slice(0, options.limit)
const deferred = pending.slice(queue.length)

if (options.dryRun) {
  console.log(`Dry run: ${queue.length} prompt(s), ${skipped.length} already on disk, ${deferred.length} held by --limit.`)
  for (const dish of queue) {
    console.log(`\n# ${dish.relativePath}`)
    console.log(dish.prompt)
  }
  printSummary({ generated: [], skipped, failed: [], remaining: [...queue, ...deferred] })
  process.exit(0)
}

const provider = (process.env.IMAGE_PROVIDER || '').trim().toLowerCase()
const apiKey = (process.env.GEMINI_API_KEY || '').trim()
if (provider !== 'gemini' || !apiKey) {
  console.log(
    [
      'Gemini image generation needs IMAGE_PROVIDER=gemini and GEMINI_API_KEY in .env.',
      'The key is read from the environment only and is never written into the script.',
    ].join('\n'),
  )
  process.exit(0)
}

mkdirSync(signatureDir, { recursive: true })
mkdirSync(menuDir, { recursive: true })

const generated = []
const failed = []
let stoppedForQuota = false

for (let index = 0; index < queue.length; index += 1) {
  const dish = queue[index]
  console.log(`[${index + 1}/${queue.length}] ${dish.relativePath}`)
  try {
    const bytes = await withRetries(() => generateGemini(apiKey, dish.prompt), dish.relativePath)
    await writeWebp(bytes, dish.absolutePath)
    const size = (bytes.length / 1024).toFixed(0)
    generated.push(dish)
    console.log(`  generated (${size} KB source, saved WebP)`)
  } catch (error) {
    if (error.quota) {
      stoppedForQuota = true
      console.error(`  daily quota exhausted: ${error.message}`)
      break
    }
    failed.push({ dish, message: error.message })
    console.error(`  failed: ${error.message}`)
  }
  const more = index < queue.length - 1 && !stoppedForQuota
  if (more) {
    console.log(`  waiting ${gapMs / 1000}s`)
    await sleep(gapMs)
  }
}

const attempted = new Set([...generated.map((dish) => dish.relativePath), ...failed.map((row) => row.dish.relativePath)])
const remaining = [
  ...failed.map((row) => row.dish),
  ...queue.filter((dish) => !attempted.has(dish.relativePath) && !existsSync(dish.absolutePath)),
  ...deferred,
].filter((dish) => !existsSync(dish.absolutePath))

if (stoppedForQuota) {
  console.log('\nDaily quota is exhausted. Files already generated were kept. Re-run the same command to continue from the missing ones.')
}
printSummary({ generated, skipped, failed, remaining })

function printSummary({ generated, skipped, failed, remaining }) {
  console.log('\nMenu image summary')
  console.log(`Generated: ${generated.length}`)
  for (const dish of generated) console.log(`  + ${dish.relativePath}`)
  console.log(`Skipped: ${skipped.length}`)
  for (const dish of skipped) console.log(`  = ${dish.relativePath}`)
  console.log(`Failed: ${failed.length}`)
  for (const row of failed) console.log(`  ! ${row.dish.relativePath}: ${row.message}`)
  console.log(`Remaining: ${remaining.length}`)
  for (const dish of remaining) console.log(`  - ${dish.relativePath}`)
}

function parseArgs(argv) {
  const options = { signatureOnly: false, categories: null, limit: Infinity, dryRun: false }
  for (const arg of argv) {
    if (arg === '--signature-only') options.signatureOnly = true
    else if (arg === '--dry-run') options.dryRun = true
    else if (arg.startsWith('--categories=')) {
      options.categories = arg
        .slice('--categories='.length)
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    } else if (arg.startsWith('--limit=')) {
      const value = Number(arg.slice('--limit='.length))
      if (!Number.isInteger(value) || value < 0) throw new Error(`Invalid --limit value "${arg}"`)
      options.limit = value
    } else {
      throw new Error(`Unknown argument "${arg}"`)
    }
  }
  return options
}

function selectDishes(menu, options) {
  const filtered = menu.filter((dish) => {
    if (!options.signatureOnly && !options.categories) return true
    if (options.signatureOnly && dish.signature) return true
    if (options.categories?.includes(dish.categoryId)) return true
    return false
  })
  const seen = new Set()
  return filtered.filter((dish) => {
    if (seen.has(dish.relativePath)) return false
    seen.add(dish.relativePath)
    return true
  })
}

function readMenu(path) {
  const text = readFileSync(path, 'utf8')
  const dishes = []
  let categoryId = ''
  let categoryLabel = ''
  for (const line of text.split(/\r?\n/)) {
    const category = line.match(/^\s*id:\s*'([^']+)',\s*$/)
    if (category) {
      categoryId = category[1]
      continue
    }
    const label = line.match(/^\s*label:\s*'([^']+)',\s*$/)
    if (label) {
      categoryLabel = label[1]
      continue
    }
    const item = line.match(/item\('([^']+)',\s*'([^']+)',\s*(?:'mrp'|\d+),\s*'(?:veg|nonveg)'\)/)
    if (!item || !categoryId) continue
    const [, id, name] = item
    const signature = signatureByName[name]
    const filename = signature?.file ?? `${id}.webp`
    const directory = signature ? signatureDir : menuDir
    const detail = signature?.detail ?? `${name}, from the ${categoryLabel} section of the menu.`
    dishes.push({
      id,
      name,
      categoryId,
      categoryLabel,
      signature: Boolean(signature),
      filename,
      absolutePath: resolve(directory, filename),
      relativePath: `${signature ? 'public/images/signature' : 'public/images/menu'}/${filename}`,
      prompt: `${detail} ${style}`,
    })
  }
  return dishes
}

async function withRetries(task, label) {
  const retries = 3
  let lastError
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task()
    } catch (error) {
      lastError = error
      if (error.quota || !error.retryable || attempt === retries) throw error
      const wait = 2000 * 2 ** attempt
      console.warn(`  ${label} attempt ${attempt + 1} failed (${error.status}): ${error.message}`)
      console.warn(`  retrying in ${wait / 1000}s`)
      await sleep(wait)
    }
  }
  throw lastError
}

async function generateGemini(apiKey, prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: { aspectRatio: '4:3' },
        },
      }),
    },
  )
  const text = await response.text()
  let body = {}
  try {
    body = text ? JSON.parse(text) : {}
  } catch {
    body = {}
  }
  if (!response.ok) {
    const message = body?.error?.message || text.slice(0, 500) || `Gemini HTTP ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.quota = isDailyQuota(message)
    error.retryable = !error.quota && (response.status === 429 || response.status >= 500)
    throw error
  }
  const parts = body?.candidates?.[0]?.content?.parts ?? []
  const imagePart = parts.find((part) => part.inlineData?.data || part.inline_data?.data)
  const b64 = imagePart?.inlineData?.data || imagePart?.inline_data?.data
  if (!b64) {
    const error = new Error('Gemini response did not include image data')
    error.status = 502
    error.retryable = true
    throw error
  }
  return Buffer.from(b64, 'base64')
}

function isDailyQuota(message) {
  const text = message.toLowerCase()
  return (
    text.includes('exceeded your current quota') ||
    text.includes('quota exceeded') ||
    (text.includes('daily') && text.includes('quota')) ||
    text.includes('generate_content_free_tier_requests') ||
    (text.includes('resource_exhausted') && text.includes('quota'))
  )
}

async function writeWebp(bytes, destination) {
  const sharp = (await import('sharp')).default
  const output = await sharp(bytes)
    .resize(640, 480, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80 })
    .toBuffer()
  writeFileSync(destination, output)
  console.log(`  saved ${destination} (${(output.length / 1024).toFixed(1)} KB)`)
}

function loadEnv(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const name = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[name]) process.env[name] = value
  }
}

function sleep(ms) {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms))
}
