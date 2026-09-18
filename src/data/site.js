/**
 * Central site configuration.
 *
 * Everything a non-developer might want to change lives here:
 * contact details, navigation, the fleet list, the price table and the
 * SEO keyword set. Page copy lives in `content.js`.
 *
 * NOTE: `scripts/prerender.mjs` imports this file with plain Node ESM (to read
 * `site.domain` for sitemap.xml), so every relative import here must carry an
 * explicit `.js` extension — Node does not do extension guessing.
 */

import { serviceCards } from './content.js'
import { routePages } from './routePages.js'

export const site = {
  name: 'CantonPickup',
  legalName: 'CantonPickup',
  tagline: 'Guangzhou & Foshan Airport Transfers, Private Drivers & Factory Visits',
  domain: 'https://cantonpickup.com',

  // ---- contact ----------------------------------------------------------
  phone: '+86 13202442074',
  phoneRaw: '+8613202442074',
  whatsapp: '+86 13202442074',
  whatsappLink: 'https://wa.me/8613202442074',
  wechat: '+86 13202442074',
  email: 'Jackguoyingjie@gmail.com',
  mailto: 'mailto:Jackguoyingjie@gmail.com',

  // ---- address / area ---------------------------------------------------
  // The base of operations. Baiyun District (广州白云区) sits between
  // downtown Guangzhou and Baiyun International Airport, which is why
  // airport pickups are our most common booking.
  district: 'Baiyun District',
  city: 'Guangzhou',
  region: 'Guangdong',
  country: 'China',
  addressLine: 'Baiyun District, Guangzhou, Guangdong, China',
  /** Shown on the map link in the footer and on the contact page. */
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Baiyun+District%2C+Guangzhou%2C+China',
  areaServed: 'Guangzhou · Foshan · Dongguan · Shenzhen · Huizhou · Qingyuan',

  // ---- integrations -----------------------------------------------------
  gtmId: 'GTM-KNZMJW4H',
  web3formsAccessKey: '02187a0a-00ea-48ee-8843-3dfdc845997a',
  web3formsEndpoint: 'https://api.web3forms.com/submit',

  // ---- opening hours ----------------------------------------------------
  hours: '24 / 7 — including public holidays',
  responseTime: 'We usually reply within 30 minutes.',

  social: {
    whatsapp: 'https://wa.me/8613202442074',
    wechat: '',
    email: 'mailto:Jackguoyingjie@gmail.com',
  },
}

/**
 * One-line descriptions for the Services dropdown.
 *
 * The six services themselves live in `content.js` (`serviceCards`) so the
 * home page grid, the header dropdown and the footer column can never drift
 * apart — adding a service there adds it in all three places.
 */
const serviceNavDesc = {
  'airport-transfer': 'Baiyun Airport & railway station pickups',
  'private-driver': 'Half day, full day and multi-day hire',
  'factory-visits': 'Supplier meetings across the delta',
  'intercity-transfer': 'Fixed prices between Guangdong cities',
  'canton-fair-transfer': 'Pazhou exhibition centre, April & October',
  'multi-day-sourcing-tour': 'One driver for your whole trip',
}

/** Primary navigation. `children` renders as a dropdown.
 *
 *  NOTE (2026-09-18): the blog / guides entry was removed from the header
 *  navigation per the client. Visitors still reach the guides via the footer
 *  (`SiteFooter.vue` → "Guides" → /blog) and via cross-links inside service
 *  and home pages. The /blog page itself remains prerendered and listed in
 *  the sitemap so Google can still crawl it. */
