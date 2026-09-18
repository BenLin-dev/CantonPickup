/**
 * Social proof content — the figures, the nationalities and the credentials.
 *
 * ⚠️ PLACEHOLDER FIGURES
 * Every number in `proofStats` is a stand-in, supplied so the layout could be
 * built and reviewed. Before this site goes live, replace each one with a real,
 * defensible figure — publishing invented statistics about your own business is
 * a false-advertising risk in the UK, EU, US and most other markets your
 * customers come from, and customers do check.
 *
 * Nothing else needs to change: the page reads whatever is here.
 */

/** Headline numbers, shown as a stat bar under the hero. */
export const proofStats = [
  // PLACEHOLDER — replace with the real cumulative passenger count
  { value: '12,400+', label: 'Travellers driven', sub: 'since we started' },
  // PLACEHOLDER — replace with the real number of guest nationalities
  { value: '38', label: 'Countries of origin', sub: 'on four continents' },
  // PLACEHOLDER — replace with a figure you can actually evidence
  { value: '99.2%', label: 'On-time pickups', sub: 'measured at the curb' },
  // PLACEHOLDER — replace with your real first year of trading
  { value: '2018', label: 'On the road since', sub: 'same local team' },
]

/**
 * Where our guests come from. These are the nationalities that appear in the
 * review screenshots on this page, so the strip and the wall tell one story.
 */
export const guestCountries = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Australia', code: 'AU' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'India', code: 'IN' },
  { name: 'Japan', code: 'JP' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Spain', code: 'ES' },
  { name: 'Italy', code: 'IT' },
]

/**
 * "See Us in Action" is deliberately NOT here.
 *
 * The photo wall reads `public/images/gallery/` through
 * `/data/gallery.json` (built by `scripts/scan-assets.mjs`), so the
 * photographs are files in a folder rather than an array in this file. There
 * are no captions, alts or tile sizes to maintain: copy an image in, rebuild,
 * and it is on the wall in its own shape.
 * See `src/components/PhotoWall.vue`.
 */

/** What every fare includes — stated once, here, so the page can be specific. */
export const proofCredentials = [
  {
    icon: 'shield',
    title: 'Vehicles insured for passenger transport',
    text: 'Our cars carry the cover Chinese law requires for carrying passengers, including compulsory passenger liability insurance.',
  },
  {
    icon: 'check',
    title: 'Vetted, professional drivers',
    text: 'Every driver holds a full commercial licence and has been driving these routes long enough to know the shortcuts and the bottlenecks.',
  },
  {
    icon: 'clock',
    title: 'Flights tracked in real time',
    text: 'We watch your flight number. If you land early or late, your driver adjusts — waiting time after landing is included.',
  },
  {
    icon: 'wallet',
    title: 'One fixed price, per vehicle',
    text: 'Fuel, highway tolls and parking are inside the figure. No meter, no surge, no extras on arrival.',
  },
  {
    icon: 'whatsapp',
    title: 'A human on WhatsApp, 24/7',
    text: 'The person answering your message is the person arranging the car. No ticket queue, no call centre.',
  },
  {
    icon: 'calendar',
    title: 'Free cancellation up to 48 hours',
    text: 'Plans change. Cancel more than 48 hours before pickup and your deposit comes back in full.',
  },
]
