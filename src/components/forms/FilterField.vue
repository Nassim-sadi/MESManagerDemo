<script setup lang="ts">
defineProps<{
  label: string
  hint?: string
  wide?: boolean
}>()
</script>

<template>
  <div class="filter-field" :class="{ 'filter-field--wide': wide }">
    <span class="filter-field__label">{{ label }}</span>
    <slot />
    <span v-if="hint" class="filter-field__hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.filter-field--wide {
  grid-column: span 2;
}

.filter-field__label {
  font-size: var(--mes-fs-xs);
  font-weight: 600;
  color: var(--mes-text-muted);
}

.filter-field__hint {
  font-size: 11px;
  color: var(--mes-text-faint);
}

@media (max-width: 720px) {
  .filter-field--wide {
    grid-column: span 1;
  }
}
</style>