export const nav = [
  { label: 'Home', to: '/' },
  {
    label: 'Services',
    to: '/airport-transfer',
    children: serviceCards.map((s) => ({
      label: s.title,
      to: s.to,
      desc: serviceNavDesc[s.slug] || '',
    })),
  },
  { label: 'Vehicles & Pricing', to: '/vehicles-pricing' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'About Us', to: '/about' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
]

/**
 * Intercity route pages, grouped so the footer and the mobile drawer can offer
 * them without repeating the list in two places.
 */
export const routeNav = routePages.map((r) => ({
  label: `Guangzhou to ${r.city}`,
  to: `/${r.slug}`,
}))

/**
 * Fleet — the fallback list used when `/data/vehicles.json` has not loaded.
 *
 * The generated manifest (built by `scripts/scan-assets.mjs` from the files in
 * `public/images/vehicles/`) takes priority, so dropping a photo into that
 * folder is usually all it takes to update the site. Edit this list when you
 * want the wording, seats or luggage figures to differ from the defaults.
 *
 * `image` is a path inside `public/`; `slug` links an entry to however many
 * photos are dropped into the folder.
 */
export const fleet = [
  {
    slug: 'denza-d9',
    name: 'Denza D9',
    models: 'Denza D9 or similar',
    image: '/images/vehicles/denza-d9.jpg',
    passengers: '1–6 passengers',
    luggage: '4–6 suitcases',
    tag: 'Most popular',
    description:
      'The best-selling premium MPV in China — captain chairs, a quiet electric drive and a large boot. Our most requested vehicle for airport pickups and factory visits.',
    features: ['Captain chairs', 'Large luggage space', 'Phone charging', 'Privacy glass'],
  },
  {
    slug: 'voyah-mpv',
    name: 'Voyah Dreamer',
    models: 'Voyah Dreamer or similar',
    image: '/images/vehicles/voyah-mpv.jpg',
    passengers: '1–6 passengers',
    luggage: '4–6 suitcases',
    tag: 'Premium',
    description:
      'A new-generation luxury MPV with reclining second-row seats — quiet, refined and perfect for executive travel.',
    features: ['Reclining seats', 'Panoramic roof', 'Phone charging', 'Bottled water'],
  },
  {
    slug: 'hongqi',
    name: 'Hongqi E-QM5',
    models: 'Hongqi E-QM5 or similar',
    image: '/images/vehicles/hongqi.jpg',
    passengers: '1–3 passengers',
    luggage: '2–3 suitcases',
    tag: 'EV sedan',
    description:
      'Hongqi’s fully electric executive sedan — quiet on the motorway, smooth in city traffic and surprisingly spacious in the back. A popular choice for VIP airport pickups and executive transfers.',
    features: ['Electric drive', 'Rear seat comfort', 'Phone charging', 'Bottled water'],
  },
  {
    slug: 'gac-m8-white',
    name: '7-Seat MPV',
    models: 'GAC Trumpchi M8 or similar',
    image: '/images/vehicles/gac-m8-white.jpg',
    passengers: '1–6 passengers',
    luggage: '4–6 suitcases',
    tag: 'Family friendly',
    description:
      'Spacious seven-seat MPV with sliding doors and a large boot — the most popular choice for families and small groups.',
    features: ['7 seats', 'Large luggage space', 'Air conditioning', 'Child seat on request'],
  },
  {
    slug: 'byd-han',
    name: 'B-Class Sedan',
    models: 'BYD Han, Passat, Hongqi E-QM5, Arcfox or similar',
    image: '/images/vehicles/byd-han.jpg',
    passengers: '1–3 passengers',
    luggage: '2–3 suitcases',
    tag: 'Best value',
    description:
      'A quiet, comfortable electric or petrol sedan — ideal for solo travellers and couples who want a smooth, economical transfer.',
    features: ['Air conditioning', 'Phone charging', 'Bottled water', 'English-speaking driver'],
  },
  {
    slug: 'mercedes-vclass',
    name: 'Mercedes-Benz V-Class',
    models: 'Mercedes-Benz V-Class or similar',
    image: '/images/vehicles/mercedes-vclass.jpg',
    passengers: '1–6 passengers',
    luggage: '5–7 suitcases',
    tag: 'Top tier',
    description:
      'Our flagship vehicle. Leather interior, exceptional comfort and the presence you want for VIP guests and important clients.',
    features: ['Leather interior', 'Extra legroom', 'Panoramic roof', 'Meet & greet included'],
  },
]

/**
 * The three vehicles shown straight away on the Vehicles & Pricing page.
 * Everything else stays behind the "view all vehicles" toggle.
 */
export const featuredVehicles = ['denza-d9', 'voyah-mpv', 'hongqi']

/**
 * Price table. Every figure is in US dollars (USD / $) per vehicle, not per
 * person — the price you see is the price you pay.
 *
 * Levels follow the reference rate card for these two vehicle tiers, with the
 * final digit of every figure set to 7 (e.g. $99 -> $97) so no number is a
 * straight copy of the reference. Keep that convention when editing.
 */
export const pricing = {
  currency: 'USD',
  currencySymbol: '$',
  note: 'Prices are per vehicle, not per person, and already include fuel, tolls and parking inside the city area.',
  sedan: {
    label: 'B-Class Sedan',
    seats: '1–3 passengers',
    rows: [
      { service: 'Baiyun Airport pickup / drop-off', scope: 'Guangzhou city area, 1–50 km', price: 57 },
      { service: 'Point-to-point transfer', scope: 'Guangzhou city area, 1–50 km', price: 57 },
      { service: 'Guangzhou South Railway Station', scope: 'Guangzhou city area, 1–50 km', price: 57 },
      { service: 'Half day hire', scope: '5 hours / 120 km', price: 97 },
      { service: 'Full day hire', scope: '10 hours / 250 km', price: 187 },
    ],
    extras: [
      { label: 'Overtime', value: '$24 per hour' },
      { label: 'Extra distance, half day', value: '$1.50 per km' },
      { label: 'Extra distance, full day', value: '$0.70 per km' },
    ],
  },
  mpv: {
    label: 'Business 7-Seat MPV',
    seats: '1–6 passengers',
    rows: [
      { service: 'Baiyun Airport pickup / drop-off', scope: 'Guangzhou city area, 1–50 km', price: 77 },
      { service: 'Point-to-point transfer', scope: 'Guangzhou city area, 1–50 km', price: 77 },
      { service: 'Guangzhou South Railway Station', scope: 'Guangzhou city area, 1–50 km', price: 77 },
      { service: 'Half day hire', scope: '5 hours / 120 km', price: 127 },
      { service: 'Full day hire', scope: '10 hours / 250 km', price: 247 },
    ],
    extras: [
      { label: 'Overtime', value: '$30 per hour' },
      { label: 'Extra distance, half day', value: '$2.00 per km' },
      { label: 'Extra distance, full day', value: '$0.85 per km' },
    ],
  },
}

/** Headline prices shown on cards and in the pricing overview. */
export const priceHighlights = [
  { label: 'Airport pickup', from: 57, unit: 'per vehicle', to: '/airport-transfer' },
  { label: 'Half-day private driver', from: 97, unit: '5 hours / 120 km', to: '/private-driver' },
  { label: 'Full-day private driver', from: 187, unit: '10 hours / 250 km', to: '/private-driver' },
]

/**
 * Popular fixed-price routes shown on the airport transfer page.
 * Order and destinations follow the approved layout reference.
 */
export const popularRoutes = [
  {
    from: 'Baiyun Airport (CAN)',
    to: 'Foshan city centre',
    // Airport-to-Foshan tier, last digit set to 7.
    sedan: 87,
    mpv: 117,
    duration: '70–90 min',
    note: 'Most booked route',
  },
  {
    from: 'Guangzhou South Station',
    to: 'Foshan city centre',
    // City-centre-to-city-centre tier (Guangzhou <-> Foshan), not the airport
    // tier: the station sits much closer to Foshan.
    sedan: 57,
    mpv: 77,
    duration: '40–60 min',
  },
  {
    from: "Shenzhen Bao'an Airport",
    to: 'Foshan city centre',
    sedan: null,
    mpv: null,
    duration: '2 – 2.5 h',
    note: 'Quoted on request',
  },
]

/**
 * Vehicle tiers used by the "Vehicle Options" cards.
 * Sedan and MPV prices come from the table above. Larger vehicles
 * (12-seat and above, buses) are not offered, so they are not shown.
 */
export const vehicleOptions = [
  {
    slug: 'byd-han',
    label: 'Sedan',
    seats: '1–3 passengers',
    from: 57,
    image: '/images/vehicles/byd-han.jpg',
    text: 'Best for couples and solo travellers with light luggage.',
  },
  {
    slug: 'gac-m8-white',
    label: 'MPV',
    seats: '1–6 passengers',
    from: 77,
    image: '/images/vehicles/gac-m8-white.jpg',
    text: 'The most popular choice for families and small groups.',
  },
]

/**
 * Intercity fixed routes — one way, same price in both directions, tolls and
 * parking included. These replace the old remote-area surcharge table: a flat
 * per-route price is easier to quote than a range the customer has to guess
 * their way into. Twelve-seat minibuses and larger are not offered.
 */
export const intercityRoutes = [
  { route: 'Guangzhou ↔ Foshan', sedan: 57, mpv: 77 },
  { route: 'Guangzhou ↔ Dongguan', sedan: 97, mpv: 127 },
  { route: 'Guangzhou ↔ Zhongshan', sedan: 127, mpv: 167 },
  { route: 'Guangzhou ↔ Shenzhen', sedan: 137, mpv: 177 },
  { route: 'Guangzhou ↔ Zhuhai', sedan: 147, mpv: 187 },
  { route: 'Guangzhou ↔ Huizhou', sedan: 157, mpv: 197 },
]

/** SEO keyword set, taken from the client's keyword research file. */
export const seoKeywords = [
  'guangzhou airport transfer',
  'guangzhou airport pickup',
  'guangzhou baiyun airport transfer',
  'baiyun airport transfer',
  'CAN airport transfer',
  'guangzhou south station transfer',
  'guangzhou south station pickup',
  'guangzhou to foshan private transfer',
  'foshan private transfer from guangzhou',
  'guangzhou arrival transfer',
  'private driver guangzhou',
  'guangzhou private driver',
  'private driver foshan',
  'english speaking driver guangzhou',
  'full day private driver guangzhou',
  'full day private driver foshan',
  'private driver for factory visits guangzhou',
  'private driver in china',
  'private driver for foshan factory visits',
  'foshan sourcing trip private driver',
]

/** Options used by the quote form's "Service needed" select. */
export const serviceOptions = [
  'Airport transfer — arrival',
  'Airport transfer — departure',
  'Railway station transfer',
  'Half-day private driver',
  'Full-day private driver',
  'Multi-day private driver / sourcing tour',
  'Business travel & factory visit transport',
  'Intercity transfer',
  'Canton Fair transfer',
  'Business support / other',
]
