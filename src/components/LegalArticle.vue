<script setup>
import AppIcon from './AppIcon.vue'
import { site } from '@/data/site'

/**
 * Long-form legal copy (privacy policy, terms) rendered from an array of
 * `{ title, body: [] }` blocks so the wording lives in `src/data/content.js`
 * rather than being buried in markup.
 */
defineProps({
  sections: { type: Array, required: true },
  updated: { type: String, default: '' },
})
</script>

<template>
  <section class="section">
    <div class="container container--narrow">
      <p v-if="updated" class="legal__updated" v-reveal>Last updated: {{ updated }}</p>

      <article class="legal">
        <section
          v-for="(s, i) in sections"
          :key="s.title"
          class="legal__block"
          v-reveal="{ delay: Math.min(i, 5) * 40 }"
        >
          <h2>{{ s.title }}</h2>
          <p v-for="(p, j) in s.body" :key="j">{{ p }}</p>
        </section>
      </article>

      <div class="card mt-40" v-reveal>
        <span class="icon-badge">
          <AppIcon name="chat" :size="24" :stroke="1.9" />
        </span>
        <h2 style="font-size: 1.2rem">Questions about this page?</h2>
        <p class="card__text">
          Message us and a real person will answer — usually within 30 minutes
          during the day.
        </p>
        <div class="btn-row mt-24">
          <a :href="site.waLink($route.path)" target="_blank" rel="noopener" class="btn btn--sm">
            <AppIcon name="whatsapp" :size="17" :stroke="1.8" />
            WhatsApp
          </a>
          <a :href="site.mailto" class="btn btn--outline btn--sm">
            <AppIcon name="mail" :size="17" :stroke="1.8" />
            {{ site.email }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
