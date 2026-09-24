<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import QuoteForm from '@/components/QuoteForm.vue'
import AppIcon from '@/components/AppIcon.vue'
import PaymentIcons from '@/components/PaymentIcons.vue'
import { useSeo, useJsonLd, useBreadcrumbs } from '@/composables/useSeo'
import { pages, contactChannels, serviceBySlug } from '@/data/content'
import { site } from '@/data/site'

const page = pages.contact
useSeo(page)

/**
 * LocalBusiness + ContactPage blocks. The LocalBusiness block is a copy of
 * the one on the home page so both pages share an `@id` — that lets Google
 * consolidate the two representations into one entity in the knowledge graph.
 */
useJsonLd('contact-business', {
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
  areaServed: site.areaServed.split(' · ').map((name) => ({ '@type': 'City', name })),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'customer service', telephone: site.phoneRaw, email: site.email, availableLanguage: ['English', 'Chinese'] },
  ],
})

useJsonLd('contact-page', {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${site.domain}/contact#page`,
  url: `${site.domain}/contact`,
  name: page.title,
  description: page.description,
  isPartOf: { '@id': `${site.domain}#business` },
  inLanguage: 'en',
})

useBreadcrumbs('contact', [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: null },
])

const route = useRoute()

/**
 * "Book Now" on a service card links here with `?service=<slug>`; we turn that
 * slug into the matching option on the quote form so the visitor does not have
 * to pick their service a second time.
 */
const preselect = computed(() => serviceBySlug(String(route.query.service || ''))?.quote || '')

/**
 * `contactChannels` ships a plain `https://wa.me/...` address, because
 * `content.js` cannot import `site.js` — `site.js` imports `content.js`, so
 * that would be a cycle. Swap in the shared click-to-chat link instead, so
 * this card carries the same pre-filled first message as the header, footer
 * and floating button and can never drift from them.
 *
 * `route.path` rather than `$route.path`: this one is built in script, not in
 * the template.
 */
const channels = computed(() =>
  contactChannels.map((c) => (c.icon === 'whatsapp' ? { ...c, href: site.waLink(route.path) } : c)),
)

/**
 * Keyless Google Maps embed — `output=embed` on the plain maps URL renders the
 * interactive map without an API key, which keeps the page dependency-free.
 */
const mapEmbed = computed(
  () =>
    `https://www.google.com/maps?q=${encodeURIComponent(
      `${site.district}, ${site.city}, ${site.region}, ${site.country}`
    )}&z=11&hl=en&output=embed`
)

/**
 * Graceful degradation for the map.
 *
 * The embed is served by Google, which is unreachable from mainland China
 * networks. There the iframe resolves to a blank error page — and Chrome paints
 * that page white — so without a fallback the visitor gets a large empty box
 * that reads as a broken site. (Anyone previewing the site from Guangzhou sees
 * exactly that, which is how this was caught.)
 *
 * `onload` is not proof of success: it fires for error pages too. So the handler
 * probes the framed document instead. A real Google Maps frame is cross-origin
 * and throws on access; a failed one is a readable same-origin `about:blank`.
 * Until the probe says yes, the iframe stays transparent and the fallback card
 * underneath carries the address.
 */
const mapLoaded = ref(false)

function onMapLoad(event) {
  const frame = event.target
  try {
    const doc = frame.contentDocument
    mapLoaded.value = !(doc && doc.location.href === 'about:blank')
  } catch {
    mapLoaded.value = true // cross-origin ⇒ the real map is in there
  }
}

const goodToKnow = [
  { icon: 'clock', title: 'Fast replies', text: site.responseTime },
  { icon: 'calendar', title: 'Open every day', text: site.hours },
  { icon: 'translate', title: 'English & Mandarin', text: 'We answer in the language you write in.' },
  {
    icon: 'wallet',
    title: 'Nothing to pay for a quote',
    text: 'Get your fixed price first. A 20% deposit confirms the booking, and it is refunded in full if you cancel more than 48 hours before pickup.',
  },
]
</script>

