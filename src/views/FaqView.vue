<script setup>
import { computed, ref } from 'vue'
import HeroSection from '@/components/HeroSection.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import CtaBand from '@/components/CtaBand.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo, useJsonLd, useBreadcrumbs } from '@/composables/useSeo'
import { pages, faqGroups } from '@/data/content'
import { site } from '@/data/site'

const page = pages.faqs
useSeo(page)

const active = ref('all')

const tabs = computed(() => [
  { id: 'all', title: 'All questions' },
  ...faqGroups.map((g) => ({ id: g.id, title: g.title })),
])

const shown = computed(() =>
  active.value === 'all' ? faqGroups : faqGroups.filter((g) => g.id === active.value)
)

const total = faqGroups.reduce((n, g) => n + g.items.length, 0)

// One FAQPage block covering every question on the page.
useJsonLd('faq-all', {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqGroups.flatMap((g) =>
    g.items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    }))
  ),
})

useBreadcrumbs('faqs', [
  { name: 'Home', path: '/' },
  { name: 'FAQs', path: null },
])
</script>

<template>
  <HeroSection
    variant="media"
    image="/images/hero/chauffeur.jpg"
    image-alt="Private driver opening a car door in Guangzhou"
    eyebrow="FAQs"
    :title="page.h1"
    :lead="page.lead"
    priority
    :crumbs="[{ label: 'Home', to: '/' }, { label: 'FAQs' }]"
  >
    <template #actions>
      <RouterLink to="/contact" class="btn btn--light btn--lg">
        Get a Quote
        <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
      </RouterLink>
      <a :href="site.whatsappLink" target="_blank" rel="noopener" class="btn btn--ghost-light btn--lg">
        <AppIcon name="whatsapp" :size="18" :stroke="1.8" />
        Ask us directly
      </a>
    </template>
  </HeroSection>

  <section class="section">
    <div class="container container--narrow">
      <!-- category filter -->
      <div class="faq-tabs" role="tablist" aria-label="Question categories" v-reveal>
        <button
          v-for="t in tabs"
          :key="t.id"
          type="button"
          class="faq-tab"
          :class="{ 'is-active': active === t.id }"
          role="tab"
          :aria-selected="active === t.id"
          @click="active = t.id"
        >
          {{ t.title }}
        </button>
      </div>

      <p class="table-note" style="margin-top: 0; margin-bottom: 26px">
        {{ total }} answers across {{ faqGroups.length }} categories.
      </p>

      <!-- groups -->
      <div class="stack" style="--gap: 44px">
        <section v-for="g in shown" :key="g.id" :id="g.id" v-reveal>
          <h2 style="font-size: 1.3rem; margin-bottom: 16px">{{ g.title }}</h2>
          <FaqAccordion :items="g.items" :id-prefix="g.id" :open-index="active === g.id ? 0 : -1" />
        </section>
      </div>
    </div>
  </section>

  <!-- still stuck? -->
  <section class="section section--soft">
    <div class="container container--narrow text-center">
      <h2 v-reveal>Still Have Questions?</h2>
      <p class="lead" style="margin-inline: auto" v-reveal>
        If your question is not answered here, message us directly. We answer
        every message ourselves, usually within half an hour.
      </p>

      <div class="btn-row mt-32" style="justify-content: center">
        <a :href="site.whatsappLink" target="_blank" rel="noopener" class="btn btn--lg">
          <AppIcon name="whatsapp" :size="19" :stroke="1.8" />
          WhatsApp {{ site.whatsapp }}
        </a>
        <a :href="site.mailto" class="btn btn--outline btn--lg">
          <AppIcon name="mail" :size="19" :stroke="1.8" />
          Email us
        </a>
      </div>

      <div class="contact-row mt-40" style="text-align: left; max-width: 460px; margin-inline: auto">
        <span class="contact-row__label">Opening hours</span>
        <span class="contact-row__value">{{ site.hours }}</span>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <CtaBand
        title="Ready when you are"
        text="Send us your dates and destinations and we will send a fixed price the same day."
        button="Get a Quote"
        image="/images/hero/guangzhou-night.jpg"
      />
    </div>
  </section>
</template>
