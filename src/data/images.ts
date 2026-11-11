/**
 * Central image registry.
 *
 * STATUS: Temporary licensed Unsplash photography, stored locally under
 * /images, because original Teenmaar Telugu Kitchen photographs are not
 * in this project. UI copy must not present these as restaurant-owned photos.
 *
 * Replace files in public/images/ with originals; keep these path keys.
 */
export const imageSource: 'stock-placeholder' | 'original' = 'original'

export const images = {
  heroBackground: '/images/hero page.png',
  heroBiryani: '/images/Golden Indian Festive Feast.png',
  /** Real Teenmaar restaurant exterior — replaces stock placeholder */
  storyFeast: '/images/teenmar 1.webp',
  /** Real Teenmaar dining hall interior — replaces stock placeholder */
  storySpice: '/images/teenmar2.webp',
  restaurantAerial: '/images/tenmmar 3.jpg',
  restaurantHall: '/images/teenMAR4.webp',
  restaurantSign: '/images/TEENMAR5.webp',
  restaurantBuffet: '/images/TEENMAR6.webp',
  restaurantIceCreamCounter: '/images/TEENMAR7.webp',
  restaurantDiningRoom: '/images/TEENMAR8.webp',
  restaurantReception: '/images/TEENMAR9.webp',
  chickenFryBiryani: '/images/chicken-fry-biryani.jpg',
  chicken65Biryani: '/images/chicken-65-biryani.jpg',
  muttonCurry: '/images/mutton-curry.jpg',
  chickenWings: '/images/chicken-wings.jpg',
  kodiVepudu: '/images/kodi-vepudu.jpg',
  prawnsBiryani: '/images/prawns-biryani.jpg',
  muttonPulao: '/images/mutton-pulao.jpg',
  paneerButter: '/images/paneer-butter.jpg',
  vegStarters: '/images/veg-starters.jpg',
  nonvegStarters: '/images/nonveg-starters.jpg',
  tandoori: '/images/tandoori.jpg',
  chinese: '/images/chinese.jpg',
  seafood: '/images/seafood.jpg',
  desserts: '/images/desserts.jpg',
  ambience: '/images/ambience.jpg',
  ambienceTwo: '/images/ambience-two.jpg',
  tableSpread: '/images/table-spread.jpg',
  naan: '/images/naan.jpg',
  gulab: '/images/gulab.jpg',
} as const

export const assetChecklist = [
  'Hero: close-up of house chicken biryani in a traditional vessel',
  'Signature dishes: original plated photos of all 8 featured items',
  'Gallery: Signature Biryanis, Telugu Specialities, Veg/Non-Veg Starters, Tandoori, Chinese, Seafood, Desserts',
  'Restaurant ambience interiors (dining room, takeaway counter, exterior signage)',
  'Brand logo / wordmark in high-resolution SVG or PNG',
  'Social sharing image photographed or designed from original brand assets',
] as const
