import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const style =
  'Professional editorial food photograph, shot from a 45-degree overhead angle, the dish served in a traditional brass or copper vessel on a dark rustic wooden table, warm cinematic restaurant lighting, natural steam, shallow depth of field, realistic textures, rich colours, 4:3 composition with the dish centred and 12% empty margin around it, no text, no logos, no people, no hands, no watermark, not illustrated, not CGI.'

const signatureDetail = {
  'Chicken Fry Piece Biryani':
    'Aromatic Telugu-style chicken biryani with fried chicken pieces on top, long-grain rice, fried onions, fresh coriander and mint.',
  'Spl. Chicken 65 Biryani':
    'Biryani rice topped with crispy red Chicken 65 pieces, curry leaves and green chillies.',
  'Telangana Mutton Curry':
    'Rich dark-red Telangana-style mutton curry with visible mutton pieces and glossy oil on top, served with steamed rice on the side.',
  'Karimnagar Chicken Wings':
    'Glazed spicy Telugu-style chicken wings stacked on a dark plate, with sliced onion and lemon wedge.',
  'Pachimirchi Kodi Vepudu':
    'Green-chilli chicken fry, dry, deep green and golden pieces with whole green chillies and curry leaves.',
  'Prawns Biryani': 'Biryani with large whole prawns on top, saffron-coloured rice, fresh coriander.',
  'Rama Rao Gari Mutton Pulao':
    'Mutton pulao with mutton pieces, whole spices and fried onions, lightly spiced rice.',
  'Paneer Butter Masala':
    'Creamy orange paneer butter masala with paneer cubes, a swirl of cream and coriander, with a naan on the side.',
}

const categoryOrder = ['nonveg-biryanis', 'veg-biryanis', 'mutton', 'nonveg-starters']

export function loadDemoSet(root) {
  const menu = readMenu(resolve(root, 'src/data/menu.ts'))
  const { names, files } = readSignature(resolve(root, 'src/data/signature.ts'))
  const byName = new Map(menu.map((dish) => [dish.name, dish]))
  const signature = names.map((name) => {
    const dish = byName.get(name)
    if (!dish) throw new Error(`Signature dish "${name}" is not in menu.ts`)
    if (!files[name]) throw new Error(`Signature dish "${name}" has no file in signature.ts`)
    return dish
  })
  const signatureNames = new Set(names)
  const rest = []
  for (const categoryId of categoryOrder) {
    for (const dish of menu) {
      if (dish.categoryId === categoryId && !signatureNames.has(dish.name)) rest.push(dish)
    }
  }
  return [...signature, ...rest].map((dish, index) => ({
    no: String(index + 1).padStart(2, '0'),
    key: dish.id,
    dish: dish.name,
    category: dish.categoryLabel,
    prompt: `${signatureDetail[dish.name] ?? `${dish.name}, from the ${dish.categoryLabel} section of the menu.`} ${style}`,
    signatureFile: files[dish.name] ?? '',
  }))
}

function readSignature(path) {
  const text = readFileSync(path, 'utf8')
  const dishes = text.slice(text.indexOf('signatureDishes'), text.indexOf('export const IMG'))
  const names = [...dishes.matchAll(/name:\s*'([^']+)'/g)].map((match) => match[1])
  const files = {}
  for (const match of text.matchAll(/'([^']+)':\s*'\/images\/signature\/([^']+)'/g)) {
    files[match[1]] = match[2]
  }
  return { names, files }
}

function readMenu(path) {
  const dishes = []
  let categoryId = ''
  let categoryLabel = ''
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
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
    dishes.push({ id: item[1], name: item[2], categoryId, categoryLabel })
  }
  return dishes
}
