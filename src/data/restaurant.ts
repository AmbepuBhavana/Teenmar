import { images } from './images'

export const ZOMATO_URL = 'https://www.zomato.com/hyderabad/teenmaar-telugu-kitchen-ghatkesar-secunderabad'

export const ZOMATO_DELIVERY_RATING = { score: 4.3, count: 1166 } as const

export const DEMO_MODE = false

// Confirm with the owner: do they take table reservations, the WhatsApp number, group-size and notice rules.
export const SHOW_RESERVATION: boolean = true
export const WHATSAPP_NUMBER: string = '917659853475'
export const REGIONS = ['Telangana', 'Andhra', 'Rayalaseema'] as const

export const restaurant = {
  name: 'Teenmaar Telugu Kitchen',
  brand: 'TeenmAAR',
  maintainedBy: 'Bells Food Company',
  type: 'Restaurant & Takeaway',
  tagline: 'The Art of Telugu Flavour.',
  visualIdentity: 'The Telugu Fire — A Modern Telugu Food Experience',
  address: {
    line1: '8-27, Aushapur Bypass Road',
    line2: 'Aushapur, Ghatkesar',
    city: 'Aushapur',
    region: 'Telangana',
    postalCode: '501301',
    country: 'India',
    formatted:
      '8-27, Aushapur Bypass Road, Aushapur, Ghatkesar, Telangana - 501301.',
  },
  phones: [
    { label: 'Restaurant 1', number: '7659853475', href: 'tel:+917659853475' },
    { label: 'Restaurant 2', number: '8143246137', href: 'tel:+918143246137' },
  ],

  website: 'https://www.teenmaartelugukitchen.com',
  social: {
    facebook: {
      label: 'Teenmaar Telugu Kitchen',
      href: 'https://www.facebook.com/61563545128050',
    },
    instagram: {
      label: '@Teenmaar_Telugu_Kitchen',
      href: 'https://www.instagram.com/Teenmaar_Telugu_Kitchen/',
    },
    x: {
      label: '@Teenmaar_Telugu',
      href: 'https://x.com/Teenmaar_Telugu',
    },
  },
  zomato: {
    url: ZOMATO_URL,
    deliveryRating: ZOMATO_DELIVERY_RATING.score,
    deliveryRatingCount: ZOMATO_DELIVERY_RATING.count,
    note: 'Zomato delivery rating',
  },
  categories: [
    'Biryani',
    'South Indian',
    'North Indian',
    'Mughlai',
    'Chinese',
    'Seafood',
    'Desserts',
  ],
  maps: {
    query:
      'Teenmaar Telugu Kitchen, 8-27, Aushapur Bypass Road, Aushapur, Telangana 501301',
    embed:
      'https://maps.google.com/maps?q=Teenmaar%20Telugu%20Kitchen%2C%208-27%2C%20Aushapur%20Bypass%20Road%2C%20Aushapur%2C%20Telangana%20501301&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Teenmaar%20Telugu%20Kitchen%2C%208-27%20Aushapur%20Bypass%20Road%2C%20Aushapur%2C%20Telangana%20501301',
  },
  nav: [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'story', label: 'Our Story', href: '#story' },
    { id: 'menu', label: 'Menu', href: '#menu' },
    { id: 'order', label: 'Order', href: '#order' },
    ...(SHOW_RESERVATION ? [{ id: 'reserve', label: 'Reserve', href: '#reserve' }] : []),
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'specialities', label: 'Our Specialities', href: '#specialities' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ],
} as const

/** Representative dish photos on the signature stage. Set false when original Teenmaar photos replace them. */
export const USING_REPRESENTATIVE_PHOTOS = false

export const storyCopy = {
  eyebrow: 'Our story',
  headline: ['More than a meal.', "It's a Telugu feast."],
  body: 'At Teenmaar Telugu Kitchen, we celebrate the richness of Telugu flavours alongside a diverse selection of Indian and international favourites. From aromatic biryanis and traditional regional specialities to sizzling starters and comforting curries, every menu choice brings something special to the table.',
} as const

/** Confirm with owner before adding: indoor and outdoor seating, banquet hall, game area, capacity, parking, AC, hours. */
export const PLACE_TITLE = 'Find us on the highway.'

export const PLACE_TEXT =
  'On Aushapur Bypass Road in Ghatkesar, Teenmaar is an easy stop for families and travellers on the highway. Come in for biryani, Telugu specialities and more, or take it to go.'

export const PLACE_DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=Teenmaar+Telugu+Kitchen+Aushapur+Bypass+Road+Telangana+501301'

export const PLACE_PHONE_HREF = 'tel:7659853475'

/** Primary photo in the Our Story section — full building front view. */
export const STORY_IMAGE = {
  src: '/images/full building.png',
  alt: 'Teenmaar Telugu Kitchen building decorated with marigold garlands at opening',
  width: 1456,
  height: 816,
  /** Keeps the signboard and entrance centred in mobile 4:3 crop. */
  focus: '50% 40%',
} as const

/** Inset photo in the Our Story section — aerial view showing the TeenmAAR signboard. */
export const STORY_INSET = {
  src: '/images/board-corner.jpg',
  alt: 'TeenmAAR Telugu Kitchen signboard seen from above',
  /** Centres the signboard panel inside the square crop. */
  focus: '45% 45%',
} as const

/** @deprecated Use STORY_IMAGE / STORY_INSET instead. Kept for other consumers. */
export const storyImages = {
  primary: images.storyFeast,
  inset: images.storySpice,
} as const

export const storyTour = {
  src: '/videos/teenmaar-restaurant-tour.mp4',
  poster: '/videos/teenmaar-restaurant-tour-poster.jpg',
  heading: 'Take a look around.',
  caption: 'A look around Teenmaar Telugu Kitchen.',
} as const
