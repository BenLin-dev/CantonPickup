<script setup>
import HeroSection from '@/components/HeroSection.vue'
import ProcessSteps from '@/components/ProcessSteps.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import CtaBand from '@/components/CtaBand.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo, useJsonLd, useBreadcrumbs } from '@/composables/useSeo'
import {
  pages,
  cantonFairAdvantages,
  cantonFairOptions,
  cantonFairTransitOptions,
  cantonFairSteps,
  faqGroups,
  ctaBands,
  heroBadges,
} from '@/data/content'
import { site } from '@/data/site'
import { money } from '@/utils/price'

const page = pages.cantonFairTransfer
useSeo(page)

const faq = faqGroups.find((g) => g.id === 'cantonfair')

useJsonLd('faq-cantonfair', {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.items.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
})

useJsonLd('service-cantonfair', {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${site.domain}/canton-fair-transfer#service`,
  name: 'Canton Fair Transfer & Private Driver',
  serviceType: 'CantonFairTransfer',
  description: page.description,
  url: `${site.domain}/canton-fair-transfer`,
  provider: { '@id': `${site.domain}#business` },
  areaServed: [
    { '@type': 'Place', name: 'Canton Fair (China Import and Export Fair), Pazhou Complex' },
    { '@type': 'City', name: 'Guangzhou' },
  ],
  offers: { '@type': 'Offer', priceCurrency: 'USD', price: '57', url: `${site.domain}/vehicles-pricing` },
})

useBreadcrumbs('canton-fair-transfer', [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/airport-transfer' },
  { name: 'Canton Fair Transfer', path: null },
])

/** Deliberately generic — the fair's phasing changes, so we do not date it. */
const fairTips = [
  'Each session runs in phases with different product categories — check which phase covers your products before you book flights.',
  'Registration goes quickest with your passport and a business card ready.',
  'The halls are a long walk apart. Plan the day by hall rather than by supplier.',
  'The approach to Pazhou peaks between 8:30 and 9:30 in the morning — leave early on day one.',
  'Your driver can take you out for lunch and have you back inside the hour.',
  'Check whether your hotel is on the official shuttle bus route — it is free on partner routes, and worth knowing before you book anything else.',
  'Flying in and heading straight for the halls? We collect you at Baiyun arrivals and drive you on to the Pazhou Complex — send your flight number with your fair dates.',
  'Entering on 240-hour visa-free transit? Keep your onward ticket in your hand luggage; you will be asked for it before you reach immigration.',
  'Bring a power bank. You will be on your phone from the moment the doors open.',
]
</script>

