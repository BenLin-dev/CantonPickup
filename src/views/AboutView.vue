<script setup>
import HeroSection from '@/components/HeroSection.vue'
import CtaBand from '@/components/CtaBand.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo } from '@/composables/useSeo'
import { pages, aboutAdvantages, aboutPrinciples, aboutStory, ctaBands } from '@/data/content'
import { site } from '@/data/site'

const page = pages.about
useSeo(page)

const facts = [
  { label: 'Based in', value: 'Foshan, Guangdong' },
  { label: 'Working since', value: '2019' },
  { label: 'Languages', value: 'English & Mandarin' },
  { label: 'Availability', value: site.hours },
]
</script>

<template>
  <HeroSection
    variant="media"
    image="/images/hero/guangzhou-aerial.jpg"
    image-alt="Aerial view of Guangzhou and Foshan"
    eyebrow="About Us"
    :title="page.h1"
    :lead="page.lead"
    priority
    :crumbs="[{ label: 'Home', to: '/' }, { label: 'About Us' }]"
  >
    <template #actions>
      <RouterLink to="/contact" class="btn btn--light btn--lg">
        Get a Quote
        <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
      </RouterLink>
      <RouterLink to="/vehicles-pricing" class="btn btn--ghost-light btn--lg">
        Vehicles &amp; pricing
      </RouterLink>
    </template>
  </HeroSection>

  <!-- ------------------------------------------------------- why choose us -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Why choose us</p>
        <h2>What Makes Us Different</h2>
        <p class="lead">
          We are a small team, and we would like to keep it that way. It means
          every booking gets a real person behind it.
        </p>
      </div>

      <div class="grid grid--4">
        <div v-for="(a, i) in aboutAdvantages" :key="a.title" class="card" v-reveal="{ delay: i * 70 }">
          <span class="icon-badge">
            <AppIcon :name="a.icon" :size="24" :stroke="1.9" />
          </span>
          <h3 class="card__title">{{ a.title }}</h3>
          <p class="card__text">{{ a.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ---------------------------------------------------------- our story -->
  <section class="section section--soft">
    <div class="container">
      <div class="split">
        <div v-reveal>
          <p class="eyebrow">Our story</p>
          <h2>Why We Started</h2>

          <div class="stack mt-24" style="--gap: 16px">
            <p v-for="p in aboutStory" :key="p" style="margin: 0; color: var(--c-muted); line-height: 1.75">
              {{ p }}
            </p>
          </div>

          <div class="mt-32">
            <p class="lead" style="font-style: italic; color: var(--c-600); font-weight: 600">
              Simple. Reliable. Together.
            </p>
          </div>
        </div>

        <div v-reveal="{ delay: 120 }">
          <img
            src="/images/hero/guangzhou-night.jpg"
            alt="Guangzhou skyline at night"
            loading="lazy"
            decoding="async"
            style="border-radius: var(--r-xl); box-shadow: var(--sh-lg); width: 100%"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- --------------------------------------------------- service principles -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">How we work</p>
        <h2>Our Service Principles</h2>
        <p class="lead">Four things we hold ourselves to on every single trip.</p>
      </div>

      <div class="grid grid--2">
        <div v-for="(p, i) in aboutPrinciples" :key="p.title" class="card card--flat" v-reveal="{ delay: i * 70 }">
          <span class="step__num">{{ i + 1 }}</span>
          <h3 class="card__title" style="margin-top: 12px">{{ p.title }}</h3>
          <p class="card__text">{{ p.text }}</p>
        </div>
      </div>

      <!-- quick facts -->
      <div class="grid grid--4 mt-40">
        <div v-for="f in facts" :key="f.label" class="text-center" v-reveal>
          <p style="margin: 0; font-size: 0.78rem; font-weight: 750; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-muted-2)">
            {{ f.label }}
          </p>
          <p style="margin: 6px 0 0; font-size: 1.05rem; font-weight: 700; color: var(--c-800)">
            {{ f.value }}
          </p>
        </div>
      </div>

      <div class="btn-row mt-40" style="justify-content: center">
        <a :href="site.whatsappLink" target="_blank" rel="noopener" class="btn">
          <AppIcon name="whatsapp" :size="18" :stroke="1.8" />
          Say hello on WhatsApp
        </a>
        <a :href="site.mailto" class="btn btn--outline">
          <AppIcon name="mail" :size="18" :stroke="1.8" />
          {{ site.email }}
        </a>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <CtaBand v-bind="ctaBands.about" image="/images/hero/business-district.jpg" />
    </div>
  </section>
</template>
