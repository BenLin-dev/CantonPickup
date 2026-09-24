<script setup>
import { computed, ref } from 'vue'
import HeroSection from '@/components/HeroSection.vue'
import TrustStrip from '@/components/TrustStrip.vue'
import ProcessSteps from '@/components/ProcessSteps.vue'
import CtaBand from '@/components/CtaBand.vue'
import TestimonialWall from '@/components/TestimonialWall.vue'
import VideoGallery from '@/components/VideoGallery.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo, useJsonLd } from '@/composables/useSeo'
import { pages, serviceCards, homeSteps, aboutAdvantages, ctaBands } from '@/data/content'
import { site, seoKeywords } from '@/data/site'

const page = pages.home
useSeo(page)

/**
 * Three services are shown up front; the rest sit behind "More services".
 * The featured set is the three highest-demand products, in the order they
 * should be read — airport pickups first, because that is how most guests
 * arrive at us.
 */
const featuredSlugs = ['airport-transfer', 'factory-visits', 'canton-fair-transfer']
const showAllServices = ref(false)

const featured = featuredSlugs
  .map((slug) => serviceCards.find((s) => s.slug === slug))
  .filter(Boolean)

const hiddenCount = serviceCards.length - featured.length

const shownServices = computed(() => (showAllServices.value ? serviceCards : featured))

useJsonLd('home-service', {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.domain,
  inLanguage: 'en',
  description: page.description,
  keywords: seoKeywords.join(', '),
})

/**
 * LocalBusiness block for the home page — gives Google a single canonical
 * source of NAP info, opening hours and the service area so the knowledge
 * graph has something concrete to attach to. `knowsAbout` mirrors the 20
 * keywords in `seo和推广关键词.txt`.
 */
useJsonLd('home-business', {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${site.domain}#business`,
  name: site.name,
  legalName: site.legalName,
  url: site.domain,
  telephone: site.phoneRaw,
  email: site.email,
  image: `${site.domain}/images/hero/guangzhou-bluehour.jpg`,
  description: page.description,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.addressLine,
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: site.country,
  },
  areaServed: site.areaServed.split(' · ').map((name) => ({
    '@type': 'City',
    name,
  })),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  knowsAbout: [
    'Guangzhou airport transfer',
    'Guangzhou Baiyun Airport (CAN) pickup',
    'Guangzhou South Railway Station transfer',
    'English speaking driver Guangzhou',
    'Private driver Guangzhou',
    'Private driver Foshan',
    'Full day private driver Guangzhou',
    'Private driver for factory visits Guangzhou',
    'Private driver for Foshan factory visits',
    'Guangzhou to Foshan private transfer',
    'Foshan sourcing trip private driver',
    'Private driver in China',
  ],
  // Canonical profile address; `whatsappLink` carries the pre-filled message
  // and must not end up in JSON-LD.
  sameAs: [site.whatsappUrl],
})
</script>

