<script setup>
import HeroSection from '@/components/HeroSection.vue'
import VehicleFleet from '@/components/VehicleFleet.vue'
import ProcessSteps from '@/components/ProcessSteps.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import CtaBand from '@/components/CtaBand.vue'
import AppIcon from '@/components/AppIcon.vue'
import PaymentIcons from '@/components/PaymentIcons.vue'
import { useSeo, useJsonLd, useBreadcrumbs } from '@/composables/useSeo'
import {
  pages,
  faqGroups,
  ctaBands,
  pricingIncluded,
  pricingExcluded,
  paymentMethods,
  paymentSteps,
  cancellationPolicy,
  heroBadges,
} from '@/data/content'
import { site, pricing, priceHighlights, intercityRoutes, popularRoutes, featuredVehicles } from '@/data/site'
import { money, moneyOr } from '@/utils/price'

const page = pages.vehiclesPricing
useSeo(page)

const pricingFaq = faqGroups.find((g) => g.id === 'pricing')

useJsonLd('faq-pricing', {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pricingFaq.items.map((i) => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
})

useBreadcrumbs('vehicles-pricing', [
  { name: 'Home', path: '/' },
  { name: 'Vehicles & Pricing', path: null },
])

/** Two tables — one per vehicle class — so each price column stays readable. */
const tables = [
  { key: 'sedan', ...pricing.sedan, image: '/images/vehicles/byd-han.jpg' },
  { key: 'mpv', ...pricing.mpv, image: '/images/vehicles/gac-m8-white.jpg' },
]

/** Route rows fall back to "On request" when we have no fixed price yet. */
const price = moneyOr

/**
 * Push `cta_click` for the pricing hero / booking widget CTAs. The shared
 * CtaBand and VehicleCard components have their own tracking; this covers
 * the one-off `Book with a 20% deposit` link in the booking widget.
 */
function trackCta(label, destination) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'cta_click',
    cta_label: label,
    cta_destination: destination,
    page_path: window.location.pathname,
    page_title: document.title,
  })
}
</script>

