<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppTopBar from '@/components/layout/AppTopBar.vue'
</script>

<template>
  <div class="shell">
    <AppTopBar />
    <main class="shell__content">
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--mes-canvas);
}

.shell__content {
  flex: 1 1 auto;
  overflow: auto;
  padding: var(--mes-content-gutter);
}
</style>
