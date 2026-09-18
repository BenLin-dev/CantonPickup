<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { nav, site } from '@/data/site'
import AppIcon from './AppIcon.vue'

const route = useRoute()
const stuck = ref(false)
const open = ref(false)

function onScroll() {
  stuck.value = window.scrollY > 8
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

watch(
  () => route.fullPath,
  () => {
    open.value = false
  }
)

watch(open, (v) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = v ? 'hidden' : ''
})

function isActive(item) {
  if (item.to === '/') return route.path === '/'
  if (item.children) return item.children.some((c) => route.path === c.to)
  return route.path === item.to
}
</script>

<template>
  <header class="header" :class="{ 'is-stuck': stuck }">
    <div class="container header__inner">
      <RouterLink to="/" class="logo" aria-label="CantonPickup home">
        <svg class="logo__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <rect width="40" height="40" rx="11" fill="#0b3d7c" />
          <path
            d="M11 25.5h18M14.5 25.5v-6.2a1.6 1.6 0 0 1 .5-1.2l2.3-2.1a1.6 1.6 0 0 1 1.1-.4h5.2a1.6 1.6 0 0 1 1.1.4l2.3 2.1a1.6 1.6 0 0 1 .5 1.2v6.2"
            stroke="#fff"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle cx="16.6" cy="26.6" r="1.9" fill="#8cc7e8" />
          <circle cx="23.4" cy="26.6" r="1.9" fill="#8cc7e8" />
        </svg>
        <span>Canton<b>Pickup</b></span>
      </RouterLink>

      <nav class="nav" aria-label="Main navigation">
        <div
          v-for="item in nav"
          :key="item.label"
          class="nav__item"
        >
          <RouterLink
            :to="item.to"
            class="nav__link"
            :class="{ 'is-active': isActive(item) }"
          >
            {{ item.label }}
            <AppIcon v-if="item.children" name="chevron" :size="15" :stroke="2.4" />
          </RouterLink>

          <div v-if="item.children" class="nav__drop">
            <RouterLink v-for="child in item.children" :key="child.to" :to="child.to">
              <strong>{{ child.label }}</strong>
              <span>{{ child.desc }}</span>
            </RouterLink>
          </div>
        </div>
      </nav>

      <div class="header__actions">
        <span class="lang">
          <AppIcon name="globe" :size="15" :stroke="2" />
          English
          <AppIcon name="chevron" :size="13" :stroke="2.4" />
        </span>
        <RouterLink to="/contact" class="btn btn--sm">
          Get a Quote
          <AppIcon name="arrow" :size="16" :stroke="2.2" class="btn__arrow" />
        </RouterLink>
        <button
          class="burger"
          type="button"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          aria-label="Open menu"
          @click="open = true"
        >
          <AppIcon name="menu" :size="22" />
        </button>
      </div>
    </div>

    <!-- Mobile drawer, teleported to <body>.
         The header sets `backdrop-filter`, and that creates a *containing
         block*: a `position: fixed` descendant gets sized to the header's
         own box instead of the viewport, so the drawer silently collapsed
         to the height of the header. Teleporting also lifts it out of the
         header's stacking context (`z-index: 60`), which was trapping the
         drawer's `z-index: 90`. -->
    <Teleport to="body">
    <div
      id="mobile-menu"
      class="mobile-menu"
      :class="{ 'is-open': open }"
      @click.self="open = false"
    >
      <div class="mobile-menu__bar">
        <RouterLink to="/" class="logo" @click="open = false">
          <svg class="logo__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect width="40" height="40" rx="11" fill="#0b3d7c" />
            <path
              d="M11 25.5h18M14.5 25.5v-6.2a1.6 1.6 0 0 1 .5-1.2l2.3-2.1a1.6 1.6 0 0 1 1.1-.4h5.2a1.6 1.6 0 0 1 1.1.4l2.3 2.1a1.6 1.6 0 0 1 .5 1.2v6.2"
              stroke="#fff"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="16.6" cy="26.6" r="1.9" fill="#8cc7e8" />
            <circle cx="23.4" cy="26.6" r="1.9" fill="#8cc7e8" />
          </svg>
          <span>Canton<b>Pickup</b></span>
        </RouterLink>
        <button class="close-btn" type="button" aria-label="Close menu" @click="open = false">
          <AppIcon name="close" :size="20" :stroke="2.2" />
        </button>
      </div>

      <div class="mobile-menu__body">
        <div class="mobile-menu__group">
          <RouterLink to="/" class="mobile-menu__link">
            Home
            <AppIcon name="arrow" :size="17" :stroke="2" />
          </RouterLink>
        </div>

        <div class="mobile-menu__group">
          <div class="mobile-menu__link">Services</div>
          <div class="mobile-menu__sub">
            <RouterLink
              v-for="child in nav[1].children"
              :key="child.to"
              :to="child.to"
            >
              {{ child.label }}
            </RouterLink>
          </div>
        </div>

        <div
          v-for="item in nav.slice(2)"
          :key="item.label"
          class="mobile-menu__group"
        >
          <RouterLink :to="item.to" class="mobile-menu__link">
            {{ item.label }}
            <AppIcon name="arrow" :size="17" :stroke="2" />
          </RouterLink>
        </div>

        <RouterLink to="/contact" class="btn btn--block btn--lg mt-24">
          Get a Quote
          <AppIcon name="arrow" :size="18" :stroke="2.2" class="btn__arrow" />
        </RouterLink>

        <div class="stack mt-24" style="--gap: 12px">
          <a class="btn btn--outline btn--block" :href="site.whatsappLink" target="_blank" rel="noopener">
            <AppIcon name="whatsapp" :size="18" />
            WhatsApp {{ site.whatsapp }}
          </a>
          <a class="btn btn--outline btn--block" :href="site.mailto">
            <AppIcon name="mail" :size="18" />
            {{ site.email }}
          </a>
        </div>
      </div>
    </div>
    </Teleport>
  </header>
</template>
