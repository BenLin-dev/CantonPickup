<script setup>
import HeroSection from '@/components/HeroSection.vue'
import TrustStrip from '@/components/TrustStrip.vue'
import ProcessSteps from '@/components/ProcessSteps.vue'
import CtaBand from '@/components/CtaBand.vue'
import TestimonialWall from '@/components/TestimonialWall.vue'
import VideoGallery from '@/components/VideoGallery.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo, useJsonLd } from '@/composables/useSeo'
import { pages, homeServices, homeSteps, aboutAdvantages, ctaBands } from '@/data/content'
import { site, seoKeywords } from '@/data/site'

const page = pages.home
useSeo(page)

useJsonLd('home-service', {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.domain,
  inLanguage: 'en',
  description: page.description,
  keywords: seoKeywords.join(', '),
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
          Everything you need to move around Guangzhou and Foshan — from a single
          airport pickup to a driver who stays with you for the whole trip.
        </p>
      </div>

      <div class="grid grid--4">
        <RouterLink
          v-for="(s, i) in homeServices"
          :key="s.title"
          :to="s.to"
          class="card card--link"
          v-reveal="{ delay: i * 70 }"
        >
          <span class="icon-badge">
            <AppIcon :name="s.icon" :size="24" :stroke="1.9" />
          </span>
          <h3 class="card__title">{{ s.title }}</h3>
          <p class="pill" style="align-self: flex-start">{{ s.subtitle }}</p>
          <p class="card__text">{{ s.text }}</p>
          <span class="card__sub">
            Learn more
            <AppIcon name="arrow" :size="15" :stroke="2.2" />
          </span>
        </RouterLink>
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

      <TestimonialWall :batch="6" />
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
