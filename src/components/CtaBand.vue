<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' },
  button: { type: String, default: 'Get a Quote' },
  to: { type: String, default: '/contact' },
  image: { type: String, default: '/images/hero/highway-dusk.jpg' },
  secondary: { type: String, default: '' },
  secondaryTo: { type: String, default: '' },
})
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
      <RouterLink :to="to" class="btn btn--light btn--lg">
        {{ button }}
        <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
      </RouterLink>
      <RouterLink v-if="secondary" :to="secondaryTo || '/'" class="btn btn--ghost-light btn--lg">
        {{ secondary }}
      </RouterLink>
    </div>
  </div>
</template>
