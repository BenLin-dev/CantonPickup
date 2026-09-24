<script setup>
import HeroSection from '@/components/HeroSection.vue'
import VehicleFleet from '@/components/VehicleFleet.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import CtaBand from '@/components/CtaBand.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo, useJsonLd, useBreadcrumbs } from '@/composables/useSeo'
import { pages, driverOptions, driverIncluded, driverUseCases, faqGroups, ctaBands, heroBadges } from '@/data/content'
import { site } from '@/data/site'
import { money } from '@/utils/price'

const page = pages.privateDriver
useSeo(page)

const driverFaq = faqGroups.find((g) => g.id === 'driver')

useJsonLd('faq-driver', {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: driverFaq.items.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
})

useJsonLd('service-private-driver', {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${site.domain}/private-driver#service`,
  name: 'Private Driver in Guangzhou & Foshan',
  serviceType: 'PrivateDriverHire',
  description: page.description,
  url: `${site.domain}/private-driver`,
  provider: { '@id': `${site.domain}#business` },
  areaServed: [
    { '@type': 'City', name: 'Guangzhou' },
    { '@type': 'City', name: 'Foshan' },
    { '@type': 'City', name: 'Dongguan' },
    { '@type': 'City', name: 'Shenzhen' },
  ],
  offers: { '@type': 'Offer', priceCurrency: 'USD', price: '97', url: `${site.domain}/vehicles-pricing` },
})

useBreadcrumbs('private-driver', [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/airport-transfer' },
  { name: 'Private Driver', path: null },
])
</script>

<template>
  <HeroSection
    variant="media"
    image="/images/hero/private-driver.jpg"
    image-alt="Executive MPV with a private driver in Guangzhou"
    eyebrow="Private Driver"
    :title="page.h1"
    :lead="page.lead"
    :badges="heroBadges.privateDriver"
    priority
    :crumbs="[{ label: 'Home', to: '/' }, { label: 'Private Driver' }]"
  >
    <template #actions>
      <RouterLink to="/contact" class="btn btn--light btn--lg">
        Get a Quote
        <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
      </RouterLink>
      <RouterLink to="/vehicles-pricing" class="btn btn--ghost-light btn--lg">
        See prices
      </RouterLink>
    </template>
  </HeroSection>

  <!-- ------------------------------------------------------- hire options -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Choose your hire</p>
        <h2>Service Options</h2>
        <p class="lead">
          Book by the half day, the full day, or keep the same driver for your
          whole trip. Every option is per vehicle.
        </p>
      </div>

      <div class="grid grid--3">
        <article
          v-for="(o, i) in driverOptions"
          :key="o.title"
          class="card"
          v-reveal="{ delay: i * 80 }"
          :style="o.from === null ? { borderColor: 'var(--c-200)' } : {}"
        >
          <span class="icon-badge">
            <AppIcon :name="o.icon" :size="24" :stroke="1.9" />
          </span>
          <h3 class="card__title">{{ o.title }}</h3>
          <p class="pill" style="align-self: flex-start">{{ o.hours }}</p>
          <p class="price" style="font-size: 1.3rem">
            <template v-if="o.from">
              From {{ money(o.from) }} <small>per vehicle</small>
            </template>
            <template v-else>On request</template>
          </p>
          <p class="card__text">{{ o.text }}</p>
        </article>
      </div>

      <p class="table-note">
        Both hire options include the vehicle, the driver, fuel, tolls and
        parking inside the city area.
      </p>
    </div>
  </section>

  <!-- ------------------------------------------------------- what's included -->
  <section class="section section--soft">
    <div class="container">
      <div class="split">
        <div v-reveal>
          <p class="eyebrow">No surprises</p>
          <h2>What's Included</h2>
          <p class="lead">
            One clear price per vehicle. Everything below is already covered —
            you will not be asked to pay extra at the end of the day.
          </p>

          <ul class="check-list mt-24" style="font-size: 1rem">
            <li v-for="f in driverIncluded" :key="f">
              <AppIcon name="check" :size="17" :stroke="2.6" />
              {{ f }}
            </li>
          </ul>

          <div class="btn-row mt-32">
            <RouterLink to="/contact" class="btn">
              Get a Quote
              <AppIcon name="arrow" :size="17" :stroke="2.2" class="btn__arrow" />
            </RouterLink>
            <a :href="site.waLink($route.path)" target="_blank" rel="noopener" class="btn btn--outline">
              <AppIcon name="whatsapp" :size="17" :stroke="1.8" />
              Ask a question
            </a>
          </div>
        </div>

        <div v-reveal="{ delay: 120 }">
          <img
            src="/images/hero/chauffeur.jpg"
            alt="English-speaking chauffeur in Guangzhou"
            loading="lazy"
            decoding="async"
            style="border-radius: var(--r-xl); box-shadow: var(--sh-lg); width: 100%"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- ----------------------------------------------------------- vehicles -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Our fleet</p>
        <h2>Pick Your Vehicle</h2>
        <p class="lead">Sedans for city trips, seven-seat MPVs for groups and luggage.</p>
      </div>

      <VehicleFleet />

      <div class="btn-row mt-32" style="justify-content: center">
        <RouterLink to="/vehicles-pricing" class="btn btn--outline">
          Compare all vehicles &amp; prices
          <AppIcon name="arrow" :size="17" :stroke="2.2" class="btn__arrow" />
        </RouterLink>
      </div>
    </div>
  </section>

  <!-- ------------------------------------------------------- use cases -->
  <section class="section section--mint">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">When to book</p>
        <h2>Common Use Cases</h2>
        <p class="lead">A driver on standby turns a tight schedule into a comfortable one.</p>
      </div>

      <div class="grid grid--4">
        <div v-for="(u, i) in driverUseCases" :key="u.title" class="card card--flat" v-reveal="{ delay: i * 70 }">
          <span class="icon-badge" style="background: #fff">
            <AppIcon :name="u.icon" :size="23" :stroke="1.9" />
          </span>
          <h3 class="card__title" style="font-size: 1.02rem">{{ u.title }}</h3>
          <p class="card__text">{{ u.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ---------------------------------------------------------------- faq -->
  <section class="section">
    <div class="container container--narrow">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Good to know</p>
        <h2>Private Driver FAQs</h2>
      </div>

      <FaqAccordion :items="driverFaq.items" id-prefix="drv" :open-index="0" />

      <div class="btn-row mt-32" style="justify-content: center">
        <RouterLink to="/faqs" class="btn btn--outline btn--sm">All frequently asked questions</RouterLink>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <CtaBand v-bind="ctaBands.driver" image="/images/hero/business-district.jpg" />
    </div>
  </section>
</template>
