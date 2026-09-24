<script setup>
import HeroSection from '@/components/HeroSection.vue'
import ProcessSteps from '@/components/ProcessSteps.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import CtaBand from '@/components/CtaBand.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo, useJsonLd, useBreadcrumbs } from '@/composables/useSeo'
import {
  pages,
  sourcingAdvantages,
  sourcingSampleDays,
  sourcingSteps,
  faqGroups,
  ctaBands,
  heroBadges,
} from '@/data/content'
import { site, vehicleOptions } from '@/data/site'
import { money } from '@/utils/price'

const page = pages.multiDaySourcingTour
useSeo(page)

const faq = faqGroups.find((g) => g.id === 'sourcing')

useJsonLd('faq-sourcing', {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.items.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
})

useJsonLd('service-sourcing', {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${site.domain}/multi-day-sourcing-tour#service`,
  name: 'Multi-Day Sourcing Tour with Private Driver',
  serviceType: 'SourcingTourTransport',
  description: page.description,
  url: `${site.domain}/multi-day-sourcing-tour`,
  provider: { '@id': `${site.domain}#business` },
  areaServed: [
    { '@type': 'City', name: 'Guangzhou' },
    { '@type': 'City', name: 'Foshan' },
    { '@type': 'City', name: 'Dongguan' },
    { '@type': 'City', name: 'Zhongshan' },
    { '@type': 'City', name: 'Shenzhen' },
  ],
})

useBreadcrumbs('multi-day-sourcing-tour', [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/airport-transfer' },
  { name: 'Multi-Day Sourcing Tour', path: null },
])

const included = [
  'The same English-speaking driver every day',
  'Vehicle, fuel, highway tolls and city parking',
  'Route re-planned overnight as suppliers confirm',
  'Waiting time at every factory and showroom',
  'Bottled water and phone charging on board',
  'One invoice for the whole trip, in US dollars',
]
</script>

<template>
  <HeroSection
    variant="media"
    image="/images/hero/guangzhou-aerial.jpg"
    image-alt="Aerial view of Guangzhou and the Pearl River Delta"
    eyebrow="Multi-Day Sourcing Tour"
    :title="page.h1"
    :lead="page.lead"
    :badges="heroBadges.multiDaySourcingTour"
    priority
    :crumbs="[{ label: 'Home', to: '/' }, { label: 'Multi-Day Sourcing Tour' }]"
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
        <p class="eyebrow">Sourcing trips</p>
        <h2>Why Buyers Keep the Same Driver</h2>
        <p class="lead">
          A sourcing week is a logistics problem before it is anything else.
          Keeping one car and one driver removes most of it.
        </p>
      </div>

      <div class="grid grid--4">
        <div v-for="(a, i) in sourcingAdvantages" :key="a.title" class="card" v-reveal="{ delay: i * 70 }">
          <span class="icon-badge">
            <AppIcon :name="a.icon" :size="24" :stroke="1.9" />
          </span>
          <h3 class="card__title">{{ a.title }}</h3>
          <p class="card__text">{{ a.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ------------------------------------------------------- sample week -->
  <section class="section section--soft">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">What it looks like</p>
        <h2>A Sample Sourcing Week</h2>
        <p class="lead">
          An illustration, not a package — your own supplier list decides the
          route. This is the shape most Foshan and Guangzhou trips take.
        </p>
      </div>

      <ol class="day-list">
        <li v-for="(d, i) in sourcingSampleDays" :key="d.day" class="day" v-reveal="{ delay: i * 60 }">
          <span class="day__chip">{{ d.day }}</span>
          <div>
            <h3 class="day__title">{{ d.title }}</h3>
            <p class="day__text">{{ d.text }}</p>
          </div>
        </li>
      </ol>

      <p class="table-note">
        Longer trips are welcome — buyers working across Guangdong and
        neighbouring provinces often book two weeks or more.
      </p>
    </div>
  </section>

  <!-- ---------------------------------------------------- what's included -->
  <section class="section">
    <div class="container">
      <div class="split">
        <div v-reveal>
          <p class="eyebrow">All in</p>
          <h2>What the Daily Rate Covers</h2>
          <p class="lead">
            One figure per day, agreed before you travel. Nothing is added at
            the end of the week.
          </p>

          <ul class="check-list mt-24" style="font-size: 1rem">
            <li v-for="n in included" :key="n">
              <AppIcon name="check" :size="17" :stroke="2.6" />
              {{ n }}
            </li>
          </ul>

          <div class="btn-row mt-32">
            <RouterLink to="/vehicles-pricing" class="btn btn--outline">
              See full fleet &amp; prices
              <AppIcon name="arrow" :size="17" :stroke="2.2" class="btn__arrow" />
            </RouterLink>
          </div>
        </div>

        <div v-reveal="{ delay: 120 }">
          <img
            src="/images/hero/factory.jpg"
            alt="Modern manufacturing plant visited on a sourcing trip"
            loading="lazy"
            decoding="async"
            style="border-radius: var(--r-xl); box-shadow: var(--sh-lg); width: 100%"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- --------------------------------------------------- vehicle options -->
  <section class="section section--mint">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Comfort and space</p>
        <h2>Vehicle Options</h2>
        <p class="lead">
          Space for samples matters on a sourcing trip. Both options have a boot
          that takes cartons as well as suitcases.
        </p>
      </div>

      <div class="grid grid--2" style="max-width: 860px; margin: 0 auto">
        <article v-for="(v, i) in vehicleOptions" :key="v.label" class="vehicle" v-reveal="{ delay: i * 80 }">
          <div class="vehicle__media">
            <img :src="v.image" :alt="`${v.label} vehicle for a multi-day sourcing trip`" loading="lazy" decoding="async" />
          </div>
          <div class="vehicle__body">
            <h3 class="vehicle__name">{{ v.label }}</h3>
            <div class="vehicle__specs">
              <span class="vehicle__spec">
                <AppIcon name="users" :size="17" />
                {{ v.seats }}
              </span>
            </div>
            <p class="vehicle__desc">{{ v.text }}</p>
            <p class="price" style="font-size: 1.2rem">
              From {{ money(v.from) }} <small>per vehicle</small>
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ------------------------------------------------------- how it works -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Step by step</p>
        <h2>How a Trip Comes Together</h2>
        <p class="lead">From first message to final drop-off at the airport.</p>
      </div>

      <ProcessSteps :steps="sourcingSteps" />
    </div>
  </section>

  <!-- ---------------------------------------------------------------- faq -->
  <section class="section section--soft">
    <div class="container container--narrow">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Good to know</p>
        <h2>Multi-Day Hire FAQs</h2>
      </div>

      <FaqAccordion :items="faq.items" id-prefix="ms" :open-index="0" />

      <div class="btn-row mt-32" style="justify-content: center">
        <RouterLink to="/faqs" class="btn btn--outline btn--sm">All frequently asked questions</RouterLink>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <CtaBand v-bind="ctaBands.sourcing" image="/images/hero/guangzhou-aerial.jpg" />
    </div>
  </section>
</template>
