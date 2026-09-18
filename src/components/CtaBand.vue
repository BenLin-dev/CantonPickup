<script setup>
import AppIcon from './AppIcon.vue'

const props = defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  button: { type: String, default: 'Get a Quote' },
  to: { type: String, default: '/contact' },
  image: { type: String, default: '/images/hero/highway-dusk.jpg' },
  secondary: { type: String, default: '' },
  secondaryTo: { type: String, default: '' },
})

/**
 * Push a `cta_click` event to the GTM dataLayer when either CTA in this band
 * is clicked. The point-in-time event picks up page-level context (page_type,
 * service_slug, audiences, canonical_url) from the SSR-seeded dataLayer init
 * in `entry-server.js` — the GTM tag listens for this event name and forwards
 * to Google Ads as a custom conversion.
 */
function trackCta(label, destination) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'cta_click',
    cta_label: label,
    cta_destination: destination,
    page_path: window.location.pathname,
    page_title: document.title,
  })
}
</script>

<template>
  <div class="cta-band">
    <div v-if="image" class="cta-band__bg" aria-hidden="true">
      <img :src="image" alt="" loading="lazy" decoding="async" />
    </div>

    <div class="cta-band__body">
      <h2>{{ title }}</h2>
      <p v-if="text">{{ text }}</p>
    </div>

    <div class="btn-row">
      <RouterLink :to="to" class="btn btn--light btn--lg" @click="trackCta(button, to)">
        {{ button }}
        <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
      </RouterLink>
      <RouterLink
        v-if="secondary"
        :to="secondaryTo || '/'"
        class="btn btn--ghost-light btn--lg"
        @click="trackCta(secondary, secondaryTo || '/')"
      >
        {{ secondary }}
      </RouterLink>
    </div>
  </div>
</template>
