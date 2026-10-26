<script setup lang="ts">
import type { KpiTile } from '../types'

defineProps<{
  tile: KpiTile
  loading?: boolean
}>()
</script>

<template>
  <div
    class="kpi"
    :class="[
      `mes-tone--${tile.tone}`,
      { 'kpi--alert': tile.tone === 'alarm' || tile.tone === 'warn' },
    ]"
  >
    <div class="kpi__head">
      <span class="kpi__label">{{ tile.label }}</span>
      <i :class="['pi', tile.icon, 'kpi__icon']" />
    </div>

    <div class="kpi__value">
      <template v-if="loading">
        <span class="kpi__skeleton" />
      </template>
      <template v-else>
        <span class="kpi__number">{{ tile.value }}</span>
        <span v-if="tile.unit" class="kpi__unit">{{ tile.unit }}</span>
      </template>
    </div>

    <span class="kpi__hint">{{ tile.hint }}</span>
  </div>
</template>

<style scoped>
.kpi {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.7rem 0.85rem;
  background: var(--mes-surface);
  border: 1px solid var(--mes-border);
  border-radius: var(--mes-radius);
  box-shadow: var(--mes-shadow-card);
  min-width: 0;
}

.kpi__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.kpi__label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--mes-text-muted);
}

.kpi__icon {
  font-size: 0.8rem;
  color: var(--mes-tone-fg, var(--mes-accent));
}

.kpi__value {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  min-height: 1.9rem;
}

.kpi__number {
  font-family: var(--mes-font-mono);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.1;
  color: var(--mes-text-strong);
}

/* Only the numbers that need attention carry a status colour. */
.kpi--alert .kpi__number {
  color: var(--mes-tone-fg);
}

.kpi__unit {
  font-size: 0.8125rem;
  color: var(--mes-text-muted);
}

.kpi__skeleton {
  display: block;
  width: 4.5rem;
  height: 1.35rem;
  border-radius: 4px;
  background: var(--mes-skeleton);
}

.kpi__hint {
  font-size: 0.6875rem;
  color: var(--mes-text-faint);
}
</style>
