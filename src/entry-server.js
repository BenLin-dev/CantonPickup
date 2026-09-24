import { createApp } from 'vue'
import { createMemoryHistory } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import { createRouter } from './router/create'
import { revealDirective } from './composables/useReveal'
import { pages, serviceCards, faqGroups } from './data/content'
import { site, seoKeywords } from './data/site'
import { articleBySlug, articleSlugs } from './data/articles'
import { routePageBySlug } from './data/routePages'

/**
 * Server-side entry used by `scripts/prerender.mjs`.
 *
 * Each page is rendered once at build time so that crawlers — and visitors on
 * a slow connection — get real, readable English HTML instead of an empty
 * `<div id="app">`. The browser then takes over as a normal single-page app.
 *
 * In addition to the per-page `<title>` / `<meta>` head block, we emit a set
 * of JSON-LD blocks (LocalBusiness, Service, BreadcrumbList, FAQPage, etc.)
 * so Google has structured data to attach to the entity on the very first
 * fetch — not only after JS hydration. We also seed `window.dataLayer` with a
 * page-level context object so that every later `dataLayer.push({ event })`
 * (generate_lead, cta_click, contact_click, video_play) carries the service,
 * city, canonical URL and audience keys that Google Ads needs.
 */
export async function render(url) {
  const app = createApp(App)

  const router = createRouter(createMemoryHistory())
  router.push(url)
  await router.isReady()

  app.use(router)
  app.directive('reveal', revealDirective)

  const html = await renderToString(app)

  const page = Object.values(pages).find((p) => p.path === url)
  const article = articleSlugs.includes(String(url.split('/').pop() || ''))
    ? articleBySlug(String(url.split('/').pop() || ''))
    : null
  const isRouteLanding = url.startsWith('/guangzhou-to-')
  const routePage = isRouteLanding
    ? routePageBySlug(String(url.split('/').pop() || ''))
    : null

  // Route landing pages don't live in `pages`; lift their SEO fields up so
  // the SSR'd HTML gets the same `<title>`/`<meta>` treatment as the main
  // pages. Articles get the same treatment from the `articles.js` source.
  const seoSource = page
    || (article
      ? {
          path: url,
          title: `${article.seoTitle || article.title} | CantonPickup`,
          description: article.excerpt,
          keywords: `${article.category?.toLowerCase() || 'guangzhou guide'}, guangzhou private driver, china sourcing trip`,
        }
      : null)
    || (routePage
      ? {
          path: url,
          title: routePage.title,
          description: routePage.description,
          keywords: [...(routePage.keywords || []), 'guangzhou private car', 'english speaking driver guangzhou'].join(', '),
        }
      : null)

  const meta = seoSource
    ? [
        `<title>${escapeHtml(seoSource.title)}</title>`,
        `<meta name="description" content="${escapeHtml(seoSource.description)}" />`,
        seoSource.keywords ? `<meta name="keywords" content="${escapeHtml(seoSource.keywords)}" />` : '',
        `<link rel="canonical" href="${site.domain}${seoSource.path === '/' ? '/' : seoSource.path}" />`,
        `<meta property="og:title" content="${escapeHtml(seoSource.title)}" />`,
        `<meta property="og:description" content="${escapeHtml(seoSource.description)}" />`,
        `<meta property="og:url" content="${site.domain}${seoSource.path}" />`,
        `<meta property="og:type" content="${url === '/' ? 'website' : 'article'}" />`,
      ].filter(Boolean)
    : []

  const breadcrumbs = buildBreadcrumbs(url, page, article, routePage)
  const business = buildLocalBusiness()
  const services = buildServices(url, page, routePage)
  const faq = buildFaqPage(url, page)
  const blog = buildBlogPosting(url, article)

  const jsonLdBlocks = [breadcrumbs, business, services, faq, blog]
    .filter(Boolean)
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`)

  const dataLayerInit = buildDataLayerInit(url, page, routePage)

  const head = [dataLayerInit, ...meta, ...jsonLdBlocks]
    .filter(Boolean)
    .join('\n    ')

  return { html, head }
}

// ---------------------------------------------------------------------------
// JSON-LD builders
//
// All return `null` when the current URL does not need that block, so the
// `head` assembly above can drop them silently.
// ---------------------------------------------------------------------------

function buildBreadcrumbs(url, page, article, routePage) {
  /** @type {Array<{name: string, path: string|null}>} */
  const crumbs = [{ name: 'Home', path: '/' }]

  if (url === '/') {
    return null
  } else if (article) {
    crumbs.push({ name: 'Guides', path: '/blog' })
    crumbs.push({ name: article.title, path: null })
  } else if (routePage) {
    crumbs.push({ name: 'Intercity Transfer', path: '/intercity-transfer' })
    crumbs.push({ name: routePage.city, path: null })
  } else if (page && page.path === '/blog') {
    crumbs.push({ name: 'Guides', path: null })
  } else if (page && page.path === '/reviews') {
    crumbs.push({ name: 'Reviews', path: null })
  } else if (page && page.path === '/about') {
    crumbs.push({ name: 'About Us', path: null })
  } else if (page && page.path === '/faqs') {
    crumbs.push({ name: 'FAQs', path: null })
  } else if (page && page.path === '/contact') {
    crumbs.push({ name: 'Contact', path: null })
  } else if (page && page.path === '/vehicles-pricing') {
    crumbs.push({ name: 'Vehicles & Pricing', path: null })
  } else if (page && page.path === '/privacy-policy') {
    crumbs.push({ name: 'Privacy Policy', path: null })
  } else if (page && page.path === '/terms') {
    crumbs.push({ name: 'Terms & Conditions', path: null })
  } else if (page) {
    // The six service pages share the Services parent in the header dropdown.
    crumbs.push({ name: 'Services', path: '/airport-transfer' })
    const labelMap = {
      '/airport-transfer': 'Airport Transfer',
      '/private-driver': 'Private Driver',
      '/factory-visits': 'Business Travel & Factory Visits',
      '/intercity-transfer': 'Intercity Transfer',
      '/canton-fair-transfer': 'Canton Fair Transfer',
      '/multi-day-sourcing-tour': 'Multi-Day Sourcing Tour',
    }
    crumbs.push({ name: labelMap[page.path] || page.title, path: null })
  } else {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: site.domain + c.path } : {}),
    })),
  }
}

function buildLocalBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.domain}#business`,
    name: site.name,
    legalName: site.legalName,
    url: site.domain,
    telephone: site.phoneRaw,
    email: site.email,
    image: `${site.domain}/images/hero/guangzhou-bluehour.jpg`,
    description:
      'English-speaking airport transfer, private driver and factory visit transport service in Guangzhou and Foshan, China.',
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted:
      'Cash, WeChat Pay, Alipay, PayPal, Credit Card, Debit Card, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.addressLine,
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: site.areaServed.split(' · ').map((name) => ({ '@type': 'City', name })),
    availableLanguage: ['en', 'zh'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    knowsAbout: [
      'Guangzhou airport transfer',
      'Guangzhou Baiyun Airport (CAN) pickup',
      'Guangzhou South Railway Station transfer',
      'English speaking driver Guangzhou',
      'Private driver Guangzhou',
      'Private driver Foshan',
      'Full day private driver Guangzhou',
      'Private driver for factory visits Guangzhou',
      'Private driver for Foshan factory visits',
      'Guangzhou to Foshan private transfer',
      'Foshan sourcing trip private driver',
      'Private driver in China',
    ],
    // `whatsappUrl`, not `whatsappLink` — structured data wants the canonical
    // profile address, not the click-to-chat URL with `?text=` on it.
    sameAs: [site.whatsappUrl],
  }
}

