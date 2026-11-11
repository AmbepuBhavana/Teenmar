// Reviews are excerpts of public Google reviews shown with the restaurant owner's consent.
// Before launch, confirm with the client and consider switching to the Google Places API
// with Google's required attribution, or showing only the rating summary plus the link.

export const GOOGLE_RATING = {
  score: 4.0,
  count: 1995,
  url: 'https://share.google/j3EhfkarfgbVvEXPi',
} as const

export const MENTIONS = [
  { label: 'paneer biryani', n: 10 },
  { label: 'dal tadka', n: 5 },
  { label: 'bagara rice', n: 4 },
  { label: 'Paneer Masala with Butter Naan', n: 5 },
] as const

export const REVIEWS = [
  {
    name: 'Anil Chambani',
    text: 'If you are looking for genuine, authentic Telangana cuisine, this place absolutely delivers. The flavors are spot-on, perfectly spiced, and truly capture the traditional taste of the region. Every dish we tried was rich, flavorful, and …',
  },
  {
    name: 'Sreedev .s',
    text: 'A really good spot on the Warangal highway (Yadagirigutta, Swarnagiri). We liked all the food that we ordered, highlight being the Karimnagar Kodi wings 🔥🔥🔥, along with Pachimirchi Kodi Dum Biriyani. …',
  },
  {
    name: 'Bellefille',
    text: 'Rajamdri royals vepdu pulav was good and garlic naan and kadai chicken was awesome. We also had their chicken coriander lemon soup which tasted yumm. …',
  },
  {
    name: 'shiva srikar',
    text: 'Nice place for a family lunch or dinner. They have both indoor and outdoor spaces. …',
  },
  {
    name: 'sii clt',
    text: 'Luxury service, good food, and a very nice ambiance. The staff were polite, attentive, and provided excellent service throughout our visit. The overall experience was enjoyable, and the quality of the food was impressive. …',
  },
  {
    name: 'ANIMESH SHUKLA',
    text: 'We recently visited Teenmaar Telugu Kitchen, had a very good experience. The restaurant is located right on the highway, making it a perfect stop for travellers looking for fresh food and a comfortable break.',
  },
] as const
