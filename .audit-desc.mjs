import { pages } from './src/data/content.js'
import { routePages } from './src/data/routePages.js'
import { articles } from './src/data/articles.js'

const rows = []
for (const [k, p] of Object.entries(pages)) {
  rows.push({ src: 'content.js pages.' + k, path: p.path, t: p.title, d: p.description })
}
for (const p of routePages) {
  rows.push({ src: 'routePages.js ' + p.slug, path: '/' + p.slug, t: p.title, d: p.description })
}
for (const a of articles) {
  rows.push({ src: 'articles.js ' + a.slug, path: '/blog/' + a.slug, t: a.title, d: a.description })
}

const bad = (s) => s.length > 160 || s.length < 25
rows.sort((a, b) => (b.d || '').length - (a.d || '').length)
let nd = 0
let nt = 0
for (const r of rows) {
  const dl = (r.d || '').length
  const tl = (r.t || '').length
  const flagD = bad(r.d || '') ? ' D!' : '   '
  const flagT = tl > 60 ? ' T!' : '   '
  if (flagD.trim()) nd++
  if (flagT.trim()) nt++
  console.log(String(dl).padStart(3) + flagD + String(tl).padStart(4) + flagT + '  ' + r.path + '   <= ' + r.src)
}
console.log('\nsummary: desc-flagged ' + nd + ' / ' + rows.length + ' | title>60 ' + nt)