function buildServices(url, page, routePage) {
  if (routePage) {
    const lowestSedan = (routePage.table || []).reduce(
      (min, row) => (row.sedan != null && (min === null || row.sedan < min) ? row.sedan : min),
      null
    )
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${site.domain}${url}#service`,
      name: `Guangzhou to ${routePage.city} Private Transfer`,
      serviceType: 'IntercityTransfer',
      description: routePage.description,
      url: `${site.domain}${url}`,
      provider: { '@id': `${site.domain}#business` },
      areaServed: [
        { '@type': 'City', name: 'Guangzhou' },
        { '@type': 'City', name: routePage.city },
      ],
      ...(lowestSedan != null
        ? {
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: String(lowestSedan),
              url: `${site.domain}${url}`,
            },
          }
        : {}),
    }
  }

  const serviceAreas = {
    '/airport-transfer': {
      name: 'Guangzhou Baiyun Airport (CAN) Transfer & Pickup',
      serviceType: 'AirportTransfer',
      areaServed: [
        { '@type': 'Airport', name: 'Guangzhou Baiyun International Airport (CAN)', iataCode: 'CAN' },
        { '@type': 'TrainStation', name: 'Guangzhou South Railway Station' },
        { '@type': 'City', name: 'Guangzhou' },
        { '@type': 'City', name: 'Foshan' },
      ],
      price: '57',
    },
    '/private-driver': {
      name: 'Private Driver in Guangzhou & Foshan',
      serviceType: 'PrivateDriverHire',
      areaServed: [
        { '@type': 'City', name: 'Guangzhou' },
        { '@type': 'City', name: 'Foshan' },
      ],
      price: '97',
    },
    '/factory-visits': {
      name: 'Private Driver for Factory Visits in Guangzhou & Foshan',
      serviceType: 'FactoryVisitTransport',
      areaServed: [
        { '@type': 'City', name: 'Foshan' },
        { '@type': 'AdministrativeArea', name: 'Shunde District, Foshan' },
        { '@type': 'AdministrativeArea', name: 'Nanhai District, Foshan' },
        { '@type': 'AdministrativeArea', name: 'Chancheng District, Foshan' },
        { '@type': 'City', name: 'Dongguan' },
      ],
    },
    '/intercity-transfer': {
      name: 'Intercity Transfer in Guangdong',
      serviceType: 'IntercityTransfer',
      areaServed: [
        { '@type': 'City', name: 'Guangzhou' },
        { '@type': 'City', name: 'Foshan' },
        { '@type': 'City', name: 'Dongguan' },
        { '@type': 'City', name: 'Shenzhen' },
        { '@type': 'City', name: 'Zhuhai' },
      ],
    },
    '/canton-fair-transfer': {
      name: 'Canton Fair Transfer & Private Driver',
      serviceType: 'CantonFairTransfer',
      areaServed: [
        { '@type': 'Place', name: 'Canton Fair (China Import and Export Fair), Pazhou Complex' },
        { '@type': 'City', name: 'Guangzhou' },
      ],
      price: '57',
    },
    '/multi-day-sourcing-tour': {
      name: 'Multi-Day Sourcing Tour with Private Driver',
      serviceType: 'SourcingTourTransport',
      areaServed: [
        { '@type': 'City', name: 'Guangzhou' },
        { '@type': 'City', name: 'Foshan' },
        { '@type': 'City', name: 'Dongguan' },
        { '@type': 'City', name: 'Shenzhen' },
      ],
    },
  }

  const cfg = serviceAreas[page?.path]
  if (!cfg) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${site.domain}${url}#service`,
    name: cfg.name,
    serviceType: cfg.serviceType,
    description: page.description,
    url: `${site.domain}${url}`,
    provider: { '@id': `${site.domain}#business` },
    areaServed: cfg.areaServed,
    ...(cfg.price ? { offers: { '@type': 'Offer', priceCurrency: 'USD', price: cfg.price, url: `${site.domain}${url}` } } : {}),
  }
}

