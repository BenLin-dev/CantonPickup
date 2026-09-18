#!/usr/bin/env node
/**
 * scan-assets.mjs — build the JSON manifests that drive all "drop a file in
 * and it shows up on the site" content.
 *
 * Nothing about the fleet, the review wall or the video gallery is hard-coded
 * in the Vue components. Each of those reads a manifest from `public/data/`,
 * and this script regenerates those manifests from whatever files happen to be
 * sitting in the matching folder.
 *
 *   public/images/vehicles/  ->  public/data/vehicles.json
 *   public/images/reviews/   ->  public/data/reviews.json
 *   public/images/gallery/   ->  public/data/gallery.json
 *   public/videos/           ->  public/data/videos.json
 *
 * It runs automatically before `npm run dev` and `npm run build`, so the usual
 * workflow is simply: copy the new photos or videos into the folder, then
 * restart the dev server (or rebuild).
 *
 * ---------------------------------------------------------------------------
 * FOLDER CONVENTIONS
 * ---------------------------------------------------------------------------
 *
 * VEHICLES — `public/images/vehicles/`
 *   byd-han.jpg            primary photo for the "byd-han" vehicle
 *   byd-han__2.jpg         second photo  (same vehicle, extra angle/interior)
 *   byd-han__3.jpg         third photo
 *
 *   The vehicle's name, seats, luggage and description are taken from the
 *   `fleet` list in `src/data/site.js` (matched on the slug). To add a brand
 *   new vehicle you can either add it to that list, or drop a sidecar file
 *   `public/images/vehicles/<slug>.json` next to the photo:
 *
 *     { "name": "Toyota Alphard", "passengers": "1–6 passengers", ... }
 *
 *   A photo with no metadata at all still appears — the name is prettified
 *   from the filename — so nothing is ever silently dropped.
 *
 * REVIEWS — `public/images/reviews/`
 *   Copy in a guest photo (`IMG_1234.jpg`) and it appears in the review wall.
 *   Add a sidecar with the same basename to caption it:
 *
 *     public/images/reviews/IMG_1234.jpg
 *     public/images/reviews/IMG_1234.json
 *       { "name": "Anna K.", "text": "Driver was waiting for us…",
 *         "rating": 5, "service": "Airport transfer", "date": "March 2026" }
 *
 *   A `.txt` sidecar works too — the first line becomes the name, the rest the
 *   review text. Reviews without a photo (text only) go in
 *   `public/data/reviews.manual.json` as a plain array of the same objects.
 *
 * GALLERY — `public/images/gallery/`
 *   The "See Us in Action" photo wall. Copy a photo in and it appears; there
 *   is nothing else to create. No sidecar, no caption, no alt text, no
 *   ordering file — deliberately. A wall that asks for a JSON file per photo
 *   is a wall that stays at six photos.
 *
 *     public/images/gallery/arrivals-hall.jpg
 *     public/images/gallery/boot-loaded.jpg
 *
 *   Order is filename order, so a numeric prefix pins it (`01-…`, `02-…`).
 *   Files starting with `_` are skipped, which is the agreed way to park a
 *   reference or work-in-progress image in a content folder.
 *
 * VIDEOS — `public/videos/`
 *   Everything about a clip lives here — the file *or* the link, its poster
 *   and its caption — so there is one folder to open and one naming rule to
 *   remember. Three files share a basename:
 *
 *   my-trip.mp4 / my-trip.json       a video file + its caption
 *   my-trip.jpg                      its poster image (optional)
 *
 *   Videos hosted elsewhere (YouTube, Vimeo, a CDN) use the same rule. There
 *   is no local video file, so the sidecar carries the address instead:
 *
 *     public/videos/airport-pickup.json
 *     public/videos/airport-pickup.jpg
 *
 *       { "title": "Clients pickup at Guangzhou Baiyun airport",
 *         "caption": "Meet & greet in the arrivals hall",
 *         "url": "https://youtube.com/shorts/…" }
 *
 *   `url` may be a watch link, a `youtu.be/` short link, a `/shorts/` link or
 *   an `/embed/` link — the gallery rewrites all of them into an embeddable
 *   URL, and works out `provider` on its own. Give a `.json` with a `url` but
 *   no picture and the card still appears, without a poster. `poster` may
 *   also be set to any other path under `public/`. `order` (lower first)
 *   pins a clip's position; without it the files are shown alphabetically.
 *
 *   Nothing is hard-coded in the Vue component, and nothing needs to be
 *   registered twice.
 */

