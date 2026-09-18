<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { site } from '@/data/site'

/**
 * Review carousel.
 *
 * Nothing here is hard-coded: the component reads `/data/reviews.json`, which
 * `scripts/scan-assets.mjs` regenerates from whatever images sit in
 * `public/images/reviews/`.
 *
 * The track is a native scroll container with CSS scroll-snap, so how many
 * cards fit on a screen is decided by CSS (4 on desktop, 2 on tablet, 1 on a
 * phone) rather than by a JS breakpoint. The arrows only move the scroll
 * position by one page, and the dots are counted from the measured slide
 * width — that keeps the markup honest at every viewport size.
 */
defineProps({
  /** shows the "still collecting reviews" placeholder when nothing has been added yet */
  showEmptyState: { type: Boolean, default: true },
})

const items = ref([])
const loading = ref(true)
const lightbox = ref(null)

const track = ref(null)
const page = ref(0)
const pages = ref(1)

/** Width of one slide plus the gap — a single step of the carousel. */
let step = 0
let perView = 1
let frame = 0

const isEmpty = computed(() => !loading.value && !items.value.length)

function initials(name) {
  if (!name) return '★'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

/* --------------------------------------------------------------- carousel */

function measure() {
  const el = track.value
  if (!el) return

  const slide = el.querySelector('.carousel__slide')
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0
  step = slide ? slide.getBoundingClientRect().width + gap : el.clientWidth
  perView = step > 0 ? Math.max(1, Math.round((el.clientWidth + gap) / step)) : 1
  pages.value = Math.max(1, Math.ceil(items.value.length / perView))
  readPosition()
}

function readPosition() {
  const el = track.value
  if (!el || !step) return
  const raw = Math.round(el.scrollLeft / step / perView)
  page.value = Math.max(0, Math.min(pages.value - 1, raw))
}

function goTo(index) {
  const el = track.value
  if (!el || !step) return
  const target = Math.max(0, Math.min(pages.value - 1, index))
  el.scrollTo({ left: target * perView * step, behavior: 'smooth' })
}

function prev() {
  goTo(page.value - 1)
}

function next() {
  goTo(page.value + 1)
}

function onScroll() {
  // one read per frame — scroll fires far more often than the UI needs
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    readPosition()
  })
}

function onTrackKey(e) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  }
}

/* --------------------------------------------------------------- lightbox */

function openLightbox(item) {
  if (!item.image) return
  lightbox.value = item
  if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox.value = null
  if (typeof document !== 'undefined') document.body.style.overflow = ''
}

function onEsc(e) {
  if (e.key === 'Escape') closeLightbox()
}

/* ---------------------------------------------------------------- lifecycle */

let observer = null

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
    await nextTick()
    // Wait a frame so the freshly rendered slides have their final width
    // before we divide by it.
    requestAnimationFrame(measure)
  }

  // The slide width changes with the breakpoint, so re-measure on resize
  // rather than listening for a specific pixel value.
  if (typeof ResizeObserver !== 'undefined' && track.value) {
    observer = new ResizeObserver(measure)
    observer.observe(track.value)
  } else {
    window.addEventListener('resize', measure, { passive: true })
  }

  window.addEventListener('keydown', onEsc)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (frame) cancelAnimationFrame(frame)
  window.removeEventListener('resize', measure)
  window.removeEventListener('keydown', onEsc)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})
</script>

<template>
  <div>
    <!-- reviews --------------------------------------------------------- -->
    <div v-if="items.length" class="carousel">
      <div
        ref="track"
        class="carousel__track"
        role="group"
        aria-roledescription="carousel"
        aria-label="Guest reviews"
        tabindex="0"
        @scroll.passive="onScroll"
        @keydown="onTrackKey"
      >
        <figure
          v-for="(r, i) in items"
          :key="r.id || r.image || i"
          class="review carousel__slide"
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

      <!-- arrows + dots -->
      <div v-if="pages > 1" class="carousel__nav">
        <button
          class="carousel__arrow carousel__arrow--prev"
          type="button"
          :disabled="page === 0"
          aria-label="Previous reviews"
          @click="prev"
        >
          <AppIcon name="chevron" :size="20" :stroke="2.4" />
        </button>

        <div class="carousel__dots">
          <button
            v-for="n in pages"
            :key="n"
            class="carousel__dot"
            :class="{ 'is-active': page === n - 1 }"
            type="button"
            :aria-label="`Go to review page ${n}`"
            :aria-current="page === n - 1 ? 'true' : undefined"
            @click="goTo(n - 1)"
          />
        </div>

        <button
          class="carousel__arrow carousel__arrow--next"
          type="button"
          :disabled="page >= pages - 1"
          aria-label="Next reviews"
          @click="next"
        >
          <AppIcon name="chevron" :size="20" :stroke="2.4" />
        </button>
      </div>

      <p class="table-note" style="text-align: center">
        {{ items.length }} reviews from guests we have driven.
        <a :href="site.whatsappLink" target="_blank" rel="noopener">Travelled with us? Send us yours.</a>
      </p>
    </div>

    <!-- empty state ------------------------------------------------------ -->
    <div v-else-if="isEmpty && showEmptyState" class="wall">
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

/* ------------------------------------------------------------- carousel */
.carousel__track {
  --car-gap: clamp(16px, 2.2vw, 24px);

  display: flex;
  gap: var(--car-gap);
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  /* vertical padding only: horizontal padding would shrink the content box
     and throw off the "four slides plus three gaps" arithmetic below */
  padding: 6px 0 12px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel__track::-webkit-scrollbar {
  display: none;
}

.carousel__track:focus-visible {
  outline: 2px solid var(--c-400);
  outline-offset: 4px;
  border-radius: var(--r-lg);
}

.carousel__slide {
  flex: 0 0 calc((100% - 3 * var(--car-gap)) / 4);
  scroll-snap-align: start;
}

@media (max-width: 1099px) {
  .carousel__slide {
    flex: 0 0 calc((100% - var(--car-gap)) / 2);
  }
}

@media (max-width: 699px) {
  .carousel__slide {
    flex: 0 0 100%;
  }
}

.carousel__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 22px;
}

.carousel__arrow {
  width: 46px;
  height: 46px;
  flex: none;
  border-radius: var(--r-full);
  border: 1.5px solid var(--c-line);
  background: #fff;
  color: var(--c-700);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s var(--ease), border-color 0.2s var(--ease),
    color 0.2s var(--ease), transform 0.18s var(--ease);
}

.carousel__arrow:hover:not(:disabled) {
  background: var(--c-500);
  border-color: var(--c-500);
  color: #fff;
  transform: translateY(-2px);
}

.carousel__arrow:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

/* the shared chevron points down — rotate it into place */
.carousel__arrow--prev svg {
  transform: rotate(90deg);
}

.carousel__arrow--next svg {
  transform: rotate(-90deg);
}

.carousel__dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.carousel__dot {
  width: 9px;
  height: 9px;
  padding: 0;
  border: 0;
  border-radius: var(--r-full);
  background: var(--c-200);
  cursor: pointer;
  transition: background-color 0.2s var(--ease), width 0.24s var(--ease);
}

.carousel__dot:hover {
  background: var(--c-400);
}

.carousel__dot.is-active {
  width: 26px;
  background: var(--c-500);
}

@media (max-width: 620px) {
  .carousel__arrow {
    width: 42px;
    height: 42px;
  }
}
</style>
