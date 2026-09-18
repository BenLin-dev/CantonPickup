<script setup>
defineProps({
  steps: { type: Array, required: true },
})
</script>

<template>
  <ol class="steps">
    <li v-for="(s, i) in steps" :key="s.title" class="step" v-reveal="{ delay: i * 80 }">
      <span class="step__num">{{ s.n }}</span>
      <h3 class="step__title">{{ s.title }}</h3>
      <p class="step__text">{{ s.text }}</p>
    </li>
  </ol>
</template>
