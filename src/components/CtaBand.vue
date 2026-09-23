<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

/**
 * Alt text per band photo.
 *
 * The band is a decorative strip (its wrapper carries `aria-hidden="true"`, so
 * screen readers skip it either way), but Bing's SEO scan reports any `<img>`
 * with a missing/empty `alt` as an error on the page it is found on. So every
 * file that can be passed through `image` gets a descriptive sentence.
 */
const altByImage = {
  '/images/hero/highway-dusk.jpg': 'Private car on a Guangdong highway at dusk',
  '/images/hero/business-district.jpg': 'Business district in Guangzhou, China',
  '/images/hero/airport.jpg': 'Terminal building at Guangzhou Baiyun International Airport',
  '/images/hero/guangzhou-night.jpg': 'Guangzhou skyline at night',
  '/images/hero/guangzhou-aerial.jpg': 'Aerial view of Guangzhou and the Pearl River',
  '/images/hero/guangzhou-bluehour.jpg': 'Private driver vehicle in Guangzhou at blue hour',
  '/images/hero/factory.jpg': 'Factory and warehouse district in Guangdong',
  '/images/hero/fleet.jpg': 'CantonPickup fleet of sedans and seven-seat MPVs',
  '/images/services/business-travel.jpg': 'Business travel by private car in Guangdong',
}

const props = defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  button: { type: String, default: 'Get a Quote' },
  to: { type: String, default: '/contact' },
  image: { type: String, default: '/images/hero/highway-dusk.jpg' },
  /** Optional override; falls back to the table above, then to a house default. */
  imageAlt: { type: String, default: '' },
  secondary: { type: String, default: '' },
  secondaryTo: { type: String, default: '' },
})

const resolvedAlt = computed(
  () => props.imageAlt || altByImage[props.image] || 'Private car service in Guangzhou, China'
)

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
      <img :src="image" :alt="resolvedAlt" loading="lazy" decoding="async" />
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
