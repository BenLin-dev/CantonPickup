<script setup>
import { computed, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'

/**
 * Video gallery.
 *
 * Reads `/data/videos.json`, which `scripts/scan-assets.mjs` builds from the
 * files in `public/videos/` plus any external links listed in
 * `public/data/videos.manual.json`. Nothing is hard-coded here.
 *
 * The whole section removes itself when there are no videos yet, so the page
 * never shows an empty shelf. Players are only created once a visitor clicks,
 * which keeps the page fast.
 */
const props = defineProps({
  title: { type: String, default: 'Videos' },
  lead: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  limit: { type: Number, default: 0 },
})

const items = ref([])
const playing = ref('')

const shown = computed(() => (props.limit ? items.value.slice(0, props.limit) : items.value))

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL || '/'}data/videos.json`.replace('//data', '/data'), {
      cache: 'no-cache',
    })
    const json = res.ok ? await res.json() : null
    const list = Array.isArray(json) ? json : (json?.items ?? [])
    items.value = list.filter((v) => v.src || v.url)
  } catch {
    items.value = []
  }
})

/** Turn a watch/share URL into an embeddable one where we can. */
function embedUrl(item) {
  const url = item.url || ''
  if (item.provider === 'youtube' || /youtu\.?be/.test(url)) {
    const id = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/)?.[1]
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
  }
  if (item.provider === 'vimeo' || /vimeo\.com/.test(url)) {
    const id = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1]
    if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`
  }
  return url
}

function play(item) {
  playing.value = item.id || item.src || item.url
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'video_play', video_title: item.title })
  }
}
</script>

<template>
  <section v-if="shown.length" class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p v-if="lead" class="lead">{{ lead }}</p>
      </div>

      <div class="grid grid--2">
        <figure
          v-for="(v, i) in shown"
          :key="v.id || v.src || i"
          style="margin: 0"
          v-reveal="{ delay: i * 80 }"
        >
          <div class="video-card">
            <!-- playing -->
            <template v-if="playing === (v.id || v.src || v.url)">
              <video
                v-if="v.src"
                :src="v.src"
                :poster="v.poster || undefined"
                controls
                autoplay
                playsinline
              />
              <iframe
                v-else
                :src="embedUrl(v)"
                :title="v.title"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              />
            </template>

            <!-- poster -->
            <button
              v-else
              type="button"
              class="video-card__poster"
              :style="v.poster ? { backgroundImage: `url('${v.poster}')` } : {}"
              :aria-label="`Play video: ${v.title}`"
              @click="play(v)"
            >
              <span class="video-card__play">
                <AppIcon name="play" :size="26" :stroke="2" />
              </span>
            </button>
          </div>

          <figcaption v-if="v.title || v.caption" style="margin-top: 12px">
            <strong style="display: block; font-size: 0.98rem; color: var(--c-800)">
              {{ v.title }}
            </strong>
            <span v-if="v.caption" style="font-size: 0.86rem; color: var(--c-muted)">
              {{ v.caption }}
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
