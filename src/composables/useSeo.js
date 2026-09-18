import { onUnmounted } from 'vue'
import { site } from '@/data/site'

/**
 * Per-route document head management.
 * Keeps <title>, meta description/keywords, canonical and OG tags in sync
 * with the router. Works in the browser and during prerender.
 */
function setMeta(attr, key, content) {
  if (typeof document === 'undefined') return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  if (typeof document === 'undefined') return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSeo(page) {
  const url = site.domain + (page.path === '/' ? '/' : page.path)

  if (typeof document !== 'undefined') {
    document.title = page.title
    document.documentElement.lang = 'en'
  }

  setMeta('name', 'description', page.description)
  if (page.keywords) setMeta('name', 'keywords', page.keywords)
  setLink('canonical', url)

  setMeta('property', 'og:title', page.title)
  setMeta('property', 'og:description', page.description)
  setMeta('property', 'og:url', url)
  setMeta('name', 'twitter:title', page.title)
  setMeta('name', 'twitter:description', page.description)

  const prevTitle = typeof document !== 'undefined' ? document.title : ''

  onUnmounted(() => {
    if (typeof document !== 'undefined') document.title = prevTitle
  })

  return { url }
}

/** Adds a JSON-LD block for a specific page (FAQ, breadcrumbs, etc.). */
export function useJsonLd(id, data) {
  if (typeof document === 'undefined') return
  let el = document.getElementById(`ld-${id}`)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = `ld-${id}`
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
  onUnmounted(() => {
    el?.remove()
  })
}

/**
 * Adds a BreadcrumbList JSON-LD block for the current page.
 *
 * Pass an ordered array of `{ name, path }`:
 *   - `name` is the visible label that Google will show.
 *   - `path` is the site-relative path with a leading slash (e.g. `/about`).
 *   - The final entry (the page itself) should pass `null` for `path` so it is
 *     treated as the current page, not a self-link.
 *
 * Example:
 *   useBreadcrumbs([
 *     { name: 'Home', path: '/' },
 *     { name: 'Airport Transfer', path: '/airport-transfer' },
 *     { name: 'Guangzhou Baiyun (CAN)', path: null },
 *   ])
 */
export function useBreadcrumbs(id, crumbs) {
  if (typeof document === 'undefined') return
  const list = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: site.domain + c.path } : {}),
    })),
  }
  useJsonLd(`bc-${id}`, list)
}
