/**
 * Route table — one English URL per page, lazily loaded so each page only
 * ships the code it needs. Titles and meta descriptions live in
 * `src/data/content.js` and are applied by `useSeo()`.
 */
export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/airport-transfer',
    name: 'airport-transfer',
    component: () => import('@/views/AirportTransferView.vue'),
  },
  {
    path: '/private-driver',
    name: 'private-driver',
    component: () => import('@/views/PrivateDriverView.vue'),
  },
  {
    path: '/factory-visits',
    name: 'factory-visits',
    component: () => import('@/views/FactoryVisitsView.vue'),
  },
  {
    path: '/vehicles-pricing',
    name: 'vehicles-pricing',
    component: () => import('@/views/VehiclesPricingView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '/faqs',
    name: 'faqs',
    component: () => import('@/views/FaqView.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: () => import('@/views/PrivacyView.vue'),
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/TermsView.vue'),
  },
  {
    // Anything else: keep the visitor on the site but ask search engines not to
    // index the fallback URL.
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { noindex: true },
  },
]

/** Pages that should be prerendered and listed in sitemap.xml. */
export const indexableRoutes = [
  '/',
  '/airport-transfer',
  '/private-driver',
  '/factory-visits',
  '/vehicles-pricing',
  '/about',
  '/faqs',
  '/contact',
  '/privacy-policy',
  '/terms',
]
