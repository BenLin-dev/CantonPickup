/**
 * Submit every URL in the built sitemap to IndexNow.
 *
 * Why: IndexNow pushes URLs straight to Bing (and Yandex, Seznam, Naver) instead
 * of waiting for the next crawl. Bing is the index behind ChatGPT's web search
 * and Microsoft Copilot, so this is the fastest lever we have on whether an AI
 * answer can ever retrieve a CantonPickup page. Google does not participate in
 * IndexNow — it still needs Search Console.
 *
 * The key file must already be live at the site root before this runs, otherwise
 * IndexNow rejects the submission with 403:
 *   https://cantonpickup.com/<KEY>.txt
 *
 * Usage:
 *   node scripts/indexnow.mjs            # submit
 *   node scripts/indexnow.mjs --dry      # print what would be sent
 *   node scripts/indexnow.mjs --urls https://cantonpickup.com/faqs
 *
 * Node 18+ is required for global fetch.
 */
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')

/** Must match the filename of the key file dropped into `public/`. */
const KEY = 'f07401c3f33d94d7aed6b983ed238071'
const HOST = 'cantonpickup.com'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const args = process.argv.slice(2)
const dry = args.includes('--dry')
const urlsFlag = args.indexOf('--urls')

function sitemapUrls() {
  const paths = [join(ROOT, 'dist', 'sitemap.xml'), join(ROOT, 'public', 'sitemap.xml')]
  const found = paths.find((p) => existsSync(p))
  if (!found) {
    console.error('No sitemap.xml found. Run `npm run build` first.')
    process.exit(1)
  }
  const xml = readFileSync(found, 'utf8')
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1])
  return { source: found, urls }
}

const { source, urls: sitemap } = sitemapUrls()
const urls = urlsFlag >= 0 ? args.slice(urlsFlag + 1).filter((a) => a.startsWith('http')) : sitemap

if (!urls.length) {
  console.error('Nothing to submit.')
  process.exit(1)
}

console.log(`sitemap: ${source}`)
console.log(`urls:    ${urls.length}`)
urls.forEach((u) => console.log('  ' + u))

if (dry) {
  console.log('\n[dry run] nothing sent.')
  process.exit(0)
}

// Local guard: the key file has to be reachable at the deployed site root.
try {
  const probe = await fetch(KEY_LOCATION, { redirect: 'follow' })
  const body = (await probe.text()).trim()
  if (!probe.ok || !body.includes(KEY)) {
    console.error(
      `\nKey file check failed (${probe.status}) at ${KEY_LOCATION}.\n` +
        `Deploy the site first — IndexNow will reject the submission until\n` +
        `public/${KEY}.txt is live at the site root.`,
    )
    process.exit(1)
  }
  console.log(`\nkey file OK: ${KEY_LOCATION}`)
} catch (err) {
  console.error(`\nCould not reach ${KEY_LOCATION}: ${err.message}`)
  console.error('If this machine cannot reach the internet, run this script elsewhere.')
  process.exit(1)
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }),
})

// IndexNow answers 200 (accepted) or 202 (accepted, key validation pending).
console.log(`\nIndexNow response: ${res.status} ${res.statusText}`)
if (res.status === 200 || res.status === 202) {
  console.log('Submitted. Bing typically recrawls within hours to a few days.')
} else {
  const text = await res.text().catch(() => '')
  console.error('Submission rejected.')
  if (text) console.error(text.slice(0, 500))
  if (res.status === 403) console.error('403 = key file not found or does not match.')
  if (res.status === 422) console.error('422 = URLs do not belong to the declared host.')
  process.exit(1)
}
