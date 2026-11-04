<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <section class="filter-card mes-card">
    <header class="filter-card__header">
      <div class="filter-card__heading">
        <h2 class="filter-card__title">{{ title ?? 'Filters' }}</h2>
        <p v-if="description" class="filter-card__description">{{ description }}</p>
      </div>
      <div class="filter-card__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="filter-card__body">
      <div class="filter-card__grid">
        <slot />
      </div>
      <div v-if="$slots.chips" class="filter-card__chips">
        <slot name="chips" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.filter-card {
  overflow: hidden;
}

.filter-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0.9rem;
  border-bottom: 1px solid var(--mes-border-soft);
}

.filter-card__heading {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.filter-card__title {
  margin: 0;
  font-size: var(--mes-fs-md);
  font-weight: 650;
  color: var(--mes-text-strong);
}

.filter-card__description {
  margin: 0;
  font-size: var(--mes-fs-xs);
  color: var(--mes-text-muted);
}

.filter-card__actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 0 0 auto;
}

.filter-card__body {
  padding: 0.9rem;
}

.filter-card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11.5rem, 1fr));
  gap: 0.8rem 1rem;
  align-items: end;
}

.filter-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.75rem;
  padding-top: 0.7rem;
  border-top: 1px dashed var(--mes-border-soft);
}

@media (max-width: 720px) {
  .filter-card__header {
    flex-direction: column;
  }

  .filter-card__actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
