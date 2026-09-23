<script setup>
import { useRoute } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import InlineQuote from '@/components/InlineQuote.vue'
import CtaBand from '@/components/CtaBand.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSeo, useJsonLd, useBreadcrumbs } from '@/composables/useSeo'
import { articleBySlug, relatedArticles } from '@/data/articles'
import { site } from '@/data/site'

/**
 * A single guide.
 *
 * The body comes straight out of `src/data/articles.js` as blocks, so the
 * markup here stays dumb: heading, paragraphs, bullet list. No markdown parser
 * to keep in step with the content.
 */
const route = useRoute()

const article = articleBySlug(String(route.params.slug || ''))
const related = article ? relatedArticles(article, 3) : []

useSeo({
  path: route.path,
  // `seoTitle` (when present) is the shortened variant: `<title>` may not exceed
  // 60 characters, while the on-page `<h1>` above stays the fuller headline.
  title: article ? `${article.seoTitle || article.title} | CantonPickup` : 'Guides | CantonPickup',
  description: article?.excerpt || '',
  keywords: [
    article?.category?.toLowerCase() || 'guangzhou guide',
    'guangzhou private driver',
    'china sourcing trip',
  ].join(', '),
})

useJsonLd(
  `article-${article?.slug || 'unknown'}`,
  article
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        image: `${site.domain}${article.image}`,
        datePublished: article.date,
        dateModified: article.date,
        articleSection: article.category,
        inLanguage: 'en',
        author: { '@type': 'Organization', name: site.name, url: site.domain },
        publisher: { '@type': 'Organization', name: site.name, url: site.domain },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.domain}${route.path}` },
      }
    : {}
)

if (article) {
  useBreadcrumbs(`article-${article.slug}`, [
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/blog' },
    { name: article.title, path: null },
  ])
}
</script>

<template>
  <template v-if="article">
    <HeroSection
      variant="media"
      :image="article.image"
      :image-alt="article.imageAlt"
      :eyebrow="article.category"
      :title="article.title"
      priority
      :crumbs="[
        { label: 'Home', to: '/' },
        { label: 'Guides', to: '/blog' },
        { label: article.category },
      ]"
    >
      <template #actions>
        <span class="post-byline">
          <AppIcon name="clock" :size="16" :stroke="2.2" />
          {{ article.readTime }} min read
          <span class="post-byline__sep">·</span>
          {{ article.dateLabel }}
        </span>
      </template>
    </HeroSection>

    <!-- -------------------------------------------------------- article body -->
    <section class="section">
      <div class="container container--narrow">
        <p class="article__lede">{{ article.lede }}</p>

        <div class="article">
          <section
            v-for="(block, i) in article.sections"
            :key="block.heading"
            class="article__block"
          >
            <h2 :id="`s-${i + 1}`">{{ block.heading }}</h2>

            <p v-for="p in block.body || []" :key="p">{{ p }}</p>

            <ul v-if="block.list" class="check-list article__list">
              <li v-for="item in block.list" :key="item">
                <AppIcon name="check" :size="16" :stroke="2.7" />
                {{ item }}
              </li>
            </ul>
          </section>
        </div>

        <div class="article__foot">
          <p>
            Planning the trip? We drive the routes in this guide every week —
            <RouterLink :to="article.related.to">{{ article.related.label.toLowerCase() }}</RouterLink>
            is where most readers start.
          </p>
        </div>
      </div>
    </section>

    <!-- --------------------------------------------------------- inline quote -->
    <section class="section section--soft">
      <div class="container">
        <InlineQuote
          title="Need a Driver for This Trip?"
          lead="Send us your dates, your addresses and what you need to see. We will confirm a fixed price per vehicle."
        />
      </div>
    </section>

    <!-- ------------------------------------------------------ read next -->
    <section class="section">
      <div class="container">
        <div class="section-head section-head--center" v-reveal>
          <p class="eyebrow">Keep reading</p>
          <h2>More Guides</h2>
        </div>

        <div class="grid grid--3">
          <RouterLink
            v-for="a in related"
            :key="a.slug"
            :to="`/blog/${a.slug}`"
            class="next-card"
          >
            <span class="pill">{{ a.category }}</span>
            <strong>{{ a.title }}</strong>
            <span class="next-card__read">{{ a.readTime }} min read</span>
          </RouterLink>
        </div>

        <div class="btn-row mt-32" style="justify-content: center">
          <RouterLink to="/blog" class="btn btn--outline">
            All guides
            <AppIcon name="arrow" :size="17" :stroke="2.2" class="btn__arrow" />
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <CtaBand
          title="Ready to Book Your Driver?"
          text="Fixed prices per vehicle, an English-speaking driver and free cancellation up to 48 hours before."
          image="/images/hero/highway-dusk.jpg"
        />
      </div>
    </section>
  </template>

  <section v-else class="section">
    <div class="container container--narrow" style="text-align: center">
      <h1>Guide not found</h1>
      <p class="lead">That guide does not exist — it may have been renamed. Everything we have written is listed on the guides page.</p>
      <div class="btn-row" style="justify-content: center">
        <RouterLink to="/blog" class="btn">All guides</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.post-byline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.post-byline__sep {
  opacity: 0.6;
}

.article__lede {
  font-size: clamp(1.08rem, 1.7vw, 1.28rem);
  line-height: 1.62;
  color: var(--c-800);
  font-weight: 500;
  padding-bottom: 28px;
  margin-bottom: 36px;
  border-bottom: 1px solid var(--c-line);
}

.article {
  display: grid;
  gap: 40px;
}

.article__block h2 {
  font-size: clamp(1.22rem, 2vw, 1.5rem);
  margin-bottom: 14px;
}

.article__block p {
  color: var(--c-ink-2);
  line-height: 1.72;
}

.article__block p + p {
  margin-top: 14px;
}

.article__list {
  margin-top: 18px;
}

.article__foot {
  margin-top: 46px;
  padding: 22px 24px;
  border-radius: var(--r-lg);
  background: var(--c-50);
  border: 1px solid var(--c-100);
}

.article__foot p {
  margin: 0;
  color: var(--c-ink-2);
}

/* ---------------------------------------------------------- read next */
.next-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px;
  border: 1px solid var(--c-line);
  border-radius: var(--r-lg);
  background: #fff;
  color: inherit;
  transition: transform 0.22s var(--ease), border-color 0.22s var(--ease),
    box-shadow 0.22s var(--ease);
}

.next-card:hover {
  transform: translateY(-3px);
  border-color: var(--c-200);
  box-shadow: var(--sh-md);
}

.next-card .pill {
  align-self: flex-start;
}

.next-card strong {
  font-size: 1.02rem;
  line-height: 1.38;
  color: var(--c-800);
}

.next-card__read {
  margin-top: auto;
  font-size: 0.82rem;
  color: var(--c-muted);
  font-weight: 600;
}
</style>
