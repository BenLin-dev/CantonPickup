<script setup>
import { computed, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'

/**
 * Video gallery.
 *
 * Nothing here is hard-coded: the component reads `/data/videos.json`, which
 * `scripts/scan-assets.mjs` builds from whatever sits in `public/videos/` —
 * a local clip plus its sidecar, or a sidecar that carries a YouTube / Vimeo
 * link. One folder, one naming rule, no registry to update.
 *
 * Layout is a centred grid of portrait thumbnails. Short clips are shot
 * vertically, so a 9:16 card shows the whole frame instead of letterboxing it
 * into a wide band — and a small grid keeps the section from swallowing the
 * page the way a pair of full-width 16:9 players did.
 *
 * Every clip is rendered; there is no scroll-batching here. Portraits are cheap
 * to lay out, and a gallery that hides half its content until you scroll reads
 * as broken on a phone.
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

/** `limit` is a hard cap on how many clips appear. */
const shown = computed(() => (props.limit ? items.value.slice(0, props.limit) : items.value))

function key(item) {
  return item.id || item.src || item.url
}

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
    // Covers /watch?v=, youtu.be/, /embed/ and /shorts/ — a Short that keeps
    // its share URL plays nowhere, because youtube.com/shorts/… refuses to
    // render in a frame.
    const id = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{6,})/)?.[1]
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
  }
  if (item.provider === 'vimeo' || /vimeo\.com/.test(url)) {
    const id = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1]
    if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`
  }
  return url
}

function play(item) {
  playing.value = key(item)
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

      <div class="reel">
        <figure
          v-for="(v, i) in shown"
          :key="key(v)"
          class="reel__item"
          v-reveal="{ delay: (i % 5) * 60 }"
        >
          <div class="reel-card">
            <!-- playing -->
            <template v-if="playing === key(v)">
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
              class="reel-card__poster"
              :style="v.poster ? { backgroundImage: `url('${v.poster}')` } : {}"
              :aria-label="`Play video: ${v.title}`"
              @click="play(v)"
            >
              <span class="reel-card__play">
                <AppIcon name="play" :size="20" :stroke="2.2" />
              </span>
              <span v-if="v.title" class="reel-card__caption">{{ v.title }}</span>
            </button>
          </div>
        </figure>
      </div>
    </div>
  </section>
</template>
