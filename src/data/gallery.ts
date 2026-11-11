import { images } from './images'

export type GalleryCategory =
  | 'all'
  | 'biryanis'
  | 'telugu'
  | 'veg-starters'
  | 'nonveg-starters'
  | 'tandoori'
  | 'chinese'
  | 'seafood'
  | 'desserts'
  | 'ambience'

export type GalleryItem = {
  id: string
  title: string
  category: Exclude<GalleryCategory, 'all'>
  src: string
  alt: string
  featured?: boolean
}

/** Flip to false once original Teenmaar photographs replace the stand-ins. */
export const USING_STOCK_PHOTOS = true

const MIN_FILTER_IMAGES = 3

export const galleryFilters: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'biryanis', label: 'Signature Biryanis' },
  { id: 'telugu', label: 'Telugu Specialities' },
  { id: 'veg-starters', label: 'Veg Starters' },
  { id: 'nonveg-starters', label: 'Non-Veg Starters' },
  { id: 'tandoori', label: 'Tandoori' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'seafood', label: 'Seafood' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'ambience', label: 'Restaurant Ambience' },
]

export const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Dum Biryani',
    category: 'biryanis',
    src: images.heroBiryani,
    alt: 'Close-up of long-grain biryani with spices and herbs',
    featured: true,
  },
  {
    id: 'g2',
    title: 'Fry Piece Biryani',
    category: 'biryanis',
    src: images.chickenFryBiryani,
    alt: 'Chicken fry piece biryani in a metal serving bowl',
  },
  {
    id: 'g3',
    title: 'Hyderabadi-style Biryani',
    category: 'biryanis',
    src: images.chicken65Biryani,
    alt: 'Saffron-tinted biryani rice with fried onions',
  },
  {
    id: 'g4',
    title: 'Pachimirchi Kodi Vepudu',
    category: 'telugu',
    src: images.kodiVepudu,
    alt: 'Chicken pieces in a spiced creamy gravy with coriander',
    featured: true,
  },
  {
    id: 'g5',
    title: 'Telangana Mutton Curry',
    category: 'telugu',
    src: images.muttonCurry,
    alt: 'Rich mutton curry in a traditional bowl',
  },
  {
    id: 'g6',
    title: 'Karimnagar Chicken Wings',
    category: 'telugu',
    src: images.chickenWings,
    alt: 'Charred chicken wings with spice marinade',
  },
  {
    id: 'g7',
    title: 'Paneer Starters',
    category: 'veg-starters',
    src: images.vegStarters,
    alt: 'Golden paneer starter plate',
  },
  {
    id: 'g8',
    title: 'Babycorn Fry',
    category: 'veg-starters',
    src: images.storySpice,
    alt: 'Warm spice and vegetable starter styling',
  },
  {
    id: 'g9',
    title: 'Chicken Starters',
    category: 'nonveg-starters',
    src: images.nonvegStarters,
    alt: 'Crispy non-vegetarian chicken starter',
    featured: true,
  },
  {
    id: 'g10',
    title: 'Tandoori Chicken',
    category: 'tandoori',
    src: images.tandoori,
    alt: 'Tandoori chicken with charred edges',
  },
  {
    id: 'g11',
    title: 'Tandoor Breads',
    category: 'tandoori',
    src: images.naan,
    alt: 'Naan bread beside a spiced chicken gravy',
  },
  {
    id: 'g12',
    title: 'Indo-Chinese Plates',
    category: 'chinese',
    src: images.chinese,
    alt: 'Indo-Chinese noodles and starter styling',
  },
  {
    id: 'g15',
    title: 'Festive Sweets',
    category: 'desserts',
    src: images.gulab,
    alt: 'Indian festive dessert in syrup',
  },
  {
    id: 'g16',
    title: 'Milk Sweets',
    category: 'desserts',
    src: images.desserts,
    alt: 'Creamy Indian dessert presentation',
  },
  {
    id: 'g17',
    title: 'Dining Room',
    category: 'ambience',
    src: images.ambience,
    alt: 'Warm restaurant dining interior',
    featured: true,
  },
  {
    id: 'g18',
    title: 'Table Setting',
    category: 'ambience',
    src: images.ambienceTwo,
    alt: 'Restaurant table setting with warm lighting',
  },
]

export const allGalleryItems: GalleryItem[] = [
  {
    id: 'restaurant-exterior',
    title: 'Teenmaar Telugu Kitchen',
    category: 'ambience',
    src: images.storyFeast,
    alt: 'Exterior of Teenmaar Telugu Kitchen',
    featured: true,
  },
  {
    id: 'restaurant-interior',
    title: 'Dining Hall',
    category: 'ambience',
    src: images.storySpice,
    alt: 'Dining hall inside Teenmaar Telugu Kitchen',
  },
  {
    id: 'restaurant-aerial',
    title: 'Aerial View',
    category: 'ambience',
    src: images.restaurantAerial,
    alt: 'Aerial view of Teenmaar Telugu Kitchen',
  },
  {
    id: 'restaurant-hall',
    title: 'Banquet Hall',
    category: 'ambience',
    src: images.restaurantHall,
    alt: 'Spacious banquet hall with woven ceiling decor at Teenmaar Telugu Kitchen',
    featured: true,
  },
  {
    id: 'restaurant-sign',
    title: 'Restaurant Sign',
    category: 'ambience',
    src: images.restaurantSign,
    alt: 'Illuminated Teenmaar sign in the dining room',
  },
  {
    id: 'restaurant-buffet',
    title: 'Buffet Area',
    category: 'ambience',
    src: images.restaurantBuffet,
    alt: 'Buffet service area inside Teenmaar Telugu Kitchen',
  },
  {
    id: 'restaurant-ice-cream-counter',
    title: 'Ice Cream Counter',
    category: 'ambience',
    src: images.restaurantIceCreamCounter,
    alt: 'Ice cream counter at Teenmaar Telugu Kitchen',
    featured: true,
  },
  {
    id: 'restaurant-dining-room',
    title: 'Dining Room',
    category: 'ambience',
    src: images.restaurantDiningRoom,
    alt: 'Dining room and table seating inside Teenmaar Telugu Kitchen',
  },
  {
    id: 'restaurant-reception',
    title: 'Reception',
    category: 'ambience',
    src: images.restaurantReception,
    alt: 'Reception counter decorated with flowers at Teenmaar Telugu Kitchen',
  },
]

/** Filters with fewer than three matching photos stay hidden until the gallery is filled. */
export function visibleGalleryFilters(items: GalleryItem[] = galleryItems) {
  return galleryFilters.filter((filter) => {
    if (filter.id === 'all') return true
    return items.filter((item) => item.category === filter.id).length >= MIN_FILTER_IMAGES
  })
}
