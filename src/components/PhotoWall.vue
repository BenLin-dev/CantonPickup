<script setup>
import { onMounted, ref } from 'vue'

/**
 * "See Us in Action" — the photo wall.
 *
 * Everything in `public/images/gallery/` appears here, in filename order, and
 * nothing else is required: no sidecar, no caption, no alt text, no separate
 * order file. `scripts/scan-assets.mjs` turns that folder into
 * `/data/gallery.json` before every build and this component only reads it —
 * the same folder-driven contract as the review wall and the video grid, so
 * adding a photo is "copy the file in, rebuild".
 *
 * Layout is a CSS *multi-column* masonry, not a grid:
 *   - Columns let every photo keep its own shape. A portrait shot of a driver
 *     holding a name sign sits next to a wide shot of an open boot, and neither
 *     is cropped to fit a shared row height.
 *   - A grid can fake that with `grid-row: span 2` markers, but those markers
 *     can only be authored per image — exactly the thing this wall is built not
 *     to ask for. Columns work it out from the picture itself.
 *
 * There are no captions, so the photos carry no information a screen reader
 * could read out: they are marked decorative (`alt=""`) and the section is
 * announced by its own heading instead.
 */
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: 'See Us in Action' },
  lead: { type: String, default: '' },
})

const items = ref([])

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL || '/'}data/gallery.json`.replace('//data', '/data'), {
      cache: 'no-cache',
    })
    const json = res.ok ? await res.json() : null
    items.value = Array.isArray(json) ? json : (json?.items ?? [])
  } catch {
    items.value = []
  }
})
</script>

<template>
  <!-- Empty folder ⇒ no section at all. An empty photo wall is worse than none. -->
  <section v-if="items.length" class="section">
    <div class="container">
      <div class="section-head section-head--center" v-reveal>
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
        <p v-if="lead" class="lead">{{ lead }}</p>
      </div>

      <div class="photo-wall" v-reveal>
        <img
          v-for="p in items"
          :key="p.image"
          class="photo-wall__shot"
          :src="p.image"
          :width="p.width"
          :height="p.height"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
 * `column-count` balances the columns for us, so the wall reads evenly whether
 * the folder holds six photos or sixty. Column height is why the manifest
 * carries the pixel size of each file: without it the browser has to lay the
 * wall out again as the images arrive, and photos visibly hop between columns.
 */
.photo-wall {
  column-count: 4;
  column-gap: clamp(12px, 1.6vw, 18px);
}

.photo-wall__shot {
  display: block;
  width: 100%;
  /* `width: 100%` + `height: auto` + the width/height attributes on the tag =
     the right shape, reserved before the bytes land. */
  height: auto;
  margin: 0 0 clamp(12px, 1.6vw, 18px);
  border-radius: var(--r-lg);
  background: var(--c-50);
  /* without this a photo gets sliced in half at a column boundary */
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.photo-wall__shot:hover {
  transform: scale(1.015);
  box-shadow: var(--sh-md);
}

@media (max-width: 1000px) {
  .photo-wall {
    column-count: 3;
  }
}

@media (max-width: 640px) {
  .photo-wall {
    column-count: 2;
    column-gap: 10px;
  }

  .photo-wall__shot {
    margin-bottom: 10px;
  }
}
</style>
