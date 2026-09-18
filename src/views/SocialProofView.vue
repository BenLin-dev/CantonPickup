<script setup>
import HeroSection from '@/components/HeroSection.vue'
import InlineQuote from '@/components/InlineQuote.vue'
import PhotoWall from '@/components/PhotoWall.vue'
import TestimonialWall from '@/components/TestimonialWall.vue'
import CtaBand from '@/components/CtaBand.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo, useJsonLd, useBreadcrumbs } from '@/composables/useSeo'
import { pages } from '@/data/content'
import { proofStats, guestCountries, proofCredentials } from '@/data/socialProof'
import { site } from '@/data/site'

/**
 * Social proof page — the numbers, the photographs and the reviews in one
 * place, so a first-time visitor can check us out before they commit.
 *
 * The figures live in `src/data/socialProof.js`. They are placeholders; see the
 * warning at the top of that file.
 *
 * The photo wall is not content in this file. It reads whatever sits in
 * `public/images/gallery/`, so the photographs are dropped in as files rather
 * than described in code — see `PhotoWall.vue`.
 *
 * Page-level SEO lives in `pages.reviews` so the SSR pass in `entry-server.js`
 * can render the same `<title>` / `<meta>` block this view sets in the browser.
 */
const page = pages.reviews
useSeo(page)

useJsonLd('social-proof', {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${site.domain}/reviews`,
  name: 'Reviews, Photos & Track Record',
  inLanguage: 'en',
  about: { '@type': 'Organization', name: site.name, url: site.domain },
})

useBreadcrumbs('reviews', [
  { name: 'Home', path: '/' },
  { name: 'Reviews', path: null },
])
</script>

<template>
  <HeroSection
    variant="split"
    image="/images/hero/chauffeur.jpg"
    image-alt="Chauffeur opening the car door for a guest in Guangzhou"
    eyebrow="Track record"
    title="Reviews, Photos & Track Record"
    lead="We are a small local team, not a booking platform. Here is who we have driven, what the trips look like, and what every fare includes."
    :badges="['Guest reviews', 'Real pickup photos', 'Fixed prices']"
    priority
  />

  <!-- ------------------------------------------------------------ stat bar -->
  <section class="proof-stats">
    <div class="container">
      <dl class="proof-stats__grid">
        <div v-for="s in proofStats" :key="s.label" class="proof-stat" v-reveal>
          <dt class="proof-stat__value">{{ s.value }}</dt>
          <dd>
            <span class="proof-stat__label">{{ s.label }}</span>
            <span class="proof-stat__sub">{{ s.sub }}</span>
          </dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- ------------------------------------------------------- action gallery -->
  <PhotoWall
    eyebrow="On the job"
    title="See Us in Action"
    lead="Airport pickups, factory runs and long days on the delta highways — the parts of the job you do not see when you book."
  />

  <!-- ----------------------------------------------------------- reviews -->
  <section class="section section--mint">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Guest reviews</p>
        <h2>What Our Guests Say</h2>
        <p class="lead">
          Real WhatsApp and WeChat conversations, shared with permission. Tap any screenshot
          to read it in full.
        </p>
      </div>

      <TestimonialWall />
    </div>
  </section>

  <!-- ---------------------------------------------------------- countries -->
  <section class="section section--tight">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Who travels with us</p>
        <h2>Guests From {{ guestCountries.length }} Countries</h2>
        <p class="lead">
          Business travellers, buyers and families — most of them booking a driver in China
          for the first time.
        </p>
      </div>

      <ul class="country-row">
        <li v-for="c in guestCountries" :key="c.code" class="country-chip">
          <span class="country-chip__code">{{ c.code }}</span>
          {{ c.name }}
        </li>
      </ul>
    </div>
  </section>

  <!-- -------------------------------------------------------- credentials -->
  <section class="section section--soft">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">What you are booking</p>
        <h2>Standards We Hold Ourselves To</h2>
        <p class="lead">The things worth checking before you hand over a deposit to any driver in China.</p>
      </div>

      <div class="grid grid--3">
        <div
          v-for="(c, i) in proofCredentials"
          :key="c.title"
          class="card"
          v-reveal="{ delay: (i % 3) * 70 }"
        >
          <span class="icon-badge">
            <AppIcon :name="c.icon" :size="24" :stroke="1.9" />
          </span>
          <h3 class="card__title">{{ c.title }}</h3>
          <p class="card__text">{{ c.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- --------------------------------------------------------- inline quote -->
  <section class="section">
    <div class="container">
      <InlineQuote
        title="Book With Confidence"
        lead="Tell us your trip. We will confirm a fixed price, the vehicle and your driver before you pay anything."
      />
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <CtaBand
        title="Questions Before You Book?"
        text="Message us on WhatsApp and a real person will answer — usually within minutes."
        image="/images/hero/guangzhou-bluehour.jpg"
        secondary="See our prices"
        secondary-to="/vehicles-pricing"
      />
    </div>
  </section>
</template>

<style scoped>
/* ------------------------------------------------------------- stat bar */
.proof-stats {
  padding: clamp(32px, 5vw, 52px) 0;
  background: var(--sky-900, var(--c-900));
  color: #fff;
}

.proof-stats__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(20px, 3vw, 40px);
  margin: 0;
}

.proof-stat {
  text-align: center;
}

.proof-stat__value {
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 3.4vw, 2.6rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.proof-stat dd {
  margin: 6px 0 0;
}

.proof-stat__label {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.94);
}

.proof-stat__sub {
  display: block;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.68);
  margin-top: 2px;
}

@media (max-width: 760px) {
  .proof-stats__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 26px 18px;
  }
}

/* ------------------------------------------------------------ countries */
.country-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  max-width: 900px;
  margin: 0 auto;
}

.country-chip {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 16px 9px 10px;
  border-radius: var(--r-full);
  border: 1px solid var(--c-line);
  background: #fff;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--c-700);
}

.country-chip__code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 22px;
  padding: 0 6px;
  border-radius: var(--r-sm, 6px);
  background: var(--c-100);
  color: var(--c-700);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}
</style>
