<script setup>
import HeroSection from '@/components/HeroSection.vue'
import LegalArticle from '@/components/LegalArticle.vue'
import { useSeo } from '@/composables/useSeo'
import { pages, termsSections, legalUpdated } from '@/data/content'

const page = pages.terms
useSeo(page)
</script>

<template>
  <HeroSection
    variant="split"
    :title="page.h1"
    :lead="page.lead"
    :crumbs="[{ label: 'Home', to: '/' }, { label: 'Terms & Conditions' }]"
  />

  <LegalArticle :sections="termsSections" :updated="legalUpdated" />
</template>