<template>
  <HeroSection
    variant="split"
    image="/images/hero/guangzhou-night.jpg"
    image-alt="Guangzhou skyline at night"
    eyebrow="Contact"
    :title="page.h1"
    :lead="page.lead"
    priority
    :media-on-mobile="false"
    :crumbs="[{ label: 'Home', to: '/' }, { label: 'Contact' }]"
    :meta="[
      { icon: 'clock', text: site.responseTime },
      { icon: 'shield', text: 'No payment required to get a quote' },
    ]"
  >
    <template #actions>
      <a :href="site.waLink($route.path)" target="_blank" rel="noopener" class="btn btn--lg">
        <AppIcon name="whatsapp" :size="19" :stroke="1.8" />
        WhatsApp us
      </a>
      <a href="#quote" class="btn btn--outline btn--lg">Use the form</a>
    </template>
  </HeroSection>

  <!-- ------------------------------------------------ contact information -->
  <section class="section" id="quote">
    <div class="container">
      <div class="split contact-split" style="align-items: flex-start">
        <!-- left: how to reach us -->
        <div class="contact-split__info" v-reveal>
          <p class="eyebrow">Talk to a person</p>
          <h2>Contact Information</h2>
          <p class="lead">
            Choose whichever is easiest for you. WhatsApp is usually the
            fastest, email is best for detailed itineraries.
          </p>

          <div class="stack mt-32" style="--gap: 12px">
            <template v-for="c in channels" :key="c.label">
              <a
                v-if="c.href"
                class="card card--link"
                style="display: flex; gap: 14px; align-items: flex-start; text-decoration: none"
                :href="c.href"
                :target="c.external ? '_blank' : undefined"
                :rel="c.external ? 'noopener' : undefined"
              >
                <span class="icon-badge icon-badge--sm" style="margin-bottom: 0">
                  <AppIcon :name="c.icon" :size="19" :stroke="1.9" />
                </span>
                <span>
                  <strong style="display: block; color: var(--c-800); font-size: 0.98rem">{{ c.label }}</strong>
                  <span style="display: block; color: var(--c-700); font-weight: 650">{{ c.value }}</span>
                  <span style="display: block; font-size: 0.83rem; color: var(--c-muted)">{{ c.hint }}</span>
                </span>
              </a>

              <div v-else class="card" style="display: flex; gap: 14px; align-items: flex-start">
                <span class="icon-badge icon-badge--sm" style="margin-bottom: 0">
                  <AppIcon :name="c.icon" :size="19" :stroke="1.9" />
                </span>
                <span>
                  <strong style="display: block; color: var(--c-800); font-size: 0.98rem">{{ c.label }}</strong>
                  <span style="display: block; color: var(--c-700); font-weight: 650">{{ c.value }}</span>
                  <span style="display: block; font-size: 0.83rem; color: var(--c-muted)">{{ c.hint }}</span>
                </span>
              </div>
            </template>
          </div>
        </div>

        <!-- right: the quote form -->
        <div class="contact-split__form" v-reveal="{ delay: 100 }">
          <div class="card" style="padding: clamp(22px, 3vw, 34px)">
            <p class="eyebrow">Get a quote</p>
            <h2 style="font-size: 1.4rem; margin-bottom: 8px">Send Us a Message</h2>
            <p style="margin: 0 0 22px; font-size: 0.92rem; color: var(--c-muted)">
              The more detail you give us — flight number, addresses, group size —
              the more accurate your price will be.
            </p>

            <QuoteForm :preselect="preselect" />

            <ul class="quote-assure">
              <li>
                <AppIcon name="check" :size="16" :stroke="2.6" />
                A 20% deposit confirms your booking — PayPal or card
              </li>
              <li>
                <AppIcon name="check" :size="16" :stroke="2.6" />
                Free cancellation up to 48 hours before pickup
              </li>
              <li>
                <AppIcon name="check" :size="16" :stroke="2.6" />
                Pay the balance after your trip, in the way that suits you
              </li>
            </ul>

            <div class="quote-accept">
              <PaymentIcons />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- --------------------------------------------------------- our location -->
  <section class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Where we are</p>
        <h2>Our Location</h2>
        <p class="lead">
          We are based in Baiyun District, between downtown Guangzhou and Baiyun
          International Airport — which is why airport pickups are the booking we
          handle most.
        </p>
      </div>

      <div class="map-card" v-reveal>
        <div class="map-card__frame" :class="{ 'is-pending': !mapLoaded }">
          <!-- shown while the embed is loading, and kept if it never arrives -->
          <div class="map-card__fallback" v-show="!mapLoaded">
            <span class="map-card__fallback-pin">
              <AppIcon name="pin" :size="22" :stroke="1.9" />
            </span>
            <strong>Our base in {{ site.city }}</strong>
            <p>{{ site.addressLine }}</p>
            <p class="map-card__fallback-note">
              We pick up across {{ site.areaServed.split(' · ').slice(0, 3).join(', ') }} and the
              surrounding region.
            </p>
          </div>

          <iframe
            :src="mapEmbed"
            title="Map of CantonPickup in Baiyun District, Guangzhou"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
            @load="onMapLoad"
          ></iframe>
        </div>

        <div class="map-card__side">
          <div class="map-card__row">
            <span class="icon-badge icon-badge--sm">
              <AppIcon name="pin" :size="19" :stroke="1.9" />
            </span>
            <span>
              <strong>Address</strong>
              <span>{{ site.addressLine }}</span>
            </span>
          </div>

          <div class="map-card__row">
            <span class="icon-badge icon-badge--sm">
              <AppIcon name="clock" :size="19" :stroke="1.9" />
            </span>
            <span>
              <strong>Opening hours</strong>
              <span>{{ site.hours }}</span>
            </span>
          </div>

          <div class="map-card__row">
            <span class="icon-badge icon-badge--sm">
              <AppIcon name="route" :size="19" :stroke="1.9" />
            </span>
            <span>
              <strong>Service area</strong>
              <span>{{ site.areaServed }}</span>
            </span>
          </div>

          <a
            class="btn btn--outline btn--block"
            :href="site.mapsLink"
            target="_blank"
            rel="noopener"
            style="margin-top: auto"
          >
            <AppIcon name="pin" :size="17" :stroke="1.9" />
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ---------------------------------------------------------- good to know -->
  <section class="section section--soft">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p class="eyebrow">Before you write</p>
        <h2>Good to Know</h2>
      </div>

      <div class="grid grid--4">
        <div v-for="(g, i) in goodToKnow" :key="g.title" class="card card--flat" v-reveal="{ delay: i * 70 }">
          <span class="icon-badge" style="background: #fff">
            <AppIcon :name="g.icon" :size="23" :stroke="1.9" />
          </span>
          <h3 class="card__title" style="font-size: 1.02rem">{{ g.title }}</h3>
          <p class="card__text">{{ g.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * Mobile order swap: the quote form comes BEFORE the contact-channel list.
 *
 * On a phone `.split` collapses to one column, so the stacked order decided
 * what the visitor met first — and it met the eyebrow, the heading, the lead
 * and three channel cards before a single input. That is what put the first
 * form field at 1830px (2.2 screens). The form is the Google Ads conversion,
 * so it goes first; the "talk to a person" cards follow it.
 */
@media (max-width: 900px) {
  .contact-split__form {
    order: -1;
  }
}

/* reassurance list under the quote form */
.quote-assure {
  display: grid;
  gap: 9px;
  margin: 22px 0 0;
  padding: 18px 0 0;
  border-top: 1px solid var(--c-line-2);
  list-style: none;
}

.quote-assure li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--c-ink-2);
}

