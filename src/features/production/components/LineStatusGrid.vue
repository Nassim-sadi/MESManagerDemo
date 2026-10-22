<script setup lang="ts">
import ProgressBar from 'primevue/progressbar'
import StatusTag from '@/components/shared/StatusTag.vue'
import type { ProductionLine } from '@/types/mes'
import { LINE_TONES, toneOf } from '@/utils/status'
import { formatPercent } from '@/utils/format'

defineProps<{
  lines: ProductionLine[]
}>()
</script>

<template>
  <div class="lines">
    <article
      v-for="line in lines"
      :key="line.id"
      class="line"
      :class="`mes-tone--${toneOf(LINE_TONES, line.status)}`"
    >
      <header class="line__head">
        <span class="line__lamp" />
        <span class="line__id mes-mono">{{ line.id }}</span>
        <StatusTag :value="line.status" :tone="toneOf(LINE_TONES, line.status)" />
      </header>

      <p class="line__product">{{ line.product }}</p>

      <dl class="line__meta">
        <div>
          <dt>Work order</dt>
          <dd class="mes-mono">{{ line.workOrderId ?? '—' }}</dd>
        </div>
        <div>
          <dt>Operator</dt>
          <dd>{{ line.operator }}</dd>
        </div>
        <div>
          <dt>Shift</dt>
          <dd>{{ line.shift }}</dd>
        </div>
        <div>
          <dt>Cycle</dt>
          <dd>{{ line.cycleTimeSec }} s</dd>
        </div>
      </dl>

      <div class="line__meter">
        <span class="mes-eyebrow">Utilisation</span>
        <ProgressBar :value="line.utilization" :show-value="false" />
        <span class="line__meter-value">{{ formatPercent(line.utilization, 0) }}</span>
      </div>

      <div class="line__meter">
        <span class="mes-eyebrow">OEE</span>
        <ProgressBar :value="line.oee" :show-value="false" />
        <span class="line__meter-value">{{ formatPercent(line.oee, 0) }}</span>
      </div>
    </article>
  </div>
</template>

<style scoped>
.lines {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  gap: 0.6rem;
}

.line {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.6rem 0.7rem;
  background: var(--mes-surface);
  border: 1px solid var(--mes-border);
  border-radius: var(--mes-radius);
  box-shadow: var(--mes-shadow-card);
}

.line__head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

/* Status lamp - the only colour on the card besides the status tag. */
.line__lamp {
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--mes-tone-fg, var(--mes-idle));
}

.line__id {
  font-weight: 600;
  color: var(--mes-text-strong);
}

.line__product {
  margin: 0;
  font-size: var(--mes-fs-sm);
  font-weight: 600;
  color: var(--mes-text);
}

.line__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.2rem 0.5rem;
  margin: 0;
}

.line__meta dt {
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--mes-text-faint);
}

.line__meta dd {
  margin: 0;
  font-size: 12px;
  color: var(--mes-text);
}

.line__meter {
  display: grid;
  grid-template-columns: 4.5rem 1fr 2.6rem;
  align-items: center;
  gap: 0.4rem;
}

.line__meter-value {
  font-family: var(--mes-font-mono);
  font-size: 11px;
  text-align: right;
  color: var(--mes-text-muted);
}

.line__meter :deep(.p-progressbar) {
  height: 6px;
  background: var(--mes-surface-sunken);
}
</style>
