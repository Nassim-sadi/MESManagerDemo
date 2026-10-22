<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="page-header">
    <div class="page-header__main">
      <h1 class="page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
    </div>
    <div class="page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.page-header__main {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.page-header__title {
  font-size: var(--mes-fs-xl);
  font-weight: 650;
  letter-spacing: -0.015em;
  line-height: 1.2;
}

.page-header__subtitle {
  margin: 0;
  font-size: var(--mes-fs-md);
  color: var(--mes-text-muted);
}

.page-header__actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 0 0 auto;
}
</style>
