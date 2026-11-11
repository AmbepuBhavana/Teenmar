export type Diet = 'veg' | 'nonveg'

export type Price = number | 'mrp'

export type MenuItem = {
  id: string
  name: string
  price: Price
  diet: Diet
}

export type MenuCategory = {
  id: string
  label: string
  diet: Diet | 'mixed'
  items: MenuItem[]
}

const item = (
  id: string,
  name: string,
  price: Price,
  diet: Diet,
): MenuItem => ({ id, name, price, diet })

export const menuNotes = {
  gst: 'Extra 5% GST as printed on the menu.',
  prep: 'Preparation time: 15–20 minutes.',
  availability: 'Items subject to availability.',
} as const

export const menuCategories: MenuCategory[] = [
  {
    id: 'veg-starters',
    label: 'Veg Starters',
    diet: 'veg',
    items: [
      item('pachimirchi-paneer-vepudu', 'Pachimirchi Paneer Vepudu', 269, 'veg'),
      item('karamodi-babycorn', 'Karamodi Babycorn', 269, 'veg'),
    ],
  },
  {
    id: 'nonveg-starters',
    label: 'Non-Veg Starters',
    diet: 'nonveg',
    items: [
      item('kodi-chips-kaju-chicken-pakodi', 'Kodi Chips / Kaju Chicken Pakodi', 319, 'nonveg'),
      item('karimnagar-chicken-wings', 'Karimnagar Chicken Wings', 289, 'nonveg'),
      item('pachimirchi-kodi-vepudu', 'Pachimirchi Kodi Vepudu', 289, 'nonveg'),
      item('miriyala-pottelu-mansam-vepudu', 'Miriyala Pottelu Mansam Vepudu', 369, 'nonveg'),
      item('puntikura-mutton-mutton-gee-roast', 'Puntikura Mutton / Mutton Gee Roast', 369, 'nonveg'),
      item('chepa-pakodi', 'Chepa Pakodi', 339, 'nonveg'),
      item('ellipaya-royyala-vepudu', 'Ellipaya Royyala Vepudu', 349, 'nonveg'),
    ],
  },
  {
    id: 'veg-pulao',
    label: 'Veg Pulao',
    diet: 'veg',
    items: [
      item('veg-pulao', 'Veg Pulao', 239, 'veg'),
      item('kothimera-paneer-pulao', 'Kothimera Paneer Pulao', 259, 'veg'),
      item('kaju-pulao', 'Kaju Pulao', 279, 'veg'),
    ],
  },
  {
    id: 'nonveg-pulao',
    label: 'Non-Veg Pulao',
    diet: 'nonveg',
    items: [
      item('rama-rao-gari-mutton-pulao', 'Rama Rao Gari Mutton Pulao', 369, 'nonveg'),
      item('guntur-kodi-pulao', 'Guntur Kodi Pulao', 309, 'nonveg'),
      item('royyala-vepudu-pulao', 'Royyala Vepudu Pulao', 369, 'nonveg'),
      item('puntikura-chicken-biryani', 'Puntikura Chicken Biryani', 349, 'nonveg'),
      item('puntikura-mutton-biryani', 'Puntikura Mutton Biryani', 369, 'nonveg'),
    ],
  },
  {
    id: 'salads',
    label: 'Salads',
    diet: 'veg',
    items: [
      item('onion-salad', 'Onion Salad', 49, 'veg'),
      item('lacha-salad-green-salad', 'Lacha Salad / Green Salad', 89, 'veg'),
    ],
  },
  {
    id: 'veg-soups',
    label: 'Veg Soups',
    diet: 'veg',
    items: [
      item('tomato-soup-veg-corn-soup', 'Tomato Soup / Veg Corn Soup', 129, 'veg'),
      item('lemon-coriander-soup', 'Lemon Coriander Soup', 129, 'veg'),
      item('veg-hot-sour-soup', 'Veg Hot & Sour Soup', 129, 'veg'),
      item('veg-manchow-soup', 'Veg Manchow Soup', 129, 'veg'),
    ],
  },
  {
    id: 'nonveg-soups',
    label: 'Non-Veg Soups',
    diet: 'nonveg',
    items: [
      item('chicken-corn-soup', 'Chicken Corn Soup', 159, 'nonveg'),
      item('chicken-hot-sour-soup', 'Chicken Hot & Sour Soup', 159, 'nonveg'),
      item('chicken-manchow-soup', 'Chicken Manchow Soup', 159, 'nonveg'),
      item('chicken-lemon-coriander-soup', 'Chicken Lemon Coriander Soup', 159, 'nonveg'),
    ],
  },
  {
    id: 'veg-chinese-starters',
    label: 'Veg Chinese Starters',
    diet: 'veg',
    items: [
      item('finger-chips', 'Finger Chips', 169, 'veg'),
      item('veg-manchuria-dry', 'Veg Manchuria Dry', 219, 'veg'),
      item('gobi-manchuria-gobi-65', 'Gobi Manchuria / Gobi 65', 229, 'veg'),
      item('crispy-corn', 'Crispy Corn', 219, 'veg'),
      item('babycorn-65', 'Babycorn 65', 249, 'veg'),
      item('babycorn-coriander-fry', 'Babycorn Coriander Fry', 249, 'veg'),
      item('babycorn-manchuria', 'Babycorn Manchuria', 249, 'veg'),
      item('chilli-babycorn-baby-corn-majestic', 'Chilli Babycorn / Baby Corn Majestic', 249, 'veg'),
      item('crispy-babycorn', 'Crispy Babycorn', 249, 'veg'),
      item('chilli-mushroom-mushroom-65', 'Chilli Mushroom / Mushroom 65', 259, 'veg'),
      item('mushroom-manchuria-pepper-mushroom', 'Mushroom Manchuria / Pepper Mushroom', 259, 'veg'),
      item('paneer-65-chilly-paneer', 'Paneer 65 / Chilly Paneer', 269, 'veg'),
      item('paneer-manchuria-paneer-majestic', 'Paneer Manchuria / Paneer Majestic', 269, 'veg'),
    ],
  },
  {
    id: 'nonveg-chinese-starters',
    label: 'Non-Veg Chinese Starters',
    diet: 'nonveg',
    items: [
      item('egg-65-chilli-egg', 'Egg 65 / Chilli Egg', 229, 'nonveg'),
      item('chicken-65-chicken-manchuria', 'Chicken 65 / Chicken Manchuria', 289, 'nonveg'),
      item('chilli-chicken-chicken-fry', 'Chilli Chicken / Chicken Fry', 289, 'nonveg'),
      item('pepper-chicken-chicken-majestic', 'Pepper Chicken / Chicken Majestic', 289, 'nonveg'),
      item('chicken-drumsticks', 'Chicken Drumsticks', 289, 'nonveg'),
      item('crispy-chicken', 'Crispy Chicken', 289, 'nonveg'),
      item('apollo-fish-chilli-fish', 'Apollo Fish / Chilli Fish', 349, 'nonveg'),
      item('fried-fish-loose-prawns-chilli-prawns', 'Fried Fish / Loose Prawns / Chilli Prawns', 349, 'nonveg'),
    ],
  },
  {
    id: 'veg-tandoor-starters',
    label: 'Veg Tandoor Starters',
    diet: 'veg',
    items: [
      item('paneer-tikka-malai-paneer-tikka', 'Paneer Tikka / Malai Paneer Tikka', 289, 'veg'),
      item('veg-harabara-kebab', 'Veg Harabara Kebab', 289, 'veg'),
      item('paneer-hariyali-kebab', 'Paneer Hariyali Kebab', 289, 'veg'),
    ],
  },
  {
    id: 'nonveg-tandoor-starters',
    label: 'Non-Veg Tandoor Starters',
    diet: 'nonveg',
    items: [
      item('chicken-tikka', 'Chicken Tikka', 319, 'nonveg'),
      item('tandoori-chicken-half', 'Tandoori Chicken Half', 219, 'nonveg'),
      item('tandoori-chicken-full', 'Tandoori Chicken Full', 529, 'nonveg'),
      item('tangdi-kebab-half-2-pcs', 'Tangdi Kebab Half 2 pcs', 199, 'nonveg'),
      item('full-tangdi-kebab-4-piece', 'Full Tangdi Kebab 4 Piece', 339, 'nonveg'),
      item('chilly-chicken-kebab', 'Chilly Chicken Kebab', 319, 'nonveg'),
      item('murg-malai-kebab', 'Murg Malai Kebab', 319, 'nonveg'),
      item('chicken-hariyali-kebab', 'Chicken Hariyali Kebab', 319, 'nonveg'),
      item('fish-tikka-malai-fish-tikka', 'Fish Tikka / Malai Fish Tikka', 349, 'nonveg'),
    ],
  },
  {
    id: 'veg-noodles',
    label: 'Veg Noodles',
    diet: 'veg',
    items: [
      item('veg-soft-noodles', 'Veg Soft Noodles', 219, 'veg'),
      item('veg-schezwan-noodles', 'Veg Schezwan Noodles', 229, 'veg'),
    ],
  },
  {
    id: 'nonveg-noodles',
    label: 'Non-Veg Noodles',
    diet: 'nonveg',
    items: [
      item('egg-soft-noodles', 'Egg Soft Noodles', 229, 'nonveg'),
      item('egg-schezwan-noodles', 'Egg Schezwan Noodles', 239, 'nonveg'),
      item('chicken-soft-noodles', 'Chicken Soft Noodles', 259, 'nonveg'),
      item('chicken-schezwan-noodles', 'Chicken Schezwan Noodles', 269, 'nonveg'),
      item('prawns-soft-noodles', 'Prawns Soft Noodles', 309, 'nonveg'),
    ],
  },
  {
    id: 'veg-fried-rice',
    label: 'Veg Fried Rice',
    diet: 'veg',
    items: [
      item('veg-fried-rice-jeera-rice', 'Veg Fried Rice / Jeera Rice', 219, 'veg'),
      item('schezwan-veg-fried-rice', 'Schezwan Veg Fried Rice', 229, 'veg'),
      item('veg-mix-fried-rice', 'Veg Mix Fried Rice', 239, 'veg'),
    ],
  },
  {
    id: 'nonveg-fried-rice',
    label: 'Non-Veg Fried Rice',
    diet: 'nonveg',
    items: [
      item('egg-fried-rice', 'Egg Fried Rice', 239, 'nonveg'),
      item('schezwan-egg-fried-rice', 'Schezwan Egg Fried Rice', 249, 'nonveg'),
      item('chicken-fried-rice', 'Chicken Fried Rice', 269, 'nonveg'),
      item('schezwan-chicken-fried-rice', 'Schezwan Chicken Fried Rice', 279, 'nonveg'),
      item('prawns-fried-rice', 'Prawns Fried Rice', 309, 'nonveg'),
    ],
  },
  {
    id: 'veg-gravies',
    label: 'Veg Gravies',
    diet: 'veg',
    items: [
      item('dal-fry-dal-tadka-alu-palak', 'Dal Fry / Dal Tadka / Alu Palak', 209, 'veg'),
      item('mix-veg-curry-alu-gobi-masala', 'Mix Veg Curry / Alu Gobi Masala', 219, 'veg'),
      item('kadai-veg', 'Kadai Veg', 239, 'veg'),
      item('veg-chatpat', 'Veg Chatpat', 259, 'veg'),
      item('plain-palak', 'Plain Palak', 199, 'veg'),
      item('methi-cheman', 'Methi Cheman', 259, 'veg'),
      item('babycorn-masala', 'Babycorn Masala', 249, 'veg'),
      item('paneer-curry-palak-paneer-kadai-paneer', 'Paneer Curry / Palak Paneer / Kadai Paneer', 279, 'veg'),
      item('paneer-butter-masala', 'Paneer Butter Masala', 289, 'veg'),
      item('paneer-chatpat-paneer-tikka-masala', 'Paneer Chatpat / Paneer Tikka Masala', 289, 'veg'),
      item('kaju-paneer-masala', 'Kaju Paneer Masala', 309, 'veg'),
      item('mushroom-masala', 'Mushroom Masala', 259, 'veg'),
    ],
  },
  {
    id: 'nonveg-gravies',
    label: 'Non-Veg Gravies',
    diet: 'nonveg',
    items: [
      item('egg-burji-egg-curry-egg-masala', 'Egg Burji / Egg Curry / Egg Masala', 219, 'nonveg'),
      item('kaju-chicken-curry', 'Kaju Chicken Curry', 269, 'nonveg'),
      item('kadai-chicken-butter-chicken', 'Kadai Chicken / Butter Chicken', 319, 'nonveg'),
      item('chicken-afgani-chicken-masala', 'Chicken Afgani / Chicken Masala', 319, 'nonveg'),
      item('chicken-chettinad-chicken-chatpat', 'Chicken Chettinad / Chicken Chatpat', 319, 'nonveg'),
      item('chicken-punjabi-methi-chicken', 'Chicken Punjabi / Methi Chicken', 319, 'nonveg'),
      item('chicken-tikka-masala', 'Chicken Tikka Masala', 319, 'nonveg'),
      item('chicken-mughalai', 'Chicken Mughalai', 329, 'nonveg'),
      item('coriander-chicken-curry', 'Coriander Chicken Curry', 359, 'nonveg'),
      item('kaju-chicken-masala', 'Kaju Chicken Masala', 359, 'nonveg'),
    ],
  },
  {
    id: 'seafood',
    label: 'Seafood',
    diet: 'nonveg',
    items: [
      item('andra-fish-fish-curry-fish-masala', 'Andra Fish / Fish Curry / Fish Masala', 359, 'nonveg'),
      item('andra-prawns-prawns-curry-prawns-masala', 'Andra Prawns / Prawns Curry / Prawns Masala', 369, 'nonveg'),
    ],
  },
  {
    id: 'mutton',
    label: 'Mutton',
    diet: 'nonveg',
    items: [
      item('mutton-masala-kadai-mutton', 'Mutton Masala / Kadai Mutton', 369, 'nonveg'),
      item('telangana-mutton-curry', 'Telangana Mutton Curry', 369, 'nonveg'),
      item('mutton-rogan-josh', 'Mutton Rogan Josh', 369, 'nonveg'),
    ],
  },
  {
    id: 'indian-breads',
    label: 'Indian Breads',
    diet: 'veg',
    items: [
      item('pulka-roti', 'Pulka / Roti', 35, 'veg'),
      item('butter-roti', 'Butter Roti', 45, 'veg'),
      item('roomali-roti', 'Roomali Roti', 40, 'veg'),
      item('plain-naan', 'Plain Naan', 45, 'veg'),
      item('butter-naan', 'Butter Naan', 50, 'veg'),
      item('garlic-naan', 'Garlic Naan', 60, 'veg'),
      item('plain-paratha', 'Plain Paratha', 50, 'veg'),
      item('alu-paratha-lachha-paratha', 'Alu Paratha / Lachha Paratha', 75, 'veg'),
      item('stuffed-masala-kulcha', 'Stuffed Masala Kulcha', 75, 'veg'),
    ],
  },
  {
    id: 'veg-biryanis',
    label: 'Veg Biryanis',
    diet: 'veg',
    items: [
      item('veg-biryani', 'Veg Biryani', 239, 'veg'),
      item('kaju-biryani-paneer-biryani', 'Kaju Biryani / Paneer Biryani', 289, 'veg'),
      item('kaju-paneer-biryani', 'Kaju Paneer Biryani', 319, 'veg'),
      item('plain-biryani-rice', 'Plain Biryani Rice', 189, 'veg'),
    ],
  },
  {
    id: 'nonveg-biryanis',
    label: 'Non-Veg Biryanis',
    diet: 'nonveg',
    items: [
      item('egg-biryani', 'Egg Biryani', 259, 'nonveg'),
      item('chicken-dum-biryani', 'Chicken Dum Biryani', 309, 'nonveg'),
      item('chicken-dum-biryani-family-pack', 'Chicken Dum Biryani Family Pack', 609, 'nonveg'),
      item('chicken-fry-piece-biryani', 'Chicken Fry Piece Biryani', 319, 'nonveg'),
      item('spl-chicken-65-biryani', 'Spl. Chicken 65 Biryani', 339, 'nonveg'),
      item('chicken-kebab-biryani', 'Chicken Kebab Biryani', 339, 'nonveg'),
      item('fish-biryani', 'Fish Biryani', 369, 'nonveg'),
      item('prawns-biryani', 'Prawns Biryani', 389, 'nonveg'),
      item('mutton-dum-biryani', 'Mutton Dum Biryani', 369, 'nonveg'),
      item('mutton-biryani-family-pack', 'Mutton Biryani Family Pack', 729, 'nonveg'),
      item('chicken-tangdi-biryani-2-pcs', 'Chicken Tangdi Biryani (2 Pcs)', 369, 'nonveg'),
      item('chicken-tandoori-biryani-2-pcs', 'Chicken Tandoori Biryani (2 Pcs)', 369, 'nonveg'),
    ],
  },
  {
    id: 'accompaniments',
    label: 'Accompaniments',
    diet: 'veg',
    items: [
      item('plain-curd', 'Plain Curd', 39, 'veg'),
      item('onion-raitha', 'Onion Raitha', 49, 'veg'),
      item('kheera-mixed-raitha', 'Kheera Mixed Raitha', 79, 'veg'),
    ],
  },
  {
    id: 'papads',
    label: 'Papads',
    diet: 'veg',
    items: [
      item('fried-papad-roasted-papad-masala-papad', 'Fried Papad / Roasted Papad / Masala Papad', 39, 'veg'),
    ],
  },
  {
    id: 'desserts',
    label: 'Desserts',
    diet: 'veg',
    items: [
      item('double-ka-meeta-qurbani-ka-meeta', 'Double Ka Meeta / Qurbani Ka Meeta', 100, 'veg'),
      item('kaddu-ki-kheer', 'Kaddu Ki Kheer', 110, 'veg'),
      item('gulab-jamun', 'Gulab Jamun', 100, 'veg'),
      item('rabidi', 'Rabidi', 120, 'veg'),
    ],
  },
  {
    id: 'beverages',
    label: 'Beverages',
    diet: 'mixed',
    items: [
      item('tea', 'Tea', 20, 'veg'),
      item('coffee-boost-horlicks-green-tea', 'Coffee / Boost / Horlicks / Green Tea', 30, 'veg'),
      item('butter-milk', 'Butter Milk', 70, 'veg'),
      item('sweet-lassi', 'Sweet Lassi', 90, 'veg'),
      item('mineral-water', 'Mineral Water', 'mrp', 'veg'),
      item('coke-tins', 'Coke Tins', 'mrp', 'veg'),
      item('soft-drinks-300-ml', 'Soft Drinks (300 ML)', 'mrp', 'veg'),
    ],
  },
]

export const allMenuItems = menuCategories.flatMap((category) =>
  category.items.map((menuItem) => ({ ...menuItem, categoryId: category.id, categoryLabel: category.label })),
)

export function formatPrice(price: Price): string {
  return price === 'mrp' ? 'M.R.P.' : `₹${price}`
}