<template>
  <HeroSection
    variant="media"
    image="/images/hero/guangzhou-bluehour.jpg"
    image-alt="Private driver vehicle in Guangzhou at blue hour"
    eyebrow="Guangzhou · Foshan · Pearl River Delta"
    :title="page.h1"
    :lead="page.lead"
    :badges="['Fixed price per vehicle', 'English-speaking driver', 'Door to door', 'Flights tracked']"
    priority
    :meta="[
      { icon: 'shield', text: 'Licensed, professional drivers' },
      { icon: 'wallet', text: 'Fixed prices, no hidden fees' },
      { icon: 'clock', text: '24/7 — including public holidays' },
    ]"
  >
    <template #actions>
      <RouterLink to="/contact" class="btn btn--light btn--lg">
        Get a Quote
        <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
      </RouterLink>
      <RouterLink to="/vehicles-pricing" class="btn btn--ghost-light btn--lg">
        Our Services
      </RouterLink>
    </template>
  </HeroSection>

  <TrustStrip />

  <!-- ------------------------------------------------------- our services -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">What we do</p>
        <h2>Our Services</h2>
        <p class="lead">
          Private driver and car service in Guangzhou for your business trip, factory visit
          or holiday — from a single airport pickup to a driver who stays with you all week.
        </p>
      </div>

      <div id="our-services" class="grid grid--3">
        <article
          v-for="(s, i) in serviceCards"
          :key="s.slug"
          class="service-card"
          :class="{ 'service-card--collapsed': !shownServices.includes(s) }"
          v-reveal="{ delay: (i % 3) * 80 }"
        >
          <div class="service-card__media">
            <img :src="s.image" :alt="s.imageAlt" loading="lazy" decoding="async" />
            <span v-if="s.badge" class="service-card__badge">{{ s.badge }}</span>
            <span class="service-card__label">
              <AppIcon :name="s.icon" :size="15" :stroke="2.1" />
              {{ s.label }}
            </span>
          </div>

          <div class="service-card__body">
            <h3 class="service-card__title">
              <RouterLink :to="s.to">{{ s.title }}</RouterLink>
            </h3>

            <p class="service-card__text">{{ s.text }}</p>

            <ul class="service-card__points">
              <li v-for="p in s.points" :key="p">
                <AppIcon name="check" :size="15" :stroke="2.6" />
                {{ p }}
              </li>
            </ul>

            <div class="service-card__actions">
              <RouterLink :to="s.to" class="btn btn--outline btn--sm">
                Learn more
                <AppIcon name="arrow" :size="15" :stroke="2.2" class="btn__arrow" />
              </RouterLink>
              <RouterLink
                :to="{ path: '/contact', query: { service: s.slug }, hash: '#quote' }"
                class="btn btn--sm"
              >
                Book Now
              </RouterLink>
            </div>
          </div>
        </article>
      </div>

      <!-- the remaining services stay in the markup so the links are crawlable;
           only their visibility is toggled -->
      <div class="btn-row mt-32" style="justify-content: center">
        <button
          type="button"
          class="btn btn--outline btn--lg services-toggle"
          :aria-expanded="showAllServices"
          aria-controls="our-services"
          @click="showAllServices = !showAllServices"
        >
          <template v-if="showAllServices">
            Show fewer services
          </template>
          <template v-else>
            More services
            <span class="services-toggle__count">+{{ hiddenCount }}</span>
            <AppIcon name="arrow" :size="17" :stroke="2.2" class="btn__arrow" />
          </template>
        </button>
      </div>
    </div>
  </section>

  <!-- ---------------------------------------------------- why choose us -->
  <section class="section section--soft">
    <div class="container">
      <div class="split">
        <div v-reveal>
          <p class="eyebrow">Why choose us</p>
          <h2>Why Travellers Choose CantonPickup</h2>
          <p class="lead">
            We are a small local team, not a booking platform. The person
            answering your message is the person arranging your driver.
          </p>

          <ul class="stack mt-32">
            <li v-for="a in aboutAdvantages" :key="a.title" class="trust-item" style="align-items: flex-start">
              <span class="icon-badge icon-badge--sm">
                <AppIcon :name="a.icon" :size="19" :stroke="2" />
              </span>
              <div>
                <strong>{{ a.title }}</strong>
                <span>{{ a.text }}</span>
              </div>
            </li>
          </ul>

          <div class="btn-row mt-32">
            <RouterLink to="/about" class="btn btn--outline">
              More about us
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

  <!-- ------------------------------------------------------- how it works -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Simple process</p>
        <h2>How It Works</h2>
        <p class="lead">Four steps from your first message to your first ride.</p>
      </div>

      <ProcessSteps :steps="homeSteps" />
    </div>
  </section>

  <!-- ------------------------------------------------------------ reviews -->
  <section class="section section--mint">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Guest reviews</p>
        <h2>What Our Guests Say</h2>
        <p class="lead">
          Real comments and photos from travellers we have driven around
          Guangzhou, Foshan and the Pearl River Delta.
        </p>
      </div>

      <TestimonialWall />
    </div>
  </section>

  <!-- ------------------------------------------------------------- videos -->
  <VideoGallery
    title="See the Trip Before You Book"
    lead="Short clips from airport pickups, factory visits and drives around the region."
    eyebrow="Video"
  />

  <section class="section section--tight">
    <div class="container">
      <CtaBand v-bind="ctaBands.home" image="/images/hero/highway-dusk.jpg" />
    </div>
  </section>
</template>
