<script setup>
import AppIcon from './AppIcon.vue'
import { site } from '@/data/site'

/**
 * Floating contact stack — permanently pinned to the bottom-right corner.
 *
 * It used to fade in only after the visitor scrolled past 420px
 * (`visible.value = window.scrollY > 420`), so on the first screen — the one
 * every ad click lands on — the fastest contact channel on the site was
 * invisible. Ad traffic bounces from the first screen, so the button now shows
 * immediately and never hides. No scroll listener is needed any more.
 *
 * On phones and tablets the stack collapses to the WhatsApp button alone:
 * `.fab--desktop` (email + phone) is hidden at <=900px in main.css. A single
 * unmistakable tap target beats a three-way choice, and it matches the
 * reference site. The label is kept on tablets; under 560px it becomes a
 * 52px circle (also in main.css), like the reference.
 *
 * It is the one contact control present on every page, so it is the one that
 * must not be generic: `site.waLink($route.path)` opens WhatsApp with a message
 * naming the page the visitor is reading (see `WA_MESSAGES` in `data/site.js`).
 * The prerender pass renders the same path, so the URL in the served HTML is
 * the one the browser opens — nothing is swapped after hydration.
 *
 * WhatsApp click tracking is NOT wired here: `main.js` installs one
 * capture-phase document listener for every `a[href*="wa.me"]`, which also
 * fires the Google Ads "Click WhatsApp" conversion. Adding `@click` here would
 * double-count it. Email / phone have no Ads conversion action, so they push
 * their own GTM event.
 */
function track(channel) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: 'contact_click', channel })
}
</script>

<template>
  <div class="floating">
    <a
      class="fab fab--wa"
      :href="site.waLink($route.path)"
      target="_blank"
      rel="noopener"
      :aria-label="`Chat with us on WhatsApp — ${site.whatsapp}`"
    >
      <AppIcon name="whatsapp" :size="22" :stroke="1.7" />
      <span>WhatsApp</span>
    </a>

    <a
      class="fab fab--icon fab--desktop"
      :href="site.mailto"
      aria-label="Email us"
      @click="track('email')"
    >
      <AppIcon name="mail" :size="21" :stroke="1.9" />
    </a>

    <a
      class="fab fab--icon fab--desktop"
      :href="`tel:${site.phoneRaw}`"
      aria-label="Call us"
      @click="track('phone')"
    >
      <AppIcon name="phone" :size="20" :stroke="1.9" />
    </a>
  </div>
</template>
