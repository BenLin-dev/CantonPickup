#!/usr/bin/env node
/**
 * prerender.mjs — turn the built single-page app into a set of real HTML files.
 *
 * For every page we render the Vue app on the server and inject the result into
 * the built `dist/index.html`, producing:
 *
 *   dist/index.html                     the home page
 *   dist/airport-transfer/index.html    …
 *   dist/faqs/index.html
 *   dist/404.html                       fallback for static hosts
 *   dist/sitemap.xml                    generated from the route table
 *
 * Why bother: search engines and first paint get complete English HTML instead
 * of an empty `<div id="app">`. The visitor's browser then boots the normal
 * Vue app on top.
 *
 * Runs as part of `npm run build`. Requires `vite build` to have run first.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const dist = join(root, 'dist')

async function main() {
  if (!existsSync(join(dist, 'index.html'))) {
    console.error('dist/index.html not found — run `vite build` first.')
    process.exitCode = 1
    return
  }

  const { build } = await import('vite')

  console.log('\nBuilding server bundle…')
  await build({
    root,
    logLevel: 'warn',
    build: {
      ssr: 'src/entry-server.js',
      outDir: 'dist/server',
      emptyOutDir: true,
      minify: false,
      rollupOptions: { output: { format: 'es' } },
    },
  })

  const serverEntry = pathToFileURL(join(dist, 'server', 'entry-server.js')).href
  const { render } = await import(serverEntry)

  const { indexableRoutes } = await import(
    pathToFileURL(join(root, 'src', 'router', 'routes.js')).href
  ).catch(() => ({ indexableRoutes: null }))

  const routes = indexableRoutes || [
    '/',
    '/airport-transfer',
    '/private-driver',
    '/factory-visits',
    '/vehicles-pricing',
    '/about',
    '/faqs',
    '/contact',
  ]

  const template = await readFile(join(dist, 'index.html'), 'utf8')

  /**
   * Swap the whole default head block for the page-specific one, so the built
   * HTML never contains two <title> or two description tags.
   */
  function injectHead(tpl, head) {
    if (!head) return tpl
    const block = /<!--app-head-->[\s\S]*?<!--\/app-head-->/
    if (block.test(tpl)) return tpl.replace(block, head)
    return tpl.replace('<!--app-head-->', head)
  }

  console.log('Prerendering pages…')
  for (const route of routes) {
    const { html, head } = await render(route)

    const page = injectHead(template, head).replace('<!--app-html-->', html)

    const outDir = route === '/' ? dist : join(dist, route.replace(/^\//, ''))
    await mkdir(outDir, { recursive: true })
    await writeFile(join(outDir, 'index.html'), page, 'utf8')
    console.log(`  ${route.padEnd(20)} -> ${route === '/' ? 'index.html' : route.slice(1) + '/index.html'}`)
  }

  // a friendly 404 for static hosts (Netlify / Vercel / Cloudflare Pages)
  try {
    const { html } = await render('/404')
    const notFound = template.replace('<!--app-html-->', html)
    await writeFile(join(dist, '404.html'), notFound, 'utf8')
    console.log('  404                  -> 404.html')
  } catch {
    /* optional */
  }

  // sitemap.xml ------------------------------------------------------------
  const { site } = await import(pathToFileURL(join(root, 'src', 'data', 'site.js')).href)
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .map((r) => {
      const priority = r === '/' ? '1.0' : '0.8'
      return `  <url>
    <loc>${site.domain}${r === '/' ? '/' : r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  await writeFile(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    'utf8'
  )
  console.log(`sitemap.xml          -> ${routes.length} URLs`)

  // the SSR bundle is not needed at runtime
  await import('node:fs/promises').then(({ rm }) =>
    rm(join(dist, 'server'), { recursive: true, force: true })
  )

  console.log('Prerender complete.\n')
}

main().catch((err) => {
  console.error('Prerender failed:', err)
  process.exitCode = 1
})
