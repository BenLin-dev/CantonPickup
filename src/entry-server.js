import { createApp } from 'vue'
import { createMemoryHistory } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import { createRouter } from './router/create'
import { revealDirective } from './composables/useReveal'
import { pages } from './data/content'
import { site } from './data/site'

/**
 * Server-side entry used by `scripts/prerender.mjs`.
 *
 * Each page is rendered once at build time so that crawlers — and visitors on
 * a slow connection — get real, readable English HTML instead of an empty
 * `<div id="app">`. The browser then takes over as a normal single-page app.
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
  const head = page
    ? [
        `<title>${escapeHtml(page.title)}</title>`,
        `<meta name="description" content="${escapeHtml(page.description)}" />`,
        page.keywords ? `<meta name="keywords" content="${escapeHtml(page.keywords)}" />` : '',
        `<link rel="canonical" href="${site.domain}${page.path === '/' ? '/' : page.path}" />`,
        `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
        `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
        `<meta property="og:url" content="${site.domain}${page.path}" />`,
      ]
        .filter(Boolean)
        .join('\n    ')
    : ''

  return { html, head }
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
