<script setup>
import { useRoute } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import InlineQuote from '@/components/InlineQuote.vue'
import ProcessSteps from '@/components/ProcessSteps.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import CtaBand from '@/components/CtaBand.vue'
import TestimonialWall from '@/components/TestimonialWall.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo, useJsonLd, useBreadcrumbs } from '@/composables/useSeo'
import { intercityAdvantages, intercitySteps, ctaBands } from '@/data/content'
import { site, vehicleOptions } from '@/data/site'
import { routePageBySlug, routeBadges } from '@/data/routePages'
import { money } from '@/utils/price'

/**
 * One view for all six `Guangzhou to <City>` landing pages.
 *
 * Everything that differs between cities — the copy, the price rows, the buyer
 * angle, the FAQ — lives in `src/data/routePages.js`, so adding a seventh city
 * is a data change rather than a new component.
 */
const route = useRoute()

/** `/guangzhou-to-foshan` -> the matching entry in `routePages.js`. */
const page = routePageBySlug(`guangzhou-to-${String(route.params.city || '')}`)

useSeo({
  path: route.path,
  title: page?.title || 'Intercity Transfer | CantonPickup',
  description: page?.description || '',
  keywords: [
    ...(page?.keywords || []),
    'guangzhou private car',
    'english speaking driver guangzhou',
  ].join(', '),
})

useJsonLd(
  `faq-route-${page?.slug || 'unknown'}`,
  page
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: page.faq.map((i) => ({
          '@type': 'Question',
          name: i.q,
          acceptedAnswer: { '@type': 'Answer', text: i.a },
        })),
      }
    : {}
)

if (page) {
  const lowestSedan = (page.table || []).reduce(
    (min, row) => (row.sedan != null && (min === null || row.sedan < min) ? row.sedan : min),
    null
  )

  useJsonLd(`service-route-${page.slug}`, {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${site.domain}${route.path}#service`,
    name: `Guangzhou to ${page.city} Private Transfer`,
    serviceType: 'IntercityTransfer',
    description: page.description,
    url: `${site.domain}${route.path}`,
    provider: { '@id': `${site.domain}#business` },
    areaServed: [
      { '@type': 'City', name: 'Guangzhou' },
      { '@type': 'City', name: page.city },
    ],
    ...(lowestSedan != null
      ? { offers: { '@type': 'Offer', priceCurrency: 'USD', price: String(lowestSedan), url: `${site.domain}${route.path}` } }
      : {}),
  })

  useBreadcrumbs(`route-${page.slug}`, [
    { name: 'Home', path: '/' },
    { name: 'Intercity Transfer', path: '/intercity-transfer' },
    { name: page.city, path: null },
  ])
}

/** Returns null for a leg we have not priced, so the cell can say so instead. */
function cell(value) {
  return value === null || value === undefined ? null : money(value)
}
</script>