<template>
  <HeroSection
    variant="media"
    image="/images/services/canton-fair-transfer.jpg"
    image-alt="Exhibition centre in Guangzhou during the Canton Fair"
    eyebrow="Canton Fair Transfer"
    :title="page.h1"
    :lead="page.lead"
    :badges="heroBadges.cantonFairTransfer"
    priority
    :crumbs="[{ label: 'Home', to: '/' }, { label: 'Canton Fair Transfer' }]"
  >
    <template #actions>
      <RouterLink to="/contact" class="btn btn--light btn--lg">
        Get a Quote
        <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
      </RouterLink>
      <a :href="site.waLink($route.path)" target="_blank" rel="noopener" class="btn btn--ghost-light btn--lg">
        <AppIcon name="whatsapp" :size="18" :stroke="1.8" />
        WhatsApp us
      </a>
    </template>
  </HeroSection>

  <!-- ---------------------------------------------------------- why us -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Show week</p>
        <h2>Why Book Ahead</h2>
        <p class="lead">
          For two fortnights a year, Guangzhou fills up. A driver booked before
          you fly is the difference between a calm morning and a queue.
        </p>
      </div>

      <div class="grid grid--4">
        <div v-for="(a, i) in cantonFairAdvantages" :key="a.title" class="card" v-reveal="{ delay: i * 70 }">
          <span class="icon-badge">
            <AppIcon :name="a.icon" :size="24" :stroke="1.9" />
          </span>
          <h3 class="card__title">{{ a.title }}</h3>
          <p class="card__text">{{ a.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ------------------------------------------------------ booking options -->
  <section class="section section--soft">
    <div class="container">
      <div class="section-head" v-reveal>
        <p class="eyebrow">Three ways to book</p>
        <h2>Choose Your Pattern</h2>
        <p class="lead">
          Most visitors book one of these. The prices below are our normal city
          rates — we do not add a surcharge for fair week.
        </p>
      </div>

      <div class="grid grid--3">
        <article v-for="(o, i) in cantonFairOptions" :key="o.title" class="card" v-reveal="{ delay: i * 80 }">
          <span class="icon-badge">
            <AppIcon :name="o.icon" :size="24" :stroke="1.9" />
          </span>
          <h3 class="card__title">{{ o.title }}</h3>
          <p class="pill" style="align-self: flex-start">{{ o.hours }}</p>
          <p class="card__text mt-24">{{ o.text }}</p>

          <p class="price mt-24" style="font-size: 1.45rem">
            From {{ money(o.from) }}
            <small>sedan</small>
          </p>
          <p class="card__text" style="margin-top: 4px">
            {{ money(o.mpv) }} for a 7-seat MPV — per vehicle
          </p>

          <RouterLink
            :to="{ path: '/contact', query: { service: 'canton-fair-transfer' }, hash: '#quote' }"
            class="btn btn--outline btn--sm"
            style="margin-top: 20px; align-self: flex-start"
          >
            Book this
            <AppIcon name="arrow" :size="16" :stroke="2.2" class="btn__arrow" />
          </RouterLink>
        </article>
      </div>
    </div>
  </section>

  <!-- ---------------------------------------- shuttle bus vs private car -->
  <section class="section">
    <div class="container">
      <div class="section-head" v-reveal>
        <p class="eyebrow">Shuttle bus, metro or a car</p>
        <h2>Getting to the Pazhou Complex</h2>
        <p class="lead">
          All three work in show week. They cost very different amounts and they
          ask very different things of your day, so here is the honest comparison.
        </p>
      </div>

      <div class="grid grid--3">
        <article
          v-for="(t, i) in cantonFairTransitOptions"
          :key="t.title"
          class="card"
          v-reveal="{ delay: i * 80 }"
        >
          <span class="icon-badge">
            <AppIcon :name="t.icon" :size="24" :stroke="1.9" />
          </span>
          <h3 class="card__title">{{ t.title }}</h3>
          <p class="pill" style="align-self: flex-start">{{ t.cost }}</p>
          <p class="card__text mt-24">{{ t.text }}</p>
        </article>
      </div>
    </div>
  </section>

  <!-- ------------------------------------------------- your own hotel shuttle -->
  <section class="section section--tight">
    <div class="container">
      <div class="reverse-band" v-reveal>
        <span class="icon-badge">
          <AppIcon name="route" :size="24" :stroke="1.9" />
        </span>
        <div>
          <h2 class="reverse-band__title">Your Own Pazhou Complex Hotel Shuttle</h2>
          <p>
            Ours is not a loop with a timetable. It is your hotel to the hall
            entrance closest to your product category each morning of the show,
            and back to the same spot at night — same driver, same times, no
            queue. Canton Fair 2026 and Canton Fair 2027 transfer dates are both
            open now, and the figure we quote is the figure you pay whether your
            pickup falls in October or next April.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ---------------------------------------------------------- fair day -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">How it works</p>
        <h2>A Fair Day, Start to Finish</h2>
        <p class="lead">The same routine every morning, so you stop thinking about transport.</p>
      </div>

      <ProcessSteps :steps="cantonFairSteps" />
    </div>
  </section>

  <!-- ------------------------------------------------------- practical tips -->
  <section class="section section--soft">
    <div class="container">
      <div class="split">
        <div v-reveal>
          <p class="eyebrow">Practical notes</p>
          <h2>Getting the Most Out of the Fair</h2>
          <p class="lead">
            Small things that make a long day on the show floor noticeably
            easier — learned from guests we drive there twice a year.
          </p>

          <ul class="check-list mt-24" style="font-size: 1rem">
            <li v-for="t in fairTips" :key="t">
              <AppIcon name="check" :size="17" :stroke="2.6" />
              {{ t }}
            </li>
          </ul>

          <div class="btn-row mt-32">
            <RouterLink to="/multi-day-sourcing-tour" class="btn btn--outline">
              Staying a week? See multi-day hire
              <AppIcon name="arrow" :size="17" :stroke="2.2" class="btn__arrow" />
            </RouterLink>
          </div>
        </div>

        <div v-reveal="{ delay: 120 }">
          <img
            src="/images/hero/business-district.jpg"
            alt="Business district in Guangzhou, China"
            loading="lazy"
            decoding="async"
            style="border-radius: var(--r-xl); box-shadow: var(--sh-lg); width: 100%"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- ---------------------------------------------------------------- faq -->
  <section class="section">
    <div class="container container--narrow">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Good to know</p>
        <h2>Canton Fair Transfer FAQs</h2>
      </div>

      <FaqAccordion :items="faq.items" id-prefix="cf" :open-index="0" />

      <div class="btn-row mt-32" style="justify-content: center">
        <RouterLink to="/faqs" class="btn btn--outline btn--sm">All frequently asked questions</RouterLink>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <CtaBand v-bind="ctaBands.cantonFair" image="/images/hero/guangzhou-night.jpg" />
    </div>
  </section>
</template>
