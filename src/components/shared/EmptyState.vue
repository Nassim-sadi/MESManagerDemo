<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  message?: string
}>()
</script>

<template>
  <div class="empty-state">
    <i :class="['pi', icon ?? 'pi-inbox', 'empty-state__icon']" />
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="message" class="empty-state__message">{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 2rem 1rem;
  text-align: center;
}

.empty-state__icon {
  font-size: 1.6rem;
  color: var(--mes-text-faint);
}

.empty-state__title {
  margin: 0;
  font-weight: 600;
  color: var(--mes-text);
}

.empty-state__message {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--mes-text-muted);
  max-width: 34rem;
}
</style>