.quote-assure svg {
  flex: none;
  margin-top: 2px;
  color: var(--c-600);
}

.quote-accept {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--c-line-2);
}

/* ---------------------------------------------------------- our location */
/* Map on the left, the practical details on the right. Stacks on narrow
   screens so the map keeps a usable height instead of a letterbox strip. */
.map-card {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: clamp(18px, 2.6vw, 32px);
  align-items: stretch;
  background: #fff;
  border: 1px solid var(--c-line);
  border-radius: var(--r-xl);
  padding: clamp(16px, 2.2vw, 24px);
  box-shadow: var(--sh-md);
}

.map-card__frame {
  position: relative;
  min-height: 380px;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--c-100);
}

.map-card__frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  z-index: 1;
  /*
   * Held at zero opacity until the load probe confirms a real map. Chrome
   * paints its own error page white, and that page would sit on top of the
   * fallback and hide it — so the failing iframe must stay invisible.
   */
  transition: opacity 0.25s ease;
}

.map-card__frame.is-pending iframe {
  opacity: 0;
}

/* Sits under the iframe; visible while loading and whenever the embed fails. */
.map-card__fallback {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 26px;
  text-align: center;
  background: linear-gradient(160deg, var(--c-50), var(--c-100));
}

.map-card__fallback-pin {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 6px;
  border-radius: 999px;
  background: #fff;
  color: var(--c-600);
  box-shadow: var(--sh-sm);
}

.map-card__fallback strong {
  font-size: 1.05rem;
  color: var(--c-800);
}

.map-card__fallback p {
  max-width: 34ch;
  margin: 0;
  font-size: 0.87rem;
  line-height: 1.6;
  color: var(--c-muted);
}

.map-card__fallback-note {
  font-size: 0.82rem;
  color: var(--c-muted-2);
}

.map-card__side {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: clamp(4px, 1vw, 12px) clamp(2px, 0.8vw, 8px);
}

.map-card__row {
  display: flex;
  gap: 13px;
  align-items: flex-start;
}

.map-card__row strong {
  display: block;
  font-size: 0.95rem;
  color: var(--c-800);
  line-height: 1.35;
}

.map-card__row span span {
  display: block;
  font-size: 0.87rem;
  line-height: 1.55;
  color: var(--c-muted);
}

@media (max-width: 900px) {
  .map-card {
    grid-template-columns: minmax(0, 1fr);
  }

  .map-card__frame {
    min-height: 300px;
  }
}
</style>
