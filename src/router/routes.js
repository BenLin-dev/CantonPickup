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
    path: '/intercity-transfer',
    name: 'intercity-transfer',
    component: () => import('@/views/IntercityTransferView.vue'),
  },
  {
    path: '/canton-fair-transfer',
    name: 'canton-fair-transfer',
    component: () => import('@/views/CantonFairTransferView.vue'),
  },
  {
    path: '/multi-day-sourcing-tour',
    name: 'multi-day-sourcing-tour',
    component: () => import('@/views/MultiDaySourcingTourView.vue'),
  },
  {
    path: '/vehicles-pricing',
    name: 'vehicles-pricing',
    component: () => import('@/views/VehiclesPricingView.vue'),
  },
  {
    // One view for all six `Guangzhou to <City>` landing pages; the copy and
    // fares come from `src/data/routePages.js`.
    path: '/guangzhou-to-:city',
    name: 'route-landing',
    component: () => import('@/views/RouteLandingView.vue'),
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('@/views/BlogIndexView.vue'),
  },
  {
    path: '/blog/:slug',
    name: 'article',
    component: () => import('@/views/ArticleView.vue'),
  },
  {
    path: '/reviews',
    name: 'reviews',
    component: () => import('@/views/SocialProofView.vue'),
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
  '/intercity-transfer',
  '/canton-fair-transfer',
  '/multi-day-sourcing-tour',
  '/vehicles-pricing',
  // intercity route landing pages
  '/guangzhou-to-foshan',
  '/guangzhou-to-shenzhen',
  '/guangzhou-to-dongguan',
  '/guangzhou-to-zhongshan',
  '/guangzhou-to-zhuhai',
  '/guangzhou-to-huizhou',
  // guides
  '/blog',
  '/blog/guangzhou-wholesale-markets-guide',
  '/blog/baima-market-guangzhou',
  '/blog/factory-areas-near-guangzhou',
  '/blog/baiyun-airport-arrival-guide',
  '/blog/restaurants-near-canton-fair',
  '/blog/canton-fair-first-timer-guide',
  '/blog/guangzhou-vs-shenzhen-sourcing',
  '/blog/negotiating-with-chinese-suppliers',
  '/blog/weekend-trips-from-guangzhou',
  '/blog/business-etiquette-in-china',
  '/reviews',
  '/about',
  '/faqs',
  '/contact',
  '/privacy-policy',
  '/terms',
]
