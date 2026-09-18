<script setup>
import AppIcon from './AppIcon.vue'

/**
 * Page hero.
 *  variant="media"  full-bleed photo with a green scrim + white text
 *  variant="split"  light background, copy on the left, photo on the right
 */
const props = defineProps({
  variant: { type: String, default: 'media' },
  image: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  lead: { type: String, default: '' },
  meta: { type: Array, default: () => [] },
  crumbs: { type: Array, default: () => [] },
  imageAlt: { type: String, default: '' },
  priority: { type: Boolean, default: false },
})
</script>

<template>
  <section
    class="hero"
    :class="[variant === 'split' ? 'hero--split' : 'hero--media on-dark']"
  >
    <template v-if="variant === 'media'">
      <div v-if="image" class="hero__bg">
        <img
          :src="image"
          :alt="imageAlt"
          :loading="priority ? 'eager' : 'lazy'"
          :fetchpriority="priority ? 'high' : 'auto'"
          decoding="async"
        />
      </div>
      <div class="hero__scrim" />
    </template>

    <div class="container hero__inner">
      <nav v-if="crumbs.length" class="crumbs" aria-label="Breadcrumb">
        <template v-for="(c, i) in crumbs" :key="c.to || c.label">
          <RouterLink v-if="c.to" :to="c.to">{{ c.label }}</RouterLink>
          <span v-else>{{ c.label }}</span>
          <span v-if="i < crumbs.length - 1">/</span>
        </template>
      </nav>

      <div :class="variant === 'split' ? 'split' : ''">
        <div class="hero__copy">
          <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
          <h1 class="hero__title">{{ title }}</h1>
          <p v-if="lead" class="hero__lead">{{ lead }}</p>

          <div class="btn-row">
            <slot name="actions" />
          </div>

          <ul v-if="meta.length" class="hero__meta">
            <li v-for="m in meta" :key="m.text" class="hero__meta-item">
              <AppIcon :name="m.icon || 'check'" :size="18" :stroke="2.2" />
              {{ m.text }}
            </li>
          </ul>
        </div>

        <div v-if="variant === 'split' && image" class="hero__media">
          <img
            :src="image"
            :alt="imageAlt"
            :loading="priority ? 'eager' : 'lazy'"
            :fetchpriority="priority ? 'high' : 'auto'"
            decoding="async"
          />
        </div>
      </div>
    </div>
  </section>
</template>
