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

function ensureObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target
        const delay = Number(el.dataset.revealDelay || 0)
        window.setTimeout(() => el.classList.add('is-in'), delay)
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
      el.classList.add('is-in')
      return
    }

    // Anything already in the viewport on first paint appears straight away.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.94) {
      window.requestAnimationFrame(() => el.classList.add('is-in'))
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
