<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { site } from '@/data/site'

/**
 * Floating contact stack — appears after the visitor scrolls past the hero.
 * Clicking either button pushes a GTM event so ad campaigns can attribute it.
 */
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 420
}

function track(channel) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: 'contact_click', channel })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="floating" :style="{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none', transition: 'opacity .3s' }">
    <a
      class="fab fab--wa"
      :href="site.whatsappLink"
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
      @click="track('whatsapp')"
    >
      <AppIcon name="whatsapp" :size="22" :stroke="1.7" />
      <span>WhatsApp</span>
    </a>

    <a
      class="fab fab--icon"
      :href="site.mailto"
      aria-label="Email us"
      @click="track('email')"
    >
      <AppIcon name="mail" :size="21" :stroke="1.9" />
    </a>

    <a
      class="fab fab--icon"
      :href="`tel:${site.phoneRaw}`"
      aria-label="Call us"
      @click="track('phone')"
    >
      <AppIcon name="phone" :size="20" :stroke="1.9" />
    </a>
  </div>
</template>
