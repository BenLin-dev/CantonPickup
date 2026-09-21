<script setup>
import { reactive, ref, computed } from 'vue'
import AppIcon from './AppIcon.vue'
import { site, serviceOptions } from '@/data/site'

/**
 * Quote request form.
 * Submits to Web3Forms (access key configured in `src/data/site.js`) using
 * fetch, so the visitor stays on the page. A `generate_lead` event is pushed
 * to the GTM dataLayer on success so Google Ads can register the conversion.
 */
const props = defineProps({
  compact: { type: Boolean, default: false },
  /**
   * Value to pre-select in "Service needed" — set from `?service=<slug>` on the
   * contact page so a "Book Now" button does not make the visitor choose twice.
   */
  preselect: { type: String, default: '' },
})

const form = reactive({
  name: '',
  email: '',
  phone: '',
  service: serviceOptions.includes(props.preselect) ? props.preselect : '',
  date: '',
  flight: '',
  pickup: '',
  dropoff: '',
  passengers: '',
  message: '',
  botcheck: '',
})

const state = ref('idle') // idle | sending | ok | error
const errorMsg = ref('')

const today = computed(() => new Date().toISOString().slice(0, 10))

/**
 * SHA-256 of a normalised string, hex-encoded. Returns an empty string when
 * the input is empty so the dataLayer payload never contains `null` keys.
 * Uses `crypto.subtle` (browser-only); falls back to a plain string when run
 * in a non-secure context where SubtleCrypto is unavailable (SSR, http://).
 */
async function sha256Hex(text) {
  const v = String(text || '').trim().toLowerCase()
  if (!v) return ''
  if (typeof crypto === 'undefined' || !crypto.subtle) return ''
  const bytes = new TextEncoder().encode(v)
  const buf = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Strip everything except digits and a leading `+`. Google Enhanced
 * Conversions wants the phone in E.164 form (digits + optional leading `+`),
 * so this is the safe minimum normalisation.
 */
function normalizePhone(raw) {
  const trimmed = String(raw || '').trim()
  const hasPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/[^0-9]/g, '')
  return (hasPlus ? '+' : '') + digits
}

async function submit() {
  if (state.value === 'sending') return
  state.value = 'sending'
  errorMsg.value = ''

  const payload = {
    access_key: site.web3formsAccessKey,
    subject: `New quote request — ${form.service || 'General enquiry'} — ${form.name || 'Website visitor'}`,
    from_name: `${site.name} website`,
    botcheck: form.botcheck,
    name: form.name,
    email: form.email,
    phone: form.phone,
    service: form.service,
    travel_date: form.date,
    flight_number: form.flight,
    pickup_location: form.pickup,
    dropoff_location: form.dropoff,
    passengers: form.passengers,
    message: form.message,
    page: typeof window !== 'undefined' ? window.location.href : '',
  }

  try {
    const res = await fetch(site.web3formsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json().catch(() => ({}))

    if (!res.ok || json.success === false) {
      throw new Error(json.message || 'The form service rejected the request.')
    }

    state.value = 'ok'
    if (typeof window !== 'undefined') {
      // Enhanced Conversions: hash email and phone with SHA-256 so Google Ads
      // can match the lead back to a click even with cookies stripped. The
      // hash is computed locally — the raw values never leave the browser.
      const [sha256_email, sha256_phone] = await Promise.all([
        sha256Hex(form.email),
        sha256Hex(normalizePhone(form.phone)),
      ])

      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'generate_lead',
        form_name: 'quote_request',
        service: form.service || 'unspecified',
        value: 1,
        currency: 'USD',
        page_path: window.location.pathname,
        page_title: document.title,
        // `user_data` is what Google's Enhanced Conversions tag looks for;
        // both keys must be SHA-256 hex (lowercase, no leading "0x"). Empty
        // strings are dropped downstream by GTM's hash check.
        user_data: {
          ...(sha256_email ? { sha256_email } : {}),
          ...(sha256_phone ? { sha256_phone } : {}),
        },
      })

      // Direct gtag() call — the Event snippet you get from Google Ads
      // when you pick "Install with code" while creating the
      // "Submit lead form" conversion action (Label `sOmeCK_G0P8cEJWSz-RE`,
      // conversion ID `AW-18464622869`). This bypasses GTM and goes
      // straight to Google Ads, which is useful as a fallback when GTM is
      // blocked by an ad blocker. NOTE: do NOT also fire an Ads
      // Conversion Tag inside the GTM container on `generate_lead` —
      // every submission would be counted twice. See
      // `google-ads-onboarding.md` §10.5.
      //
      // Currency is `CNY` — do NOT "fix" this to USD (v2.9.4, 2026-09-21).
      //
      // An earlier revision of this file sent `USD` on the theory that the
      // account was USD-denominated. That was wrong. The Ads account
      // currency is CNY, confirmed two independent ways:
      //   1. The 出價 (bidding) screen prefixes the max-CPC input with `¥`.
      //      Bids are ALWAYS denominated in account currency.
      //   2. Google's own generated Event snippet for this very conversion
      //      action came back with `currency: 'CNY'`.
      //
      // Google Ads reports conversion values in the ACCOUNT currency, so
      // the tag must send the same unit. Google will FX-convert a
      // mismatched currency, but then the reported value drifts with the
      // daily exchange rate — pure noise for what is just a proxy value.
      //
      // NOTE: the GA4 `dataLayer.push` above deliberately keeps
      // `currency: 'USD'`. GA4 is a separate product and the business
      // actually collects in USD (PayPal / cards), so revenue-style
      // reporting there should stay USD. Only the Ads event uses CNY.
      //
      // `user_data` reuses the SHA-256 hashes above so Enhanced
      // Conversions keeps working — without it, the lead is reported
      // but cannot be matched back to the click that drove it.
      const sendTo = 'AW-18464622869/sOmeCK_G0P8cEJWSz-RE'
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          send_to: sendTo,
          value: 1.0,
          currency: 'CNY', // Ads account currency — see note above
          // transaction_id de-duplicates accidental double-fires within
          // the same Ads attribution window (refreshing the success page,
          // SPA route changes, etc.).
          transaction_id:
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          user_data: {
            ...(sha256_email ? { sha256_email } : {}),
            ...(sha256_phone ? { sha256_phone } : {}),
          },
        })
      }
    }
  } catch (err) {
    state.value = 'error'
    errorMsg.value =
      'Something went wrong sending your request. Please message us on WhatsApp or email instead — we reply quickly.'
    if (import.meta.env?.DEV) console.error('[quote form]', err)
  }
}

