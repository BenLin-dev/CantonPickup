<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'
import AppIcon from './AppIcon.vue'
import { site } from '@/data/site'

/**
 * Review wall.
 *
 * Nothing here is hard-coded: the component reads `/data/reviews.json`, which
 * `scripts/scan-assets.mjs` regenerates from whatever images and videos sit in
 * `public/images/reviews/` and `public/videos/`.
 *
 * Reviews are revealed in batches as the visitor scrolls (IntersectionObserver),
 * so the page stays fast no matter how many reviews are added later.
 */
const props = defineProps({
  batch: { type: Number, default: 6 },
  /** shows the "still collecting reviews" card when nothing has been added yet */
  showEmptyState: { type: Boolean, default: true },
})

const items = ref([])
const loading = ref(true)
const shown = ref(0)
const sentinel = ref(null)
const lightbox = ref(null)

let observer = null

const visible = computed(() => items.value.slice(0, shown.value))
const hasMore = computed(() => shown.value < items.value.length)

function initials(name) {
  if (!name) return '★'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function openLightbox(item) {
  if (!item.image) return
  lightbox.value = item
  if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox.value = null
  if (typeof document !== 'undefined') document.body.style.overflow = ''
}

function onKey(e) {
  if (e.key === 'Escape') closeLightbox()
}

function loadMore() {
  if (!hasMore.value) return
  shown.value = Math.min(shown.value + props.batch, items.value.length)
}

function attachObserver() {
  if (typeof IntersectionObserver === 'undefined' || !sentinel.value) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        window.setTimeout(loadMore, 220)
      }
    },
    { rootMargin: '320px 0px' }
  )
  observer.observe(sentinel.value)
}

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL || '/'}data/reviews.json`.replace('//data', '/data'), {
      cache: 'no-cache',
    })
    const json = res.ok ? await res.json() : null
    const list = Array.isArray(json) ? json : (json?.items ?? [])
    items.value = list
  } catch {
    items.value = []
  } finally {
    loading.value = false
    shown.value = Math.min(props.batch, items.value.length)
    await nextTick()
    attachObserver()
  }

  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('keydown', onKey)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

watch(hasMore, async (still) => {
  if (!still) {
    observer?.disconnect()
  }
})
</script>

<template>
  <div>
    <!-- reviews --------------------------------------------------------- -->
    <div v-if="items.length" class="wall">
      <figure
        v-for="(r, i) in visible"
        :key="r.id || r.image || i"
        class="review"
        v-reveal="{ delay: (i % batch) * 70 }"
      >
        <div
          v-if="r.image"
          class="review__shot"
          role="button"
          tabindex="0"
          :aria-label="`Open review photo from ${r.name || 'a guest'}`"
          @click="openLightbox(r)"
          @keydown.enter.prevent="openLightbox(r)"
          @keydown.space.prevent="openLightbox(r)"
        >
          <img
            :src="r.image"
            :alt="r.alt || `Review from ${r.name || 'a CantonPickup guest'}`"
            loading="lazy"
            decoding="async"
          />
          <span class="review__zoom" aria-hidden="true">
            <AppIcon name="zoom" :size="18" :stroke="2.2" />
          </span>
        </div>

        <figcaption class="review__body">
          <div v-if="r.rating" class="review__stars" :aria-label="`${r.rating} out of 5 stars`">
            <AppIcon v-for="n in Math.round(r.rating)" :key="n" name="star" :size="15" :stroke="0" />
          </div>

          <blockquote v-if="r.text" class="review__text">“{{ r.text }}”</blockquote>

          <div class="review__who">
            <span class="review__avatar">{{ initials(r.name) }}</span>
            <span>
              <span class="review__name">{{ r.name || 'Verified guest' }}</span>
              <span class="review__meta">
                {{ [r.service, r.date].filter(Boolean).join(' · ') || 'Guangzhou / Foshan' }}
              </span>
            </span>
          </div>
        </figcaption>
      </figure>
    </div>

    <!-- empty state ------------------------------------------------------ -->
    <div v-else-if="!loading && showEmptyState" class="wall">
      <div v-for="n in 3" :key="n" class="review review--text">
        <div class="review__body">
          <span class="review__stars" style="color: var(--c-300)">
            <AppIcon name="quote" :size="26" :stroke="0" />
          </span>
          <p class="review__text">
            {{
              n === 1
                ? 'Guest photos and comments will appear here as our travellers share their trips.'
                : n === 2
                  ? 'Every review is written by a real visitor we drove in Guangzhou or Foshan.'
                  : 'Book a trip, and your review could be the first one on this wall.'
            }}
          </p>
          <div class="review__who">
            <span class="review__avatar">
              <AppIcon name="user" :size="17" />
            </span>
            <span>
              <span class="review__name">Awaiting your review</span>
              <span class="review__meta">Guangzhou / Foshan</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- scroll loader ---------------------------------------------------- -->
    <div ref="sentinel" class="load-more" aria-live="polite">
      <template v-if="hasMore">
        <span class="spinner" aria-hidden="true" />
        <button class="btn btn--outline btn--sm" type="button" @click="loadMore">
          Load more reviews
        </button>
      </template>
      <p v-else-if="items.length" class="table-note" style="margin: 0">
        You have seen all {{ items.length }} reviews.
        <a :href="site.whatsappLink" target="_blank" rel="noopener">Travelled with us? Send us yours.</a>
      </p>
    </div>

    <!-- lightbox --------------------------------------------------------- -->
    <div
      v-if="lightbox"
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="`Review photo from ${lightbox.name || 'a guest'}`"
      @click.self="closeLightbox"
    >
      <button class="lightbox__close" type="button" aria-label="Close" @click="closeLightbox">
        <AppIcon name="close" :size="20" :stroke="2.4" />
      </button>
      <figure style="margin: 0; text-align: center">
        <img :src="lightbox.image" :alt="lightbox.alt || 'Review photo'" />
        <figcaption
          v-if="lightbox.name"
          style="color: rgba(255, 255, 255, 0.86); margin-top: 14px; font-size: 0.92rem"
        >
          {{ lightbox.name }}<template v-if="lightbox.service"> · {{ lightbox.service }}</template>
        </figcaption>
      </figure>
    </div>
  </div>
</template>

<style scoped>
.review__zoom {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  border-radius: var(--r-full);
  background: rgba(255, 255, 255, 0.94);
  color: var(--c-700);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--sh-sm);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.22s var(--ease), transform 0.22s var(--ease);
}

.review__shot:hover .review__zoom,
.review__shot:focus-visible .review__zoom {
  opacity: 1;
  transform: none;
}

.review__text {
  white-space: pre-line;
}
</style>