import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const pub = join(root, 'public')

const VEHICLE_DIR = join(pub, 'images', 'vehicles')
const REVIEW_DIR = join(pub, 'images', 'reviews')
const GALLERY_DIR = join(pub, 'images', 'gallery')
const VIDEO_DIR = join(pub, 'videos')
const DATA_DIR = join(pub, 'data')

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogv'])
const SIDECAR_EXT = new Set(['.json', '.txt'])

const note = (msg) => console.log(`  ${msg}`)

/** Directory listing that never throws on a missing folder. */
async function listDir(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    return entries.filter((e) => e.isFile()).map((e) => e.name)
  } catch {
    return []
  }
}

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true })
}

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'))
  } catch {
    return null
  }
}

/** "gac-m8-white" -> "Gac M8 White" (fallback when there is no metadata). */
function titleize(slug) {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => (w.length <= 3 && /^[a-z]+$/.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
}

/**
 * Pixel size of a JPEG, read straight out of its header.
 *
 * The photo wall is a CSS multi-column layout, and a multi-column layout has
 * to know how tall each item is *before* it can decide which column the item
 * lands in. With `height: auto` the browser only learns that once the bytes
 * arrive, so it lays the wall out twice: photos visibly hop between columns as
 * they load, and the section twitches every time the visitor scrolls past it.
 *
 * Declaring `width`/`height` on the `<img>` fixes that — the browser derives
 * the aspect ratio, reserves the space, and the columns are stable from the
 * first paint. It costs one header scan here, and saves the CLS.
 *
 * Only JPEG is parsed (that is what our image pipeline emits, so it is every
 * file in the folder in practice). Anything else returns `null` and simply
 * ships without dimensions — still displayed, just not pre-sized.
 */
async function jpegSize(file) {
  const buf = await readFile(file).catch(() => null)
  if (!buf || buf[0] !== 0xff || buf[1] !== 0xd8) return null

  let i = 2
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i++
      continue
    }
    const marker = buf[i + 1]
    // SOF0–SOF15 carry the frame size. C4/C8/CC are DHT/JPG/DAC, not SOF.
    const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)
    if (isSof) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }

    const len = buf.readUInt16BE(i + 2)
    if (len < 2) return null
    i += 2 + len
  }
  return null
}

/** Split "byd-han__2.jpg" into { slug: 'byd-han', order: 2 }. */
function parseVehicleName(file) {
  const name = basename(file, extname(file))
  const m = name.match(/^(.*?)__(\d+)$/)
  if (m) return { slug: m[1], order: Number(m[2]) }
  return { slug: name, order: 1 }
}

/** Load the curated metadata from src/data/site.js (the `fleet` export). */
async function loadFleetMeta() {
  try {
    const mod = await import(new URL('../src/data/site.js', import.meta.url).href)
    const list = Array.isArray(mod.fleet) ? mod.fleet : []
    return new Map(list.map((v) => [v.slug, v]))
  } catch (err) {
    note(`! could not read src/data/site.js (${err.message}) — using filenames only`)
    return new Map()
  }
}

/* ------------------------------------------------------------------ vehicles */