function reset() {
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    flight: '',
    pickup: '',
    dropoff: '',
    passengers: '',
    message: '',
    botcheck: '',
  })
  state.value = 'idle'
}
</script>

<template>
  <form class="quote-form" novalidate @submit.prevent="submit">
    <!-- honeypot: hidden from humans, catches bots -->
    <input
      v-model="form.botcheck"
      type="checkbox"
      name="botcheck"
      tabindex="-1"
      autocomplete="off"
      class="visually-hidden"
      aria-hidden="true"
    />

    <template v-if="state !== 'ok'">
      <div class="form-grid">
        <div class="field">
          <label for="q-name">Full name <span class="req">*</span></label>
          <input
            id="q-name"
            v-model.trim="form.name"
            name="name"
            type="text"
            autocomplete="name"
            placeholder="e.g. James Wilson"
            required
          />
        </div>

        <div class="field">
          <label for="q-email">Email address <span class="req">*</span></label>
          <input
            id="q-email"
            v-model.trim="form.email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="you@company.com"
            required
          />
        </div>

        <div class="field">
          <label for="q-phone">Phone / WhatsApp</label>
          <input
            id="q-phone"
            v-model.trim="form.phone"
            name="phone"
            type="tel"
            autocomplete="tel"
            placeholder="+44 7700 900000"
          />
        </div>

        <div class="field">
          <label for="q-service">Service needed</label>
          <select id="q-service" v-model="form.service" name="service">
            <option value="">Please choose…</option>
            <option v-for="s in serviceOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>

        <div class="field">
          <label for="q-date">Travel date</label>
          <input
            id="q-date"
            v-model="form.date"
            name="travel_date"
            type="date"
            :min="today"
          />
        </div>

        <div class="field">
          <label for="q-flight">Flight number <span class="opt">(airport pickups)</span></label>
          <input
            id="q-flight"
            v-model.trim="form.flight"
            name="flight_number"
            type="text"
            placeholder="e.g. CZ 304 / BA 0881"
            autocomplete="off"
          />
          <p class="field__hint">We track your flight, so we are there even if it lands late.</p>
        </div>

        <div class="field">
          <label for="q-pax">Number of passengers</label>
          <select id="q-pax" v-model="form.passengers" name="passengers">
            <option value="">Please choose…</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7+</option>
          </select>
        </div>

        <template v-if="!compact">
          <div class="field">
            <label for="q-pickup">Pickup location</label>
            <input
              id="q-pickup"
              v-model.trim="form.pickup"
              name="pickup_location"
              type="text"
              placeholder="e.g. Baiyun Airport (CAN), Terminal 2"
            />
          </div>

          <div class="field">
            <label for="q-dropoff">Drop-off location</label>
            <input
              id="q-dropoff"
              v-model.trim="form.dropoff"
              name="dropoff_location"
              type="text"
              placeholder="e.g. Foshan, Nanhai District"
            />
          </div>
        </template>

        <div class="field field--full">
          <label for="q-message">
            Trip details <span class="req">*</span>
          </label>
          <textarea
            id="q-message"
            v-model.trim="form.message"
            name="message"
            required
            placeholder="Flight number, arrival time, luggage, child seats, number of factory visits — anything that helps us quote accurately."
          />
        </div>
      </div>

      <div
        v-if="state === 'error'"
        class="form-status form-status--err"
        role="alert"
        style="margin-top: 18px"
      >
        <AppIcon name="close" :size="18" :stroke="2.4" />
        <span>{{ errorMsg }}</span>
      </div>

      <div
        style="
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          margin-top: 22px;
        "
      >
        <button class="btn btn--lg" type="submit" :disabled="state === 'sending'">
          <template v-if="state === 'sending'">
            <span class="spinner" style="width: 18px; height: 18px; border-width: 2px" />
            Sending…
          </template>
          <template v-else>
            Send my request
            <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
          </template>
        </button>
        <span style="font-size: 0.84rem; color: var(--c-muted)">
          No payment now — we reply with a fixed price.
        </span>
      </div>
    </template>

    <!-- success ---------------------------------------------------------- -->
    <div v-else class="form-status form-status--ok" role="status">
      <AppIcon name="check" :size="20" :stroke="2.6" />
      <div>
        <strong style="display: block; margin-bottom: 4px">
          Thank you — your request has been sent.
        </strong>
        <span>
          We usually reply within 30 minutes. If it is urgent, message us on
          <a :href="site.whatsappLink" target="_blank" rel="noopener">WhatsApp {{ site.whatsapp }}</a>.
        </span>
        <div style="margin-top: 14px">
          <button class="btn btn--outline btn--sm" type="button" @click="reset">
            Send another request
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
.quote-form {
  width: 100%;
}
</style>
