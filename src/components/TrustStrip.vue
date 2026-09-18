<script setup>
import { trustStrip } from '@/data/content'
import AppIcon from './AppIcon.vue'
</script>

<template>
  <div class="trust-strip">
    <div class="container trust-strip__inner">
      <div v-for="t in trustStrip" :key="t.title" class="trust-item">
        <span class="icon-badge icon-badge--sm icon-badge--solid">
          <AppIcon :name="t.icon" :size="20" :stroke="2" />
        </span>
        <div>
          <strong>{{ t.title }}</strong>
          <span>{{ t.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
