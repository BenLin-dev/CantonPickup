# CantonPickup — website

English-language marketing site for a Guangzhou & Foshan airport transfer and
private driver service. Built with **Vue 3 + Vue Router 4 + Vite 6**, fully
responsive, and prerendered to static HTML so every page is indexable.

---

## Quick start

```bash
npm install       # first time only
npm run dev       # http://localhost:5173
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Rescan asset folders, then start the dev server with hot reload |
| `npm run build` | Rescan assets → build → prerender every page to static HTML |
| `npm run build:spa` | Build without the prerender pass (plain SPA) |
| `npm run preview` | Serve the contents of `dist/` on port 4173 |
| `npm run assets` | Just regenerate the JSON manifests |

---

## Nothing is hard-coded — drop a file in and it appears

The fleet, the review wall and the video gallery all read a JSON manifest that
is **generated from the contents of a folder**. To add content you copy files,
run `npm run assets` (or restart `npm run dev`), and the site picks them up.

| Folder | Manifest | What to drop in |
| --- | --- | --- |
| `public/images/vehicles/` | `public/data/vehicles.json` | Vehicle photos |
| `public/images/reviews/` | `public/data/reviews.json` | Guest photos + captions |
| `public/videos/` | `public/data/videos.json` | Video files *or* YouTube/Vimeo links, + thumbnails |

Detailed instructions live next to the folders:

- `public/images/reviews/PUT-REVIEW-PHOTOS-HERE.md`
- `public/videos/PUT-VIDEOS-HERE.md`

### Vehicle photos

```
public/images/vehicles/byd-han.jpg        primary photo
public/images/vehicles/byd-han__2.jpg     second photo (extra angle / interior)
public/images/vehicles/byd-han__3.jpg     third photo
```

`byd-han` is the **slug**. The vehicle's name, seat count, luggage capacity and
description come from the `fleet` list in `src/data/site.js`. New vehicles work
without touching any code — drop a sidecar `byd-han.json` next to the photo to
set the wording, or just let it use a prettified filename.

### Review photos

```
public/images/reviews/anna-airport.jpg
public/images/reviews/anna-airport.json    ← optional caption
```

```json
{ "name": "Anna K.", "text": "Driver was waiting with our name on a sign.", "rating": 5 }
```

Reviews render **six at a time and load more as you scroll**
(`IntersectionObserver`), so the wall stays fast however many you add. There is
also a "Load more reviews" button as a fallback, and clicking a photo opens a
full-screen lightbox.

Text-only reviews (no photo) go in `public/data/reviews.manual.json` — this file
is hand-authored and is *never* overwritten by the scanner.

### Videos

Everything about a clip lives in `public/videos/` — **three files sharing a
basename**. Poster and caption are both optional.

```
public/videos/factory-day.mp4          ← a clip you host yourself
public/videos/factory-day.jpg          ← thumbnail
public/videos/factory-day.json         ← { "title": "...", "caption": "..." }
```

Videos hosted on YouTube / Vimeo / a CDN use the same rule; there is no local
file, so the `.json` carries the address instead:

```
public/videos/baiyun-airport-pickup.json
public/videos/baiyun-airport-pickup.jpg
```

```json
{
  "title": "Clients pickup at Guangzhou Baiyun airport",
  "caption": "Meet & greet in the arrivals hall",
  "url": "https://youtube.com/shorts/DUJfKv6unPg",
  "order": 1
}
```

A `/watch?v=`, `youtu.be/`, `/shorts/`, `/embed/` or `/live/` link all work —
the gallery rewrites them into an embeddable player URL and works out the
provider itself. `poster` may point anywhere under `public/`, and `order`
(lower first) pins a clip's position. Nothing is registered in a second place:
drop the files in, and the next `npm run dev` / `npm run build` picks them up.

Clips render **six at a time and load more as you scroll**, same as the review
wall. When there are no videos at all, the video section removes itself from
the page completely.

The thumbnail for an external clip is a 16:9 image made with
`scripts/make-video-poster.py`, which crops a photo to the card's aspect ratio
and burns the CantonPickup badge into it — YouTube's own thumbnail for a Short
carries the creator's burned-in captions, which do not belong on an English
site:

```bash
python scripts/make-video-poster.py photo.jpg public/videos/baiyun-airport-pickup.jpg
python scripts/make-video-poster.py --plain photo.jpg public/videos/baiyun-airport-pickup.jpg
```

`public/videos/PUT-VIDEOS-HERE.md` has the long version of all of this, and
sits in the folder next to the files it describes.

---

## Editing the text and prices

| What | Where |
| --- | --- |
| Phone, email, WhatsApp, opening hours, GTM ID, form key | `src/data/site.js` |
| Fleet list (fallback), price tables, route prices, SEO keywords | `src/data/site.js` |
| All page copy: headings, paragraphs, FAQs, CTAs, per-page SEO | `src/data/content.js` |
| Colours, spacing, typography, component styles | `src/assets/styles/main.css` |

Prices are in **CNY, per vehicle** (not per person) and come from the operator's
price sheet.

### Indicative dollar prices

Every headline CNY price is shown with an approximate USD figure next to it,
because guests from Europe and the US read a RMB number as a number without a
reference point. The conversion is a display-only convenience — the site always
quotes and charges in CNY.

- Rate: `pricing.usdRate` in `src/data/site.js` (CNY per USD). Update this one
  number when the rate moves.
- Formatting: `cny()` / `usdApprox()` in `src/utils/price.js`. The dollar figure
  is rounded to the nearest 5 and always labelled `approx.`.
- Class: `.price-usd` (and `.price-usd--inline`) in `main.css`.

### Which vehicles appear on the pricing page

`featuredVehicles` in `src/data/site.js` lists the vehicles shown straight away
on `/vehicles-pricing` — currently **Denza D9, Voyah Dreamer, Hongqi E-QM5**. Every
other vehicle in the fleet sits behind the "View all vehicles" button. Change
that one array to promote a different trio.

---

## Pages

| URL | Page |
| --- | --- |
| `/` | Home |
| `/airport-transfer` | Airport Transfer |
| `/private-driver` | Private Driver |
| `/factory-visits` | Factory Visits |
| `/vehicles-pricing` | Vehicles & Pricing |
| `/about` | About Us |
| `/faqs` | FAQs |
| `/contact` | Contact / Get a Quote |
| `/privacy-policy` | Privacy Policy |
| `/terms` | Terms & Conditions |

The last two are required by Google Ads for most campaign types, so keep them
published. Their wording lives in `privacySections` / `termsSections` in
`src/data/content.js`, and the "last updated" date is `legalUpdated`.

Each page sets its own `<title>`, meta description, keywords and canonical URL
via `useSeo()`. There is a `404.html` fallback for static hosts.

### Payment, deposit and cancellation

Mirrors the reference site so international guests can see a payment route they
already use:

- **20% deposit** confirms a booking, payable by PayPal or card; the balance is
  settled after the service.
- **Cancellation** — free (deposit refunded in full) more than 48 hours before
  pickup, 50% fee within 48 hours, full charge for a no-show.
- Payment methods and policy wording: `paymentMethods`, `paymentSteps` and
  `cancellationPolicy` in `src/data/content.js`, rendered on
  `/vehicles-pricing` and repeated in the pricing FAQ.

If any of this does not match how you actually operate, edit those three arrays
in `src/data/content.js` — the pages and FAQs update together.

---

## SEO

- **Prerendering** — `npm run build` renders every route to real HTML
  (`scripts/prerender.mjs`), so crawlers see complete English content rather
  than an empty `<div id="app">`. The browser then boots the normal Vue app.
- **`sitemap.xml`** is generated at build time from the route table.
- **`robots.txt`** lives in `public/`.
- **Structured data** — `TaxiService` on every page, plus `FAQPage` blocks on
  the airport, private-driver, pricing and FAQ pages.
- **Keywords** — all twenty researched keywords are in the home page meta and
  the footer "Popular searches" block.

## Tracking and the form

- **Google Tag Manager** container `GTM-KNZMJW4H` is installed in
  `index.html`. Two events are pushed to the `dataLayer`:
  - `generate_lead` — on a successful quote form submission
  - `contact_click` — when a floating WhatsApp / phone / email button is used

  Use these to configure your Google Ads conversions.
- **Quote form** — posts to Web3Forms (key in `src/data/site.js`) with an
  AJAX request, so the visitor never leaves the page. It has a honeypot field
  for spam and falls back to WhatsApp / email if the request fails. The form
  collects a **flight number** (`flight_number`) alongside the travel date, so
  airport pickups can be tracked — the field is optional and labelled
  "(airport pickups)".

---

## Deployment

```bash
npm run build
```

Upload the contents of `dist/` to any static host. Because the build produces a
real `index.html` per route, no server rewrite rules are strictly required — but
if you want the SPA to handle unknown paths you can add a fallback to
`404.html` (Netlify, Vercel and Cloudflare Pages do this automatically).

Before going live, update `site.domain` in `src/data/site.js` and the canonical
/ OG URLs in `index.html` to the real domain.
