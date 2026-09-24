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
        <img class="logo__img" src="/logo.svg" alt="CantonPickup" width="159" height="44" />
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
          <img class="logo__img" src="/logo.svg" alt="CantonPickup" width="159" height="44" />
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
          <a class="btn btn--outline btn--block" :href="site.waLink($route.path)" target="_blank" rel="noopener">
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