async function scanVehicles() {
  await ensureDir(VEHICLE_DIR)
  const files = await listDir(VEHICLE_DIR)
  const meta = await loadFleetMeta()

  /** slug -> { photos: [{file, order}], sidecar } */
  const groups = new Map()

  for (const file of files) {
    const ext = extname(file).toLowerCase()
    const base = basename(file, extname(file))

    if (SIDECAR_EXT.has(ext)) continue // handled with its photo below
    if (!IMAGE_EXT.has(ext)) continue
    if (base.startsWith('_')) continue // scratch/reference files

    const { slug, order } = parseVehicleName(file)
    if (!groups.has(slug)) groups.set(slug, { photos: [], sidecar: null })
    groups.get(slug).photos.push({ file: `/images/vehicles/${file}`, order })
  }

  // attach sidecar metadata
  for (const file of files) {
    const ext = extname(file).toLowerCase()
    if (!SIDECAR_EXT.has(ext)) continue
    const slug = basename(file, extname(file))
    if (!groups.has(slug)) continue
    groups.get(slug).sidecar = await readJson(join(VEHICLE_DIR, file))
  }

  const items = []
  for (const [slug, group] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    group.photos.sort((a, b) => a.order - b.order)
    const images = group.photos.map((p) => p.file)

    const curated = meta.get(slug) || {}
    const extra = group.sidecar || {}

    items.push({
      slug,
      name: extra.name || curated.name || titleize(slug),
      models: extra.models || curated.models || '',
      image: images[0],
      images,
      passengers: extra.passengers || curated.passengers || '',
      luggage: extra.luggage || curated.luggage || '',
      tag: extra.tag || curated.tag || '',
      description: extra.description || curated.description || '',
      features: extra.features || curated.features || [],
    })
  }

  // keep the curated order from site.js when we know it
  const order = [...meta.keys()]
  items.sort((a, b) => {
    const ia = order.indexOf(a.slug)
    const ib = order.indexOf(b.slug)
    if (ia === -1 && ib === -1) return a.slug.localeCompare(b.slug)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })

  await writeJson(join(DATA_DIR, 'vehicles.json'), { generated: new Date().toISOString(), items })
  note(`vehicles.json  — ${items.length} vehicles, ${items.reduce((n, v) => n + v.images.length, 0)} photos`)
}

/* ------------------------------------------------------------------- reviews */

async function scanReviews() {
  await ensureDir(REVIEW_DIR)
  const files = await listDir(REVIEW_DIR)

  const byBase = new Map()

  for (const file of files) {
    const ext = extname(file).toLowerCase()
    const base = basename(file, extname(file))
    if (base.startsWith('_')) continue

    if (IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext)) {
      if (!byBase.has(base)) byBase.set(base, {})
      if (IMAGE_EXT.has(ext)) byBase.get(base).image = file
      else byBase.get(base).video = file
      continue
    }

    if (SIDECAR_EXT.has(ext)) {
      if (!byBase.has(base)) byBase.set(base, {})
      const raw = await readFile(join(REVIEW_DIR, file), 'utf8').catch(() => '')
      if (ext === '.json') {
        byBase.get(base).meta = await readJson(join(REVIEW_DIR, file))
      } else {
        // plain text: first line = reviewer name, remainder = the review
        const lines = raw.split(/\r?\n/).map((l) => l.trim())
        const name = lines.shift() || ''
        byBase.get(base).meta = { name, text: lines.filter(Boolean).join('\n') }
      }
    }
  }

  const items = []
  let i = 0
  for (const [base, entry] of [...byBase.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (!entry.image && !entry.video) continue
    const meta = entry.meta || {}
    items.push({
      id: base,
      type: entry.video ? 'video' : 'image',
      image: entry.image ? `/images/reviews/${entry.image}` : '',
      video: entry.video ? `/videos/${entry.video}` : '',
      poster: entry.image ? `/images/reviews/${entry.image}` : '',
      name: meta.name || '',
      text: meta.text || '',
      rating: typeof meta.rating === 'number' ? meta.rating : meta.rating ? Number(meta.rating) : 5,
      service: meta.service || '',
      date: meta.date || '',
      alt: meta.alt || '',
      order: meta.order ?? i++,
    })
  }
  items.sort((a, b) => a.order - b.order)

  // text-only reviews (or ones pointing at photos hosted elsewhere) live in a
  // hand-authored file so they survive every scan
  const manual = await readJson(join(DATA_DIR, 'reviews.manual.json'))
  const manualItems = Array.isArray(manual) ? manual : (manual?.items ?? [])
  for (const m of manualItems) items.push({ rating: 5, ...m })

  await writeJson(join(DATA_DIR, 'reviews.json'), { generated: new Date().toISOString(), items })
  note(`reviews.json   — ${items.length} reviews (${manualItems.length} from reviews.manual.json)`)
}

/* ------------------------------------------------------------------- gallery */

