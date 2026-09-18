<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import PaymentIcons from './PaymentIcons.vue'
import { site, nav } from '@/data/site'
import { seoKeywords } from '@/data/site'

const year = computed(() => new Date().getFullYear())

const serviceLinks = nav[1].children
const topKeywords = seoKeywords.slice(0, 9)
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <!-- brand -->
        <div>
          <RouterLink to="/" class="logo footer__logo">
            <svg class="logo__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <!-- the footer sits on a mid sky blue, so the mark flips to a
                   white plate — the brand navy square had almost no contrast
                   against it -->
              <rect width="40" height="40" rx="11" fill="#ffffff" />
              <path
                d="M11 25.5h18M14.5 25.5v-6.2a1.6 1.6 0 0 1 .5-1.2l2.3-2.1a1.6 1.6 0 0 1 1.1-.4h5.2a1.6 1.6 0 0 1 1.1.4l2.3 2.1a1.6 1.6 0 0 1 .5 1.2v6.2"
                stroke="#0d69a6"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="16.6" cy="26.6" r="1.9" fill="#1273b0" />
              <circle cx="23.4" cy="26.6" r="1.9" fill="#1273b0" />
            </svg>
            <span>Canton<b>Pickup</b></span>
          </RouterLink>

          <p class="footer__desc">
            Airport transfers, private drivers and factory visit transport in
            Guangzhou and Foshan. English-speaking drivers, fixed prices and
            24/7 support.
          </p>

          <div class="footer__social">
            <a :href="site.whatsappLink" target="_blank" rel="noopener" aria-label="WhatsApp">
              <AppIcon name="whatsapp" :size="19" :stroke="1.8" />
            </a>
            <a :href="site.mailto" aria-label="Email">
              <AppIcon name="mail" :size="19" :stroke="1.9" />
            </a>
            <a :href="`tel:${site.phoneRaw}`" aria-label="Phone">
              <AppIcon name="phone" :size="18" :stroke="1.9" />
            </a>
          </div>
        </div>

        <!-- services -->
        <div>
          <h4>Services</h4>
          <div class="footer__links">
            <RouterLink v-for="s in serviceLinks" :key="s.to" :to="s.to">
              {{ s.label }}
            </RouterLink>
            <RouterLink to="/vehicles-pricing">Vehicles &amp; Pricing</RouterLink>
          </div>
        </div>

        <!-- company -->
        <div>
          <h4>Company</h4>
          <div class="footer__links">
            <RouterLink to="/about">About Us</RouterLink>
            <RouterLink to="/faqs">FAQs</RouterLink>
            <RouterLink to="/contact">Contact</RouterLink>
            <RouterLink to="/contact">Get a Quote</RouterLink>
            <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
            <RouterLink to="/terms">Terms &amp; Conditions</RouterLink>
          </div>
        </div>

        <!-- contact -->
        <div>
          <h4>Get in touch</h4>
          <div class="footer__links">
            <a :href="site.whatsappLink" target="_blank" rel="noopener">
              WhatsApp &amp; WeChat: {{ site.whatsapp }}
            </a>
            <a :href="site.mailto">{{ site.email }}</a>
            <a class="footer__address" :href="site.mapsLink" target="_blank" rel="noopener">
              <AppIcon name="pin" :size="15" :stroke="1.9" />
              {{ site.addressLine }}
            </a>
            <span style="font-size: 0.92rem">Open {{ site.hours }}</span>
          </div>
        </div>
      </div>

      <!-- payment badges — the "We accept" strip from the reference site -->
      <div class="footer__pay">
        <PaymentIcons tone="on-dark" />
        <span class="footer__pay-note">
          A 20% deposit confirms your booking. Free cancellation up to 48 hours
          before pickup.
        </span>
      </div>

      <!-- keyword footer: helps the long-tail SEO terms the client supplied -->
      <div
        style="
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 22px;
          padding-bottom: 6px;
        "
      >
        <h4 style="margin-bottom: 12px">Popular searches</h4>
        <div class="footer__bottom-links">
          <RouterLink v-for="k in topKeywords" :key="k" :to="'/airport-transfer'">
            {{ k }}
          </RouterLink>
        </div>
      </div>

      <div class="footer__bottom">
        <span>© {{ year }} {{ site.legalName }}. All rights reserved.</span>
        <div class="footer__bottom-links">
          <RouterLink to="/faqs">FAQs</RouterLink>
          <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
          <RouterLink to="/terms">Terms</RouterLink>
          <span>Guangzhou · Foshan · Dongguan · Shenzhen</span>
        </div>
      </div>
    </div>
  </footer>
</template>
