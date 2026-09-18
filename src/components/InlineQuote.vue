<script setup>
import AppIcon from './AppIcon.vue'
import QuoteForm from './QuoteForm.vue'
import { site } from '@/data/site'

/**
 * Inline quote panel for landing pages.
 *
 * Deliberately a thin wrapper around `QuoteForm` rather than a second form
 * implementation — one submit path, one place to fix a bug, one set of GTM
 * events. `QuoteForm` already knows how to run in `compact` mode (it hides the
 * pickup / drop-off pair) and how to pre-select a service from a slug.
 *
 * The panel is rendered eagerly, not lazily, on purpose: it has to be present
 * in the prerendered HTML so the page still converts if the JS bundle is slow.
 */
defineProps({
  /** Service option to pre-select — must match a value in `serviceOptions`. */
  service: { type: String, default: '' },
  title: { type: String, default: 'Get Your Free Quote' },
  lead: {
    type: String,
    default: 'Tell us the trip and we will come back with a fixed, all-inclusive price.',
  },
  /** Small line under the button; pass '' to hide. */
  reassurance: {
    type: String,
    default: 'No payment now — we reply with a fixed price.',
  },
})
</script>

<template>
  <div class="inline-quote">
    <div class="inline-quote__aside">
      <p class="eyebrow">Free quote</p>
      <h2 class="inline-quote__title">{{ title }}</h2>
      <p class="inline-quote__lead">{{ lead }}</p>

      <ul class="inline-quote__points">
        <li>
          <AppIcon name="clock" :size="18" :stroke="2.1" />
          <span><strong>Reply within 60 minutes</strong> during business hours</span>
        </li>
        <li>
          <AppIcon name="wallet" :size="18" :stroke="2.1" />
          <span><strong>Fixed price per vehicle</strong> — tolls and parking included</span>
        </li>
        <li>
          <AppIcon name="shield" :size="18" :stroke="2.1" />
          <span><strong>20% deposit</strong>, and free cancellation up to 48 hours before</span>
        </li>
      </ul>

      <p class="inline-quote__alt">
        Prefer to chat? Message us on
        <a :href="site.whatsappLink" target="_blank" rel="noopener">
          WhatsApp {{ site.whatsapp }}
        </a>
        — we usually answer within minutes.
      </p>
    </div>

    <div class="inline-quote__form">
      <QuoteForm compact :preselect="service" />
      <p v-if="reassurance" class="inline-quote__fineprint">{{ reassurance }}</p>
    </div>
  </div>
</template>

<style scoped>
.inline-quote {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(24px, 3.4vw, 52px);
  align-items: start;
  padding: clamp(26px, 3.4vw, 46px);
  border: 1px solid var(--c-line);
  border-radius: var(--r-xl);
  background: #fff;
  box-shadow: var(--sh-md);
}

.inline-quote__title {
  font-size: clamp(1.4rem, 2.3vw, 1.85rem);
  margin-bottom: 10px;
}

.inline-quote__lead {
  color: var(--c-muted);
  margin-bottom: 24px;
}

.inline-quote__points {
  display: grid;
  gap: 14px;
  margin-bottom: 24px;
}

.inline-quote__points li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 11px;
  align-items: start;
  font-size: 0.94rem;
  color: var(--c-700);
}

.inline-quote__points svg {
  color: var(--c-500);
  margin-top: 2px;
}

.inline-quote__alt {
  font-size: 0.92rem;
  color: var(--c-muted);
  padding-top: 20px;
  border-top: 1px solid var(--c-line);
}

.inline-quote__fineprint {
  margin-top: 14px;
  font-size: 0.84rem;
  color: var(--c-muted);
}

@media (max-width: 900px) {
  .inline-quote {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