function buildFaqPage(url, page) {
  if (url === '/faqs') {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqGroups.flatMap((g) =>
        g.items.map((i) => ({
          '@type': 'Question',
          name: i.q,
          acceptedAnswer: { '@type': 'Answer', text: i.a },
        }))
      ),
    }
  }
  const faqIdByPage = {
    '/airport-transfer': 'airport',
    '/private-driver': 'driver',
    '/factory-visits': 'factory',
    '/intercity-transfer': 'intercity',
    '/canton-fair-transfer': 'cantonfair',
    '/multi-day-sourcing-tour': 'sourcing',
    '/vehicles-pricing': 'pricing',
  }
  const id = faqIdByPage[page?.path]
  if (!id) return null
  const group = faqGroups.find((g) => g.id === id)
  if (!group) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: group.items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  }
}

function buildBlogPosting(url, article) {
  if (!article) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: `${site.domain}${article.image}`,
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.category,
    inLanguage: 'en',
    author: { '@type': 'Organization', name: site.name, url: site.domain },
    publisher: { '@type': 'Organization', name: site.name, url: site.domain },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.domain}${url}` },
  }
}

// ---------------------------------------------------------------------------
// GTM dataLayer initialisation
//
// Pushes a page-level context object into `window.dataLayer` BEFORE the GTM
// container script loads. The container script lives in `index.html` after
// the `<!--/app-head-->` marker; this block lives inside the marker, so GTM
// sees the values on its first read.
//
// Why it matters:
//  - `generate_lead`, `cta_click`, `contact_click` and `video_play` all push
//    point-in-time events. Without page-level context Google Ads and GA4 see
//    *that* something happened but not which service, which city or which
//    funnel stage the visitor was in. With this, those events get attached
//    to a `service_slug` / `city` / `page_type` / audience key automatically.
//  - `canonical_url` here matches the `<link rel="canonical">` already in
//    the head, so Google Ads conversion pages line up with the SEO target.
//  - `audiences` is the list of remarketing audience keys used by GTM to
//    build Google Ads audiences. The GTM operator wires these into the
//    audience builder; this layer only emits the values.
// ---------------------------------------------------------------------------

const SERVICE_SLUGS = new Set([
  '/airport-transfer',
  '/private-driver',
  '/factory-visits',
  '/intercity-transfer',
  '/canton-fair-transfer',
  '/multi-day-sourcing-tour',
])

function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

/**
 * Decide `page_type`, `service_slug`, `city`, `page_title` and `audiences`
 * from the URL alone. Uses `page` for the SEO title on named pages and
 * `routePage` for route landings.
 */
function classifyPage(url, page, routePage) {
  if (routePage) {
    const audiences = ['route_intercity', `route_to_${slugify(routePage.city)}`, 'funnel_mid']
    return {
      page_type: 'route_landing',
      service_slug: 'intercity',
      city: routePage.city,
      page_title: routePage.title,
      audiences,
    }
  }
  if (url === '/blog' || url === '/blog/') {
    return {
      page_type: 'blog_index',
      page_title: page?.title || '',
      audiences: ['blog_reader', 'funnel_top'],
    }
  }
  if (url.startsWith('/blog/')) {
    return {
      page_type: 'blog_post',
      page_title: page?.title || '',
      audiences: ['blog_reader', 'funnel_top'],
    }
  }
  if (page && SERVICE_SLUGS.has(page.path)) {
    const slug = page.path.replace(/^\//, '')
    return {
      page_type: 'service',
      service_slug: slug,
      page_title: page.title,
      audiences: [`service_${slug}`, 'service_viewer', 'funnel_mid'],
    }
  }
  const byPath = {
    '/': { page_type: 'home', audiences: ['funnel_top'] },
    '/vehicles-pricing': { page_type: 'pricing', audiences: ['pricing_viewer', 'funnel_mid'] },
    '/reviews': { page_type: 'social_proof', audiences: ['social_proof_viewer', 'funnel_top'] },
    '/faqs': { page_type: 'faq', audiences: ['faq_viewer', 'funnel_top'] },
    '/about': { page_type: 'about', audiences: ['about_viewer', 'funnel_top'] },
    '/contact': { page_type: 'contact', audiences: ['contact_intent', 'funnel_bottom'] },
    '/privacy-policy': { page_type: 'legal', audiences: ['funnel_top'] },
    '/terms': { page_type: 'legal', audiences: ['funnel_top'] },
  }
  return byPath[url] || { page_type: 'other', audiences: [] }
}

function buildDataLayerInit(url, page, routePage) {
  const cleanPath = url === '/' ? '/' : url.replace(/\/+$/, '') || '/'
  const canonicalUrl = `${site.domain}${cleanPath}`
  const meta = classifyPage(url, page, routePage)
  const payload = {
    ...meta,
    page_path: cleanPath,
    canonical_url: canonicalUrl,
    site_language: 'en',
    site_name: site.name,
    business_id: `${site.domain}#business`,
  }
  // Split `</script>` so the literal token cannot close this outer
  // <script> block. `JSON.stringify` escapes `<` to `\u003c`, but the HTML
  // parser still terminates a `<script>` on a literal `</script>` match.
  return (
    '<script>window.dataLayer = window.dataLayer || [];' +
    `window.dataLayer.push(${JSON.stringify(payload)});` +
    '<' + '/script>'
  )
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}