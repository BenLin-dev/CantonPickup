import { createRouter as createVueRouter } from 'vue-router'
import { routes } from './routes'

/**
 * Builds a router for a given history implementation.
 *
 *   browser  -> createWebHistory()
 *   prerender -> createMemoryHistory()
 *
 * Sharing one definition keeps the two paths in sync.
 */
export function createRouter(history) {
  const router = createVueRouter({
    history,
    routes,
    scrollBehavior(to, from, saved) {
      if (saved) return saved
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      if (to.path === from.path) return {}
      return { top: 0 }
    },
  })

  router.afterEach((to) => {
    if (typeof document === 'undefined') return
    if (!to.meta?.noindex) return
    let tag = document.head.querySelector('meta[name="robots"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'robots')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', 'noindex, follow')
  })

  return router
}
