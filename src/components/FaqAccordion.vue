<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  items: { type: Array, required: true },
  /** index of the item open by default, -1 for none */
  openIndex: { type: Number, default: -1 },
  idPrefix: { type: String, default: 'faq' },
})

const open = ref(props.openIndex)

function toggle(i) {
  open.value = open.value === i ? -1 : i
}
</script>

<template>
  <div>
    <div
      v-for="(item, i) in items"
      :key="item.q"
      class="faq"
      :class="{ 'is-open': open === i }"
    >
      <h3 style="margin: 0">
        <button
          class="faq__q"
          type="button"
          :aria-expanded="open === i"
          :aria-controls="`${idPrefix}-a-${i}`"
          :id="`${idPrefix}-q-${i}`"
          @click="toggle(i)"
        >
          <span>{{ item.q }}</span>
          <span class="faq__icon">
            <AppIcon name="chevron" :size="17" :stroke="2.6" />
          </span>
        </button>
      </h3>

      <div
        class="faq__a"
        :id="`${idPrefix}-a-${i}`"
        role="region"
        :aria-labelledby="`${idPrefix}-q-${i}`"
      >
        <div class="faq__a-inner">
          <p>{{ item.a }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
