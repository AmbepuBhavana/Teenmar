import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const promptsPath = resolve(root, 'docs/image-prompts.md')
const outDir = resolve(root, 'public/images/signature')
const maxBytes = 150 * 1024

loadEnv(resolve(root, '.env'))

const dishes = readPrompts(promptsPath)
const provider = (process.env.IMAGE_PROVIDER || '').trim().toLowerCase()
const keyName = {
  openai: 'OPENAI_API_KEY',
  gemini: 'GEMINI_API_KEY',
  replicate: 'REPLICATE_API_TOKEN',
}[provider]
const apiKey = keyName ? (process.env[keyName] || '').trim() : ''

if (!apiKey) {
  console.log(
    [
      'No image API key is set.',
      'Create the images manually with the prompts in docs/image-prompts.md',
      'and drop them in public/images/signature/ using the exact filenames.',
      'Or set IMAGE_PROVIDER to openai, gemini, or replicate and the matching key in .env, then run npm run images:generate.',
    ].join('\n'),
  )
  process.exit(0)
}

mkdirSync(outDir, { recursive: true })

const summary = []
for (const dish of dishes) {
  const destination = resolve(outDir, dish.filename)
  if (existsSync(destination)) {
    summary.push({ file: dish.filename, status: 'skipped (already exists)' })
    continue
  }
  let saved = false
  let lastError = 'unknown error'
  for (let attempt = 1; attempt <= 3 && !saved; attempt += 1) {
    try {
      const bytes = await generate(provider, apiKey, dish.prompt)
      await writeWebp(bytes, destination)
      saved = true
      summary.push({ file: dish.filename, status: `generated (attempt ${attempt})` })
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
      if (attempt < 3) console.warn(`${dish.filename} attempt ${attempt} failed: ${lastError}`)
    }
  }
  if (!saved) summary.push({ file: dish.filename, status: `failed: ${lastError}` })
}

console.log('\nSignature image summary')
for (const row of summary) console.log(`- ${row.file}: ${row.status}`)

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

function readPrompts(path) {
  const text = readFileSync(path, 'utf8')
  const dishes = []
  let filename = ''
  let lines = []
  const flush = () => {
    const prompt = lines.join('\n').trim()
    if (filename && prompt) dishes.push({ filename, prompt })
    filename = ''
    lines = []
  }
  for (const line of text.split(/\r?\n/)) {
    const heading = line.match(/^###\s+(\S+\.webp)\s*$/)
    if (heading) {
      flush()
      filename = heading[1]
      continue
    }
    if (filename) lines.push(line)
  }
  flush()
  if (dishes.length === 0) throw new Error(`No prompts found in ${path}`)
  return dishes
}

async function generate(provider, key, prompt) {
  if (provider === 'openai') return generateOpenAI(key, prompt)
  if (provider === 'gemini') return generateGemini(key, prompt)
  if (provider === 'replicate') return generateReplicate(key, prompt)
  throw new Error(`Unknown IMAGE_PROVIDER "${provider}". Use openai, gemini, or replicate.`)
}

async function generateOpenAI(key, prompt) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      output_format: 'png',
    }),
  })
  const body = await response.json()
  if (!response.ok) throw new Error(body?.error?.message || `OpenAI HTTP ${response.status}`)
  const b64 = body?.data?.[0]?.b64_json
  if (!b64) throw new Error('OpenAI response did not include image data')
  return Buffer.from(b64, 'base64')
}

async function generateGemini(key, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${encodeURIComponent(key)}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1, aspectRatio: '1:1' },
    }),
  })
  const body = await response.json()
  if (!response.ok) throw new Error(body?.error?.message || `Gemini HTTP ${response.status}`)
  const b64 = body?.predictions?.[0]?.bytesBase64Encoded
  if (!b64) throw new Error('Gemini response did not include image data')
  return Buffer.from(b64, 'base64')
}

async function generateReplicate(key, prompt) {
  const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'wait=60',
    },
    body: JSON.stringify({
      input: {
        prompt,
        width: 1024,
        height: 1024,
        output_format: 'png',
      },
    }),
  })
  let body = await response.json()
  if (!response.ok) throw new Error(body?.detail || body?.error || `Replicate HTTP ${response.status}`)
  for (let poll = 0; poll < 20 && body.status !== 'succeeded' && body.status !== 'failed'; poll += 1) {
    await new Promise((resolveWait) => setTimeout(resolveWait, 3000))
    const next = await fetch(body.urls.get, { headers: { Authorization: `Bearer ${key}` } })
    body = await next.json()
  }
  if (body.status !== 'succeeded') throw new Error(body.error || `Replicate status ${body.status}`)
  const imageUrl = Array.isArray(body.output) ? body.output[0] : body.output
  if (!imageUrl) throw new Error('Replicate response did not include an image URL')
  const image = await fetch(imageUrl)
  if (!image.ok) throw new Error(`Replicate image download HTTP ${image.status}`)
  return Buffer.from(await image.arrayBuffer())
}

async function writeWebp(bytes, destination) {
  const sharp = (await import('sharp')).default
  let quality = 82
  let size = 1024
  let output = await sharp(bytes).resize(size, size, { fit: 'cover' }).webp({ quality }).toBuffer()
  while (output.length > maxBytes && (quality > 50 || size > 640)) {
    if (quality > 50) quality -= 4
    else size -= 64
    output = await sharp(bytes).resize(size, size, { fit: 'cover' }).webp({ quality }).toBuffer()
  }
  if (output.length > maxBytes) {
    throw new Error(`WebP is still ${output.length} bytes after compression`)
  }
  writeFileSync(destination, output)
  const kb = (output.length / 1024).toFixed(1)
  console.log(`saved ${destination} (${kb} KB, quality ${quality}, ${size}px)`)
}
