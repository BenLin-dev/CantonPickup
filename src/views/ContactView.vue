<script setup>
import HeroSection from '@/components/HeroSection.vue'
import QuoteForm from '@/components/QuoteForm.vue'
import AppIcon from '@/components/AppIcon.vue'
import PaymentIcons from '@/components/PaymentIcons.vue'
import { useSeo } from '@/composables/useSeo'
import { pages, contactChannels } from '@/data/content'
import { site } from '@/data/site'

const page = pages.contact
useSeo(page)

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
    :crumbs="[{ label: 'Home', to: '/' }, { label: 'Contact' }]"
    :meta="[
      { icon: 'clock', text: site.responseTime },
      { icon: 'shield', text: 'No payment required to get a quote' },
    ]"
  >
    <template #actions>
      <a :href="site.whatsappLink" target="_blank" rel="noopener" class="btn btn--lg">
        <AppIcon name="whatsapp" :size="19" :stroke="1.8" />
        WhatsApp us
      </a>
      <a href="#quote" class="btn btn--outline btn--lg">Use the form</a>
    </template>
  </HeroSection>

  <!-- ------------------------------------------------ contact information -->
  <section class="section" id="quote">
    <div class="container">
      <div class="split" style="align-items: flex-start">
        <!-- left: how to reach us -->
        <div v-reveal>
          <p class="eyebrow">Talk to a person</p>
          <h2>Contact Information</h2>
          <p class="lead">
            Choose whichever is easiest for you. WhatsApp is usually the
            fastest, email is best for detailed itineraries.
          </p>

          <div class="stack mt-32" style="--gap: 12px">
            <template v-for="c in contactChannels" :key="c.label">
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

          <div class="where-we-are mt-32">
            <p class="eyebrow">Where we are</p>
            <a class="where-we-are__row" :href="site.mapsLink" target="_blank" rel="noopener">
              <span class="icon-badge icon-badge--sm" style="margin-bottom: 0">
                <AppIcon name="pin" :size="19" :stroke="1.9" />
              </span>
              <span>
                <strong>{{ site.district }}, {{ site.city }}</strong>
                <span>{{ site.addressLine }}</span>
              </span>
            </a>
            <p class="where-we-are__area">
              <strong>Service area:</strong> {{ site.areaServed }}
            </p>
          </div>
        </div>

        <!-- right: the quote form -->
        <div v-reveal="{ delay: 100 }">
          <div class="card" style="padding: clamp(22px, 3vw, 34px)">
            <p class="eyebrow">Get a quote</p>
            <h2 style="font-size: 1.4rem; margin-bottom: 8px">Send Us a Message</h2>
            <p style="margin: 0 0 22px; font-size: 0.92rem; color: var(--c-muted)">
              The more detail you give us — flight number, addresses, group size —
              the more accurate your price will be.
            </p>

            <QuoteForm />

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

/* address block in the left-hand column */
.where-we-are__row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  text-decoration: none;
}

.where-we-are__row strong {
  display: block;
  font-size: 0.98rem;
  color: var(--c-800);
}

.where-we-are__row span span {
  display: block;
  font-size: 0.86rem;
  color: var(--c-muted);
}

.where-we-are__area {
  margin: 16px 0 0;
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--c-muted);
}

.where-we-are__area strong {
  color: var(--c-ink-2);
}
</style>
