export type SignatureDish = {
  name: string
  price: number
  description: string
  menuCategory: string
  plateColor1: string
  plateColor2: string
  grain: number
}

export const signatureDishes: SignatureDish[] = [
  {
    name: 'Chicken Fry Piece Biryani',
    price: 319,
    description: 'Biryani with fried chicken pieces, from our non-veg biryani list.',
    menuCategory: 'Non-Veg Biryanis',
    plateColor1: '#e8a21f',
    plateColor2: '#8a4a0b',
    grain: 1,
  },
  {
    name: 'Spl. Chicken 65 Biryani',
    price: 339,
    description: "Biryani rice paired with the restaurant's Chicken 65.",
    menuCategory: 'Non-Veg Biryanis',
    plateColor1: '#e4881d',
    plateColor2: '#7a2a0c',
    grain: 1,
  },
  {
    name: 'Telangana Mutton Curry',
    price: 369,
    description: 'A regional mutton curry from the mutton section, built for rice and roti.',
    menuCategory: 'Mutton',
    plateColor1: '#c2451a',
    plateColor2: '#5a1409',
    grain: 0.1,
  },
  {
    name: 'Karimnagar Chicken Wings',
    price: 289,
    description: 'Telugu-style chicken wings from the non-veg starters, named for Karimnagar.',
    menuCategory: 'Non-Veg Starters',
    plateColor1: '#d1481f',
    plateColor2: '#6b150b',
    grain: 0.25,
  },
  {
    name: 'Pachimirchi Kodi Vepudu',
    price: 289,
    description: 'A green-chilli chicken fry from the Telugu non-veg starters.',
    menuCategory: 'Non-Veg Starters',
    plateColor1: '#7a9a2e',
    plateColor2: '#2f4310',
    grain: 0.15,
  },
  {
    name: 'Prawns Biryani',
    price: 389,
    description: 'Prawns served in the biryani section, for seafood lovers.',
    menuCategory: 'Non-Veg Biryanis',
    plateColor1: '#f08a3a',
    plateColor2: '#8a2f0d',
    grain: 1,
  },
  {
    name: 'Rama Rao Gari Mutton Pulao',
    price: 369,
    description: 'A mutton pulao from the non-veg pulao list.',
    menuCategory: 'Non-Veg Pulao',
    plateColor1: '#d9a441',
    plateColor2: '#6e3d0c',
    grain: 1,
  },
  {
    name: 'Paneer Butter Masala',
    price: 289,
    description: 'A vegetarian gravy classic from the veg gravies list.',
    menuCategory: 'Veg Gravies',
    plateColor1: '#f28a19',
    plateColor2: '#85170d',
    grain: 0.1,
  },
]

/** Representative source photos keyed by exact dish name. Display them without cropping. */
export const IMG: Record<string, string> = {
  // ── Pointing directly at source files so photos display without any build step.
  // ── After running `npm run images:copy` or `npm run images:plates`, switch to:
  // ── '/images/signature/plates/<slug>.jpg'
  'Chicken Fry Piece Biryani':    '/images/chicken fry piece biryani.jpg',
  'Spl. Chicken 65 Biryani':      '/images/spl chicek biryani.jpg',
  'Telangana Mutton Curry':       '/images/telangana mutton curry.jpg',
  'Karimnagar Chicken Wings':     '/images/karimnagar chicken wings.jpg',
  'Pachimirchi Kodi Vepudu':      '/images/kodi-vepudu.jpg',
  'Prawns Biryani':               '/images/𝐅𝐨𝐨𝐝 𝐒𝐭𝐲𝐥𝐢𝐧𝐠 𝐏𝐫𝐚𝐰𝐧 𝐁𝐢𝐫𝐲𝐚𝐧𝐢! 🍤🍚.jpg',
  'Rama Rao Gari Mutton Pulao':   '/images/rama roa mutton pulav.jpg',
  'Paneer Butter Masala':         '/images/panner butter masala.jpg',
}

export const signatureDishNames = new Set(signatureDishes.map((dish) => dish.name))
