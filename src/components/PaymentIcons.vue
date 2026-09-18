<script setup>
/**
 * "We accept" payment badge row.
 *
 * Inline SVG so the marks stay crisp at any size and can be re-tinted with
 * two CSS custom properties:
 *
 *   --pay-plate  the rounded badge behind the wordmark
 *   --pay-mark   the wordmark / symbol itself
 *
 * `tone="on-dark"` flips them for the navy footer.
 */
defineProps({
  /** Show the "We accept:" caption to the left of the badges. */
  label: { type: Boolean, default: true },
  /** "on-light" (default) or "on-dark". */
  tone: { type: String, default: 'on-light' },
  /** Caption text. Override for localisation. */
  caption: { type: String, default: 'We accept:' },
})
</script>

<template>
  <div class="payicons" :class="`payicons--${tone}`">
    <span v-if="label" class="payicons__caption">{{ caption }}</span>

    <ul class="payicons__list">
      <li>
        <svg class="payicon" viewBox="0 0 44 28" role="img" aria-label="Visa">
          <rect class="pi-plate" width="44" height="28" rx="5" />
          <text
            class="pi-mark"
            x="22"
            y="19"
            text-anchor="middle"
            font-family="Arial, Helvetica, sans-serif"
            font-size="11.5"
            font-weight="700"
            font-style="italic"
            letter-spacing="0.3"
          >
            VISA
          </text>
        </svg>
      </li>

      <li>
        <svg class="payicon" viewBox="0 0 44 28" role="img" aria-label="Mastercard">
          <rect class="pi-plate" width="44" height="28" rx="5" />
          <circle class="pi-mark" cx="17.4" cy="11.6" r="6.4" opacity="0.7" />
          <circle class="pi-mark" cx="26.6" cy="11.6" r="6.4" opacity="0.7" />
          <text
            class="pi-mark"
            x="22"
            y="24.4"
            text-anchor="middle"
            font-family="Arial, Helvetica, sans-serif"
            font-size="4.5"
            font-weight="700"
            letter-spacing="0.1"
          >
            mastercard
          </text>
        </svg>
      </li>

      <li>
        <svg class="payicon" viewBox="0 0 44 28" role="img" aria-label="PayPal">
          <rect class="pi-plate" width="44" height="28" rx="5" />
          <text
            class="pi-mark"
            x="22"
            y="18.6"
            text-anchor="middle"
            font-family="Arial, Helvetica, sans-serif"
            font-size="9.8"
            font-weight="700"
            font-style="italic"
          >
            PayPal
          </text>
        </svg>
      </li>

      <li>
        <svg class="payicon" viewBox="0 0 44 28" role="img" aria-label="Alipay">
          <rect class="pi-plate" width="44" height="28" rx="5" />
          <text
            class="pi-mark"
            x="22"
            y="18.6"
            text-anchor="middle"
            font-family="Arial, Helvetica, sans-serif"
            font-size="9.8"
            font-weight="700"
          >
            Alipay
          </text>
        </svg>
      </li>

      <li>
        <svg class="payicon" viewBox="0 0 44 28" role="img" aria-label="WeChat Pay">
          <rect class="pi-plate" width="44" height="28" rx="5" />
          <g class="pi-mark">
            <ellipse cx="18.2" cy="11.9" rx="7.4" ry="6.1" opacity="0.72" />
            <path d="M12.4 17.2 10 20.1l3.9-.9z" opacity="0.72" />
            <ellipse cx="28" cy="14.4" rx="6.2" ry="5.1" />
            <path d="M23.4 18.9l-2 2.5 3.3-.8z" />
          </g>
        </svg>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.payicons {
  --pay-plate: #64717f;
  --pay-mark: #ffffff;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
}

.payicons--on-dark {
  --pay-plate: rgba(255, 255, 255, 0.93);
  --pay-mark: #0b3d7c;
}

.payicons__caption {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-muted);
}

.payicons--on-dark .payicons__caption {
  color: rgba(255, 255, 255, 0.68);
}

.payicons__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.payicon {
  display: block;
  width: 46px;
  height: 29px;
  border-radius: 5px;
  transition: transform 0.2s var(--ease), opacity 0.2s var(--ease);
}

.payicons__list li:hover .payicon {
  transform: translateY(-2px);
}

.pi-plate {
  fill: var(--pay-plate);
}

.pi-mark {
  fill: var(--pay-mark);
}

@media (max-width: 560px) {
  .payicon {
    width: 40px;
    height: 25px;
  }
}
</style>
