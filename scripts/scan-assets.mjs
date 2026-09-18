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
 * VIDEOS — `public/videos/`
 *   my-trip.mp4                      a video file
 *   my-trip.jpg                      its poster image (optional)
 *   my-trip.json                     optional caption sidecar
 *
 *   Videos hosted elsewhere (YouTube, Vimeo, a CDN) go in
 *   `public/data/videos.manual.json`:
 *
 *     [ { "title": "Airport pickup", "url": "https://youtu.be/…",
 *         "poster": "/images/hero/airport.jpg" } ]
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
  for (const [base, entry] of [...byBase.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (!entry.video) continue
    const meta = entry.meta || {}
    items.push({
      id: base,
      title: meta.title || titleize(base),
      caption: meta.caption || '',
      src: `/videos/${entry.video}`,
      poster: entry.poster ? `/videos/${entry.poster}` : meta.poster || '',
      url: '',
      order: meta.order ?? items.length,
    })
  }
  items.sort((a, b) => a.order - b.order)

  // externally hosted videos (YouTube / Vimeo / a CDN) are hand-authored
  const manual = await readJson(join(DATA_DIR, 'videos.manual.json'))
  const manualItems = Array.isArray(manual) ? manual : (manual?.items ?? [])
  const external = manualItems.map((v, n) => ({
    id: v.id || `external-${n + 1}`,
    title: v.title || 'Video',
    caption: v.caption || '',
    src: v.src || '',
    poster: v.poster || '',
    url: v.url || '',
    provider: v.provider || '',
    order: v.order ?? 1000 + n,
  }))

  const all = [...items, ...external].sort((a, b) => a.order - b.order)
  await writeJson(join(DATA_DIR, 'videos.json'), { generated: new Date().toISOString(), items: all })
  note(`videos.json    — ${all.length} videos (${external.length} external links)`)
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
  await ensureDir(VIDEO_DIR)
  await scanVehicles()
  await scanReviews()
  await scanVideos()
  console.log('Done. Drop new files in the folders and re-run `npm run assets`.\n')
}

main().catch((err) => {
  console.error('Asset scan failed:', err)
  process.exitCode = 1
})