<template>
  <HeroSection
    variant="media"
    image="/images/hero/fleet.jpg"
    image-alt="Fleet of private hire vehicles in Guangzhou"
    eyebrow="Vehicles &amp; Pricing"
    :title="page.h1"
    :lead="page.lead"
    :badges="heroBadges.vehiclesPricing"
    priority
    :crumbs="[{ label: 'Home', to: '/' }, { label: 'Vehicles & Pricing' }]"
  >
    <template #actions>
      <RouterLink to="/contact" class="btn btn--light btn--lg" @click="trackCta('Get a Quote', '/contact')">
        Get a Quote
        <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
      </RouterLink>
      <a href="#pricing-overview" class="btn btn--ghost-light btn--lg">See prices</a>
    </template>
  </HeroSection>

  <!-- ------------------------------------------------------------- fleet -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Our fleet</p>
        <h2>Sedans and 7-Seat MPVs</h2>
        <p class="lead">
          Every vehicle is air-conditioned, cleaned before each trip and comes
          with an English-speaking driver.
        </p>
      </div>

      <!-- the three headline vehicles always come first -->
      <VehicleFleet :slugs="featuredVehicles" />

      <!-- everything else follows below, in the same list -->
      <div id="all-vehicles" class="mt-56">
        <div class="fleet-more-head" v-reveal>
          <h3>More vehicles in our fleet</h3>
          <p>
            Same English-speaking driver, same fixed price — pick whichever
            suits your group and luggage.
          </p>
        </div>

        <VehicleFleet :exclude="featuredVehicles" />
      </div>
    </div>
  </section>

  <!-- -------------------------------------------------- pricing overview -->
  <section class="section section--soft" id="pricing-overview">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Transparent pricing</p>
        <h2>Pricing Overview</h2>
        <p class="lead">
          All prices are per vehicle, not per person, and already include fuel,
          tolls and parking inside the city area. Everything is quoted in US
          dollars — the price you see is the price you pay.
        </p>
      </div>

      <div class="grid grid--3">
        <div v-for="(h, i) in priceHighlights" :key="h.label" class="price-card" v-reveal="{ delay: i * 80 }">
          <p class="eyebrow" style="margin-bottom: 0">{{ h.unit }}</p>
          <h3 class="card__title" style="font-size: 1.05rem">{{ h.label }}</h3>
          <p class="price-card__amount">From {{ money(h.from) }}</p>
          <RouterLink :to="h.to" class="btn btn--outline btn--sm">
            View details
            <AppIcon name="arrow" :size="16" :stroke="2.2" class="btn__arrow" />
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <!-- -------------------------------------------------------- price tables -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Full price list</p>
        <h2>Airport, Station and Private Hire Rates</h2>
        <p class="lead">
          All prices in US dollars. The price we confirm is the price you pay —
          the only extras are listed underneath each table.
        </p>
      </div>

      <div class="grid grid--2">
        <div v-for="t in tables" :key="t.key" v-reveal>
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px">
            <img
              :src="t.image"
              :alt="`${t.label} — private hire vehicle`"
              width="72"
              height="54"
              loading="lazy"
              decoding="async"
              style="border-radius: var(--r-sm); object-fit: cover; flex: none"
            />
            <div>
              <h3 style="margin: 0; font-size: 1.15rem">{{ t.label }}</h3>
              <p style="margin: 2px 0 0; font-size: 0.86rem; color: var(--c-muted)">{{ t.seats }}</p>
            </div>
          </div>

          <div class="price-table-wrap">
            <table class="price-table">
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Included</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in t.rows" :key="r.service">
                  <td data-label="Service">{{ r.service }}</td>
                  <td data-label="Included" style="color: var(--c-muted)">{{ r.scope }}</td>
                  <td data-label="Price">
                    <span class="price">{{ money(r.price) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <ul class="stack mt-24" style="--gap: 10px">
            <li v-for="e in t.extras" :key="e.label" class="review__meta" style="display: flex; gap: 8px">
              <AppIcon name="spark" :size="15" :stroke="2" />
              <span><strong>{{ e.label }}:</strong> {{ e.value }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ------------------------------------------------------- fixed routes -->
  <section class="section section--mint">
    <div class="container">
      <div class="section-head" v-reveal>
        <p class="eyebrow">Most booked</p>
        <h2>Popular Fixed-Price Routes</h2>
        <p class="lead">The journeys we are asked for most often, priced up front.</p>
      </div>

      <div class="price-table-wrap">
        <table class="price-table">
          <thead>
            <tr>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Journey time</th>
              <th scope="col">Sedan</th>
              <th scope="col">MPV</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in popularRoutes" :key="r.from + r.to">
              <td data-label="From">{{ r.from }}</td>
              <td data-label="To">{{ r.to }}</td>
              <td data-label="Journey time" style="color: var(--c-muted)">{{ r.duration }}</td>
              <td data-label="Sedan" style="text-align: right">
                {{ price(r.sedan) }}
              </td>
              <td data-label="MPV">
                <span class="price">{{ price(r.mpv) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ---------------------------------------------------- what's included -->
  <section class="section">
    <div class="container">
      <div class="grid grid--2">
        <div class="card" v-reveal>
          <span class="icon-badge">
            <AppIcon name="check" :size="24" :stroke="2.2" />
          </span>
          <h2 style="font-size: 1.3rem">What's Included</h2>
          <ul class="check-list mt-24" style="font-size: 1rem">
            <li v-for="i in pricingIncluded" :key="i">
              <AppIcon name="check" :size="17" :stroke="2.6" />
              {{ i }}
            </li>
          </ul>
        </div>

        <div class="card card--flat" v-reveal="{ delay: 100 }">
          <span class="icon-badge" style="background: #fff">
            <AppIcon name="wallet" :size="24" :stroke="1.9" />
          </span>
          <h2 style="font-size: 1.3rem">Charged Separately</h2>
          <ul class="stack mt-24" style="--gap: 12px">
            <li v-for="e in pricingExcluded" :key="e" style="display: flex; gap: 10px; font-size: 0.95rem">
              <AppIcon name="spark" :size="16" :stroke="2" style="flex: none; margin-top: 3px; color: var(--c-600)" />
              <span style="color: var(--c-ink-2)">{{ e }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- intercity fixed routes -->
      <div class="mt-40" v-reveal>
        <h3 style="font-size: 1.15rem; margin-bottom: 14px">Intercity Fixed Routes</h3>
        <div class="price-table-wrap">
          <table class="price-table">
            <thead>
              <tr>
                <th scope="col">Route (one way)</th>
                <th scope="col">Sedan</th>
                <th scope="col">MPV</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in intercityRoutes" :key="r.route">
                <td data-label="Route">{{ r.route }}</td>
                <td data-label="Sedan">{{ money(r.sedan) }}</td>
                <td data-label="MPV"><span class="price">{{ money(r.mpv) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="table-note">
          Same price in both directions, tolls and parking included. Heading
          somewhere else in the Pearl River Delta? Send us the address — we will
          confirm the total before you book.
        </p>
      </div>
    </div>
  </section>

  <!-- ------------------------------------------------- payment and deposit -->
  <section class="section section--soft" id="payment">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Flexible &amp; safe payment</p>
        <h2>How Payment Works</h2>
        <p class="lead">
          Only a 20% deposit is needed to confirm your booking, and you can pay
          it with a card or PayPal before you fly — no Chinese payment app
          required for overseas guests.
        </p>
      </div>

      <ProcessSteps :steps="paymentSteps" />

      <!-- payment badges, styled after the reference site -->
      <div class="pay-accept mt-40" v-reveal>
        <PaymentIcons />
        <p class="pay-accept__note">
          Only the 20% deposit is paid up front — settle the balance after your
          trip, however you prefer.
        </p>
      </div>

      <div class="pay-grid mt-24">
        <div
          v-for="(p, i) in paymentMethods"
          :key="p.label"
          class="pay-card"
          v-reveal="{ delay: i * 60 }"
        >
          <span class="icon-badge icon-badge--sm">
            <AppIcon :name="p.icon" :size="20" :stroke="2" />
          </span>
          <div>
            <h3 class="pay-card__label">
              {{ p.label }}
              <span v-if="p.badge" class="pay-card__badge">{{ p.badge }}</span>
            </h3>
            <p class="pay-card__hint">{{ p.hint }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- -------------------------------------------------- cancellation policy -->
  <section class="section" id="cancellation">
    <div class="container">
      <div class="grid grid--2" style="align-items: start">
        <div v-reveal>
          <p class="eyebrow">Plans change</p>
          <h2>Cancellation Policy</h2>
          <p class="lead">
            Tell us as early as you can and we will always try to help. Our
            standard terms are simple and shown here in full — no small print.
          </p>

          <ul class="policy-list mt-24">
            <li v-for="c in cancellationPolicy" :key="c.label" :class="`policy-row policy-row--${c.tone}`">
              <span class="policy-row__icon">
                <AppIcon :name="c.icon" :size="19" :stroke="2.2" />
              </span>
              <div>
                <strong>{{ c.label }}</strong>
                <span>{{ c.value }}</span>
              </div>
            </li>
          </ul>

          <div class="btn-row mt-32">
            <RouterLink
              to="/contact"
              class="btn btn--sm"
              @click="trackCta('Book with a 20% deposit', '/contact')"
            >Book with a 20% deposit</RouterLink>
            <a :href="site.waLink($route.path)" target="_blank" rel="noopener" class="btn btn--outline btn--sm">
              <AppIcon name="whatsapp" :size="17" :stroke="1.8" />
              Ask a question
            </a>
          </div>
        </div>

        <div class="card" v-reveal="{ delay: 120 }" style="background: var(--c-mint); border-color: transparent">
          <span class="icon-badge" style="background: #fff">
            <AppIcon name="shield" :size="24" :stroke="1.9" />
          </span>
          <h2 style="font-size: 1.25rem">Book With Confidence</h2>
          <ul class="check-list mt-24" style="font-size: 0.97rem">
            <li>
              <AppIcon name="check" :size="17" :stroke="2.6" />
              Deposit refunded in full when you cancel more than 48 hours ahead
            </li>
            <li>
              <AppIcon name="check" :size="17" :stroke="2.6" />
              Pay the balance only after the service has been delivered
            </li>
            <li>
              <AppIcon name="check" :size="17" :stroke="2.6" />
              Card and PayPal payments handled over an encrypted connection
            </li>
            <li>
              <AppIcon name="check" :size="17" :stroke="2.6" />
              One fixed price confirmed in writing before you pay anything
            </li>
            <li>
              <AppIcon name="check" :size="17" :stroke="2.6" />
              Flight monitored, so a delay never costs you the driver
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ---------------------------------------------------------------- faq -->
  <section class="section section--soft">
    <div class="container container--narrow">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Good to know</p>
        <h2>Pricing &amp; Payment FAQs</h2>
      </div>

      <FaqAccordion :items="pricingFaq.items" id-prefix="prc" :open-index="0" />

      <div class="btn-row mt-32" style="justify-content: center">
        <RouterLink to="/faqs" class="btn btn--outline btn--sm">All frequently asked questions</RouterLink>
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="container">
      <CtaBand v-bind="ctaBands.vehicles" image="/images/hero/fleet.jpg" />
    </div>
  </section>
</template>

<style scoped>
/* heading that separates the headline vehicles from the rest of the fleet */
.fleet-more-head {
  max-width: 620px;
  margin: 0 auto 28px;
  text-align: center;
}

.fleet-more-head h3 {
  font-size: 1.4rem;
  margin-bottom: 8px;
}

.fleet-more-head p {
  margin: 0;
  color: var(--c-muted);
}

/* "We accept" badge strip */
.pay-accept {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 32px;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid var(--c-line);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-sm);
}

.pay-accept__note {
  margin: 0;
  max-width: 46ch;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--c-muted);
}

/* payment methods */
.pay-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.pay-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  background: #fff;
  border: 1px solid var(--c-line);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-sm);
}

.pay-card__label {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 4px;
  font-size: 1rem;
}

.pay-card__badge {
  padding: 2px 8px;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-700);
  background: var(--c-100);
  border-radius: 999px;
}

.pay-card__hint {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--c-muted);
}

/* cancellation policy */
.policy-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.policy-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: var(--r-lg);
  border: 1px solid var(--c-line);
  background: #fff;
}

.policy-row__icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 50%;
  background: var(--c-100);
  color: var(--c-700);
}

.policy-row strong {
  display: block;
  font-size: 0.95rem;
  color: var(--c-900);
}

.policy-row span:not(.policy-row__icon) {
  display: block;
  font-size: 0.86rem;
  color: var(--c-muted);
}

.policy-row--good {
  border-color: var(--c-200);
  background: var(--c-50);
}

.policy-row--warn .policy-row__icon {
  background: #fdf3e2;
  color: #9a6b12;
}

.policy-row--bad .policy-row__icon {
  background: #fbeceb;
  color: #9c3a33;
}

@media (max-width: 900px) {
  .pay-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .pay-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
