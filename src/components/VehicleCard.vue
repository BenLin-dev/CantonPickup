<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  vehicle: { type: Object, required: true },
})

/**
 * Photos may arrive either as a full path (`/images/vehicles/byd-han.jpg`, what
 * the generated manifest uses) or as a bare filename (`byd-han.jpg`, what the
 * hand-written fallback list uses). Normalise both so a missing slash can never
 * produce a broken image.
 */
function photoSrc(value) {
  if (!value) return ''
  if (/^(https?:)?\/\//.test(value) || value.startsWith('/')) return value
  return `/images/vehicles/${value}`
}

/** A vehicle may carry several photos once more are added to the folder. */
const gallery = computed(() => {
  const list = Array.isArray(props.vehicle.images) && props.vehicle.images.length
    ? props.vehicle.images
    : [props.vehicle.image]
  return list.filter(Boolean).map(photoSrc)
})

const active = ref(0)
const current = computed(() => gallery.value[active.value] || gallery.value[0])

/**
 * Push `select_vehicle` when the card's "Get a quote" button is clicked.
 * Stronger intent signal than the generic `cta_click` — the visitor picked a
 * specific vehicle. Google Ads can use this to optimise campaigns toward the
 * cars that actually drive leads.
 */
function trackSelectVehicle() {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'select_vehicle',
    vehicle_slug: props.vehicle.slug || '',
    vehicle_name: props.vehicle.name || '',
    vehicle_tag: props.vehicle.tag || '',
    page_path: window.location.pathname,
    page_title: document.title,
  })
}
</script>

<template>
  <article class="vehicle" v-reveal>
    <div class="vehicle__media">
      <img
        v-if="current"
        :src="current"
        :alt="`${vehicle.name} — private driver vehicle in Guangzhou and Foshan`"
        loading="lazy"
        decoding="async"
      />
      <span v-if="vehicle.tag" class="vehicle__tag">{{ vehicle.tag }}</span>
    </div>

    <div class="vehicle__body">
      <div>
        <h3 class="vehicle__name">{{ vehicle.name }}</h3>
        <p v-if="vehicle.models" class="vehicle__models">{{ vehicle.models }}</p>
      </div>

      <div class="vehicle__specs">
        <span class="vehicle__spec">
          <AppIcon name="users" :size="17" />
          {{ vehicle.passengers }}
        </span>
        <span class="vehicle__spec">
          <AppIcon name="luggage" :size="17" />
          {{ vehicle.luggage }}
        </span>
      </div>

      <p v-if="vehicle.description" class="vehicle__desc">{{ vehicle.description }}</p>

      <ul v-if="vehicle.features?.length" class="check-list">
        <li v-for="f in vehicle.features.slice(0, 3)" :key="f">
          <AppIcon name="check" :size="16" :stroke="2.6" />
          {{ f }}
        </li>
      </ul>

      <div v-if="gallery.length > 1" class="tag-row">
        <button
          v-for="(g, i) in gallery"
          :key="g"
          type="button"
          class="vehicle__thumb"
          :class="{ 'is-active': i === active }"
          :aria-label="`Show photo ${i + 1}`"
          @click="active = i"
        >
          <img :src="g" alt="" loading="lazy" decoding="async" />
        </button>
      </div>

      <RouterLink to="/contact" class="btn btn--outline btn--sm" @click="trackSelectVehicle">
        Get a quote
        <AppIcon name="arrow" :size="16" :stroke="2.2" class="btn__arrow" />
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.vehicle__thumb {
  width: 58px;
  height: 44px;
  padding: 0;
  border: 2px solid var(--c-line);
  border-radius: var(--r-xs);
  overflow: hidden;
  background: none;
  cursor: pointer;
  transition: border-color 0.2s var(--ease);
}

.vehicle__thumb.is-active {
  border-color: var(--c-500);
}

.vehicle__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
