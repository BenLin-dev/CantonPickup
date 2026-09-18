<script setup>
import { computed, ref } from 'vue'
import HeroSection from '@/components/HeroSection.vue'
import InlineQuote from '@/components/InlineQuote.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo, useJsonLd, useBreadcrumbs } from '@/composables/useSeo'
import { pages } from '@/data/content'
import { articlesByDate, articleCategories } from '@/data/articles'
import { site } from '@/data/site'

/**
 * Guides index.
 *
 * Category filtering happens in the component against an already-loaded list —
 * no second request, no router round-trip. Every article is also rendered in
 * the default ("All") state, so the prerendered HTML carries the full set of
 * links even before any JavaScript runs.
 *
 * Page-level SEO (`title`, `description`, `keywords`) lives in `pages.blog`
 * so the SSR pass in `src/entry-server.js` can render the same `<title>` /
 * `<meta>` block this view sets in the browser.
 */
const activeCategory = ref('All')

const filters = ['All', ...articleCategories]

const visible = computed(() =>
  activeCategory.value === 'All'
    ? articlesByDate
    : articlesByDate.filter((a) => a.category === activeCategory.value)
)

const seo = pages.blog
useSeo(seo)

useJsonLd('blog-index', {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'CantonPickup Guides',
  url: `${site.domain}/blog`,
  inLanguage: 'en',
  description: seo.description,
  blogPost: articlesByDate.map((a) => ({
    '@type': 'BlogPosting',
    headline: a.title,
    url: `${site.domain}/blog/${a.slug}`,
    datePublished: a.date,
    articleSection: a.category,
  })),
})

useBreadcrumbs('blog', [
  { name: 'Home', path: '/' },
  { name: 'Guides', path: null },
])
</script>

<template>
  <HeroSection
    variant="split"
    image="/images/hero/guangzhou-aerial.jpg"
    image-alt="Aerial view of Guangzhou and the Pearl River"
    eyebrow="Guides"
    title="Guangzhou Travel & Sourcing Guides"
    lead="Practical advice for buyers and business travellers visiting Guangzhou and the Pearl River Delta — written by the people who drive these routes every week."
    :badges="['Wholesale markets', 'Factory clusters', 'Canton Fair', 'Where to eat']"
    priority
  />

  <!-- ----------------------------------------------------------- article grid -->
  <section class="section">
    <div class="container">
      <div class="filter-row" v-reveal>
        <button
          v-for="c in filters"
          :key="c"
          type="button"
          class="pill filter-row__btn"
          :class="{ 'is-active': activeCategory === c }"
          :aria-pressed="activeCategory === c"
          @click="activeCategory = c"
        >
          {{ c }}
        </button>
      </div>

      <p class="filter-row__count" aria-live="polite">
        {{ visible.length }} {{ visible.length === 1 ? 'guide' : 'guides' }}
        <template v-if="activeCategory !== 'All'">in {{ activeCategory }}</template>
      </p>

      <div class="grid grid--3">
        <article
          v-for="(a, i) in visible"
          :key="a.slug"
          class="post"
          v-reveal="{ delay: (i % 3) * 70 }"
        >
          <RouterLink :to="`/blog/${a.slug}`" class="post__media">
            <img :src="a.image" :alt="a.imageAlt" loading="lazy" decoding="async" />
          </RouterLink>

          <div class="post__body">
            <div class="post__meta">
              <span class="pill">{{ a.category }}</span>
              <span class="post__read">
                <AppIcon name="clock" :size="14" :stroke="2.2" />
                {{ a.readTime }} min read
              </span>
            </div>

            <h3 class="post__title">
              <RouterLink :to="`/blog/${a.slug}`">{{ a.title }}</RouterLink>
            </h3>

            <p class="post__excerpt">{{ a.excerpt }}</p>

            <RouterLink :to="`/blog/${a.slug}`" class="post__more">
              Read the guide
              <AppIcon name="arrow" :size="15" :stroke="2.2" class="btn__arrow" />
            </RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- --------------------------------------------------------- inline quote -->
  <section class="section section--soft">
    <div class="container">
      <InlineQuote
        title="Planning a Trip to Guangzhou?"
        lead="Tell us your dates and what you need to see, and we will work out the driving so you do not have to."
      />
    </div>
  </section>
</template>

<style scoped>
.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 16px;
}

.filter-row__btn {
  cursor: pointer;
  border: 1px solid transparent;
  background: var(--c-50);
  color: var(--c-700);
  transition: background-color 0.18s var(--ease), color 0.18s var(--ease),
    border-color 0.18s var(--ease);
}

.filter-row__btn:hover {
  border-color: var(--c-200);
}

.filter-row__btn.is-active {
  background: var(--c-600, var(--c-500));
  color: #fff;
}

.filter-row__count {
  font-size: 0.88rem;
  color: var(--c-muted);
  margin-bottom: 30px;
}

/* ------------------------------------------------------------- post card */
.post {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--c-line);
  border-radius: var(--r-lg);
  overflow: hidden;
  transition: transform 0.24s var(--ease), box-shadow 0.24s var(--ease),
    border-color 0.24s var(--ease);
}

.post:hover {
  transform: translateY(-4px);
  border-color: var(--c-200);
  box-shadow: var(--sh-lg);
}

.post__media {
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--c-50);
}

.post__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--ease);
}

.post:hover .post__media img {
  transform: scale(1.04);
}

.post__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 22px 22px 24px;
}

.post__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.post__read {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--c-muted);
}

.post__title {
  font-size: 1.12rem;
  line-height: 1.32;
  margin-bottom: 10px;
}

.post__title a {
  color: inherit;
}

.post__excerpt {
  font-size: 0.93rem;
  color: var(--c-muted);
  margin-bottom: 18px;
}

.post__more {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--c-600, var(--c-500));
}

.post:hover .post__more svg {
  transform: translateX(3px);
}

.post__more svg {
  transition: transform 0.2s var(--ease);
}
</style>