<template>
  <template v-if="page">
    <HeroSection
      variant="media"
      :image="page.hero"
      :image-alt="page.heroAlt"
      :eyebrow="page.eyebrow"
      :title="page.h1"
      :lead="page.lede"
      :badges="routeBadges"
      priority
      :crumbs="[
        { label: 'Home', to: '/' },
        { label: 'Intercity Transfer', to: '/intercity-transfer' },
        { label: page.city },
      ]"
    >
      <template #actions>
        <a href="#quote" class="btn btn--light btn--lg">
          Get a Quote
          <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
        </a>
        <a :href="site.waLink($route.path)" target="_blank" rel="noopener" class="btn btn--ghost-light btn--lg">
          <AppIcon name="whatsapp" :size="18" :stroke="1.8" />
          WhatsApp us
        </a>
      </template>
    </HeroSection>

    <!-- ------------------------------------------------------- inline quote -->
    <section id="quote" class="section section--soft">
      <div class="container">
        <InlineQuote
          service="Intercity transfer"
          :title="`Get a Fixed Price to ${page.city}`"
          :lead="`Send us both addresses and we will confirm the fare for your ${page.city} trip.`"
        />
      </div>
    </section>

    <!-- --------------------------------------------------------- why fixed -->
    <section class="section">
      <div class="container">
        <div class="section-head section-head--center" v-reveal>
          <p class="eyebrow">What you get</p>
          <h2>Why Book a Fixed Route</h2>
          <p class="lead">
            Long-distance driving in Guangdong is easy to underestimate. We price it up
            front and give you a realistic arrival window.
          </p>
        </div>

        <div class="grid grid--4">
          <div
            v-for="(a, i) in intercityAdvantages"
            :key="a.title"
            class="card"
            v-reveal="{ delay: i * 70 }"
          >
            <span class="icon-badge">
              <AppIcon :name="a.icon" :size="24" :stroke="1.9" />
            </span>
            <h3 class="card__title">{{ a.title }}</h3>
            <p class="card__text">{{ a.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ------------------------------------------------------------ prices -->
    <section class="section section--soft">
      <div class="container">
        <div class="section-head" v-reveal>
          <p class="eyebrow">Fixed prices</p>
          <h2>Guangzhou to {{ page.city }} Transfer Prices</h2>
          <p class="lead">
            Fixed prices per vehicle, not per person. Tolls, parking and fuel are inside the
            figure, and the fare is the same in either direction.
          </p>
        </div>

        <div class="price-table-wrap">
          <table class="price-table">
            <thead>
              <tr>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Distance</th>
                <th scope="col">Duration</th>
                <th scope="col">Sedan (1–3)</th>
                <th scope="col">7-seat MPV (1–6)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in page.table" :key="row.from + row.to">
                <td data-label="From">{{ row.from }}</td>
                <td data-label="To">{{ row.to }}</td>
                <td data-label="Distance">{{ row.distance }}</td>
                <td data-label="Duration">{{ row.duration }}</td>
                <td data-label="Sedan">
                  <span v-if="cell(row.sedan)" class="price">{{ cell(row.sedan) }}</span>
                  <span v-else class="price-on-request">{{ row.note || 'Quoted on request' }}</span>
                </td>
                <td data-label="7-seat MPV">
                  <span v-if="cell(row.mpv)" class="price">{{ cell(row.mpv) }}</span>
                  <span v-else class="price-on-request">{{ row.note || 'Quoted on request' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul class="check-list check-list--2col mt-32">
          <li v-for="n in page.notes" :key="n">
            <AppIcon name="check" :size="16" :stroke="2.7" />
            {{ n }}
          </li>
        </ul>

        <p class="table-note">
          Airport pickups are quoted on your flight details — send us the flight number and we
          will confirm the figure. Prices shown are in US dollars.
        </p>
      </div>
    </section>

    <!-- ------------------------------------------------------------ buyer -->
    <section class="section">
      <div class="container">
        <div class="split">
          <div v-reveal>
            <p class="eyebrow">For buyers and business travellers</p>
            <h2>{{ page.buyer.title }}</h2>
            <p class="lead">{{ page.buyer.text }}</p>

            <ul class="check-list mt-32">
              <li v-for="p in page.buyer.points" :key="p">
                <AppIcon name="check" :size="16" :stroke="2.7" />
                {{ p }}
              </li>
            </ul>

            <div class="btn-row mt-32">
              <RouterLink to="/multi-day-sourcing-tour" class="btn btn--outline">
                Multi-day sourcing tours
                <AppIcon name="arrow" :size="17" :stroke="2.2" class="btn__arrow" />
              </RouterLink>
            </div>
          </div>

          <div v-reveal="{ delay: 120 }">
            <img
              src="/images/hero/factory.jpg"
              alt="Factory and warehouse district in Guangdong"
              loading="lazy"
              decoding="async"
              style="border-radius: var(--r-xl); box-shadow: var(--sh-lg); width: 100%"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ---------------------------------------------------------- reverse -->
    <section class="section section--tight">
      <div class="container">
        <div class="reverse-band" v-reveal>
          <span class="icon-badge">
            <AppIcon name="route" :size="24" :stroke="1.9" />
          </span>
          <div>
            <h2 class="reverse-band__title">{{ page.reverse.title }}</h2>
            <p>{{ page.reverse.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ------------------------------------------------------- how it works -->
    <section class="section section--mint">
      <div class="container">
        <div class="section-head section-head--center" v-reveal>
          <p class="eyebrow">Step by step</p>
          <h2>How It Works</h2>
          <p class="lead">Four steps, and no meter to watch on the day.</p>
        </div>

        <ProcessSteps :steps="intercitySteps" />
      </div>
    </section>

    <!-- ----------------------------------------------------------- vehicles -->
    <section class="section">
      <div class="container">
        <div class="section-head section-head--center" v-reveal>
          <p class="eyebrow">Comfort and space</p>
          <h2>Choose Your Vehicle</h2>
          <p class="lead">All vehicles are clean, smoke-free and fully insured.</p>
        </div>

        <div class="grid grid--2" style="max-width: 860px; margin: 0 auto">
          <article
            v-for="(v, i) in vehicleOptions"
            :key="v.label"
            class="vehicle"
            v-reveal="{ delay: i * 80 }"
          >
            <div class="vehicle__media">
              <img
                :src="v.image"
                :alt="`${v.label} — Guangzhou to ${page.city} transfer vehicle`"
                loading="lazy"
                decoding="async"
              />
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

        <div class="btn-row mt-32" style="justify-content: center">
          <RouterLink to="/vehicles-pricing" class="btn btn--outline">
            See full fleet &amp; prices
            <AppIcon name="arrow" :size="17" :stroke="2.2" class="btn__arrow" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ------------------------------------------------------------ reviews -->
    <section class="section section--mint">
      <div class="container">
        <div class="section-head section-head--center" v-reveal>
          <p class="eyebrow">Guest reviews</p>
          <h2>What Our Guests Say</h2>
          <p class="lead">Real messages from travellers we have driven in Guangzhou and beyond.</p>
        </div>

        <TestimonialWall />
      </div>
    </section>

    <!-- ---------------------------------------------------------------- faq -->
    <section class="section">
      <div class="container container--narrow">
        <div class="section-head section-head--center" v-reveal>
          <p class="eyebrow">Good to know</p>
          <h2>Guangzhou–{{ page.city }} Transfer FAQ</h2>
        </div>

        <FaqAccordion :items="page.faq" :id-prefix="page.slug" :open-index="0" />

        <div class="btn-row mt-32" style="justify-content: center">
          <RouterLink :to="page.service.to" class="btn btn--outline btn--sm">
            {{ page.service.label }}
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <CtaBand
          v-bind="ctaBands.intercity"
          :title="`Ready to Book Your ${page.city} Transfer?`"
          :image="page.hero"
        />
      </div>
    </section>
  </template>

  <!-- unknown city in the URL — a real 404 beats a half-rendered page -->
  <section v-else class="section">
    <div class="container container--narrow" style="text-align: center">
      <h1>Route not found</h1>
      <p class="lead">
        We could not find that route. Have a look at every intercity fare we publish, or send us
        both addresses and we will quote it.
      </p>
      <div class="btn-row" style="justify-content: center">
        <RouterLink to="/intercity-transfer" class="btn">All intercity routes</RouterLink>
        <RouterLink to="/contact" class="btn btn--outline">Get a quote</RouterLink>
      </div>
    </div>
  </section>
</template>
