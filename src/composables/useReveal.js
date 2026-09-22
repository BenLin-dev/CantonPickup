/**
 * v-reveal — fade/slide an element in the first time it scrolls into view.
 *
 *   <div v-reveal>…</div>
 *   <div v-reveal="{ delay: 120 }">…</div>
 *
 * Falls back to "immediately visible" on the server and in browsers without
 * IntersectionObserver, so prerendered HTML is always readable.
 */

const observed = new WeakMap()

let observer = null

/**
 * Mark an element as revealed.
 *
 * This sets an attribute rather than adding a class on purpose. Vue rewrites
 * `className` wholesale whenever a `:class` binding on the same element changes
 * value, which silently wipes any class an external script added — and once
 * wiped it never comes back, because the element stays mounted and this
 * directive never runs again. The home-page service cards hit exactly that:
 * they carry `:class="{ 'service-card--collapsed': … }"`, so expanding the list
 * re-assigned `className`, dropped `.is-in`, and left three cards permanently
 * at opacity 0 while still occupying grid cells. Attributes are only touched
 * when the template binds them, so `data-in` survives.
 */
function reveal(el) {
  el.setAttribute('data-in', '')
}

function ensureObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target
        const delay = Number(el.dataset.revealDelay || 0)
        window.setTimeout(() => reveal(el), delay)
        observer.unobserve(el)
        observed.delete(el)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
  )
  return observer
}

export const revealDirective = {
  mounted(el, binding) {
    if (typeof window === 'undefined') return

    el.setAttribute('data-reveal', '')
    const delay = binding?.value?.delay
    if (delay) el.dataset.revealDelay = String(delay)

    const obs = ensureObserver()
    if (!obs) {
      reveal(el)
      return
    }

    // Anything already in the viewport on first paint appears straight away.
    // A `display: none` element measures as a zero rect, so it lands here too
    // and is marked revealed up front — that is what lets the hidden service
    // cards show instantly once the visitor expands the list.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.94) {
      window.requestAnimationFrame(() => reveal(el))
      return
    }

    obs.observe(el)
    observed.set(el, obs)
  },

  unmounted(el) {
    const obs = observed.get(el)
    if (obs) {
      obs.unobserve(el)
      observed.delete(el)
    }
  },
}

export default revealDirective
