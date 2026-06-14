<script setup lang="ts">
import DesktopLayout from './layouts/DesktopLayout.vue'
import MobileLayout from './layouts/MobileLayout.vue'

const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
  navigator.userAgent
)
</script>

<template>
  <div class="app-border"></div>
  <DesktopLayout v-if="!isMobile"/>
  <MobileLayout v-else/>
</template>
