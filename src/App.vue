<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import FloatingContact from './components/FloatingContact.vue'
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>

  <SiteHeader />

  <main id="main">
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </main>

  <SiteFooter />
  <FloatingContact />
</template>
