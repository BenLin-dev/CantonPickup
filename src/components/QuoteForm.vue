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
})

const form = reactive({
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

const state = ref('idle') // idle | sending | ok | error
const errorMsg = ref('')

const today = computed(() => new Date().toISOString().slice(0, 10))

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
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'generate_lead',
        form_name: 'quote_request',
        service: form.service || 'unspecified',
        value: 1,
        currency: 'USD',
      })
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
          <input id="q-date" v-model="form.date" name="travel_date" type="date" :min="today" />
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