/**
 * The photo wall — `public/images/gallery/`, in and out.
 *
 * A record carries nothing but the path. No `alt`, no `caption`, no `size`,
 * and deliberately so: this section is a contact sheet of what a working day
 * looks like, and the only thing a photo should have to be is *in the folder*.
 * Anything that needs a sentence underneath it belongs in a review or an
 * article instead — those have somewhere to put the sentence.
 *
 * Order is the filename, compared numerically, so `10-x.jpg` follows `9-x.jpg`
 * rather than `1-x.jpg`. A `NN-` prefix is therefore enough to pin a position.
 */
async function scanGallery() {
  await ensureDir(GALLERY_DIR)
  const files = await listDir(GALLERY_DIR)

  const names = files
    .filter((file) => IMAGE_EXT.has(extname(file).toLowerCase()))
    .filter((file) => !basename(file).startsWith('_'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }))

  const items = []
  for (const file of names) {
    const size = await jpegSize(join(GALLERY_DIR, file))
    items.push({
      image: `/images/gallery/${file}`,
      // pre-sizing only — see the note on `jpegSize`. Not a description.
      ...(size ? { width: size.width, height: size.height } : {}),
      order: items.length,
    })
  }

  await writeJson(join(DATA_DIR, 'gallery.json'), { generated: new Date().toISOString(), items })
  const sized = items.filter((i) => i.width).length
  note(`gallery.json   — ${items.length} photos, ${sized} pre-sized (filename order, no captions)`)
}

/* -------------------------------------------------------------------- videos */

async function scanVideos() {
  await ensureDir(VIDEO_DIR)
  const files = await listDir(VIDEO_DIR)

  const byBase = new Map()
  for (const file of files) {
    const ext = extname(file).toLowerCase()
    const base = basename(file, extname(file))
    if (base.startsWith('_')) continue

    if (VIDEO_EXT.has(ext)) {
      if (!byBase.has(base)) byBase.set(base, {})
      byBase.get(base).video = file
    } else if (IMAGE_EXT.has(ext)) {
      if (!byBase.has(base)) byBase.set(base, {})
      byBase.get(base).poster = file
    } else if (SIDECAR_EXT.has(ext)) {
      if (!byBase.has(base)) byBase.set(base, {})
      byBase.get(base).meta = (await readJson(join(VIDEO_DIR, file))) || {}
    }
  }

  const items = []
  let seq = 0
  for (const [base, entry] of [...byBase.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const meta = entry.meta || {}
    const url = meta.url || ''

    // A clip qualifies when there is a file to play *or* a sidecar that says
    // where to find it. A stray .jpg or .txt on its own is not a clip.
    if (!entry.video && !url) continue

    items.push({
      id: meta.id || base,
      title: meta.title || titleize(base),
      caption: meta.caption || '',
      // `src` plays locally, `url` gets embedded — exactly one is ever set
      src: entry.video ? `/videos/${entry.video}` : meta.src || '',
      poster: meta.poster || (entry.poster ? `/videos/${entry.poster}` : ''),
      url,
      provider: meta.provider || guessProvider(url),
      order: meta.order ?? seq++,
    })
  }
  items.sort((a, b) => a.order - b.order)

  await writeJson(join(DATA_DIR, 'videos.json'), { generated: new Date().toISOString(), items })
  note(`videos.json    — ${items.length} videos (${items.filter((v) => v.url).length} external links)`)
}

/** Fill in `provider` so a sidecar only ever needs a url. */
function guessProvider(url) {
  if (/youtu\.?be/.test(url)) return 'youtube'
  if (/vimeo\.com/.test(url)) return 'vimeo'
  return ''
}

/* --------------------------------------------------------------------- utils */

async function writeJson(file, data) {
  await ensureDir(DATA_DIR)
  await writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

/* ---------------------------------------------------------------------- main */

async function main() {
  console.log('\nScanning assets…')
  await ensureDir(DATA_DIR)
  await ensureDir(REVIEW_DIR)
  await ensureDir(GALLERY_DIR)
  await ensureDir(VIDEO_DIR)
  await scanVehicles()
  await scanReviews()
  await scanGallery()
  await scanVideos()
  console.log('Done. Drop new files in the folders and re-run `npm run assets`.\n')
}

main().catch((err) => {
  console.error('Asset scan failed:', err)
  process.exitCode = 1
})
