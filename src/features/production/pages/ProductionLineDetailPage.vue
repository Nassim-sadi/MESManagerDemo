<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatusTag from '@/components/shared/StatusTag.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { fetchLine, fetchLineStations, fetchLineWorkOrders } from '../services/production.service'
import type { ProductionLine, Station, WorkOrder } from '@/types/mes'
import { LINE_TONES, STATION_TONES, WORK_ORDER_TONES, toneOf } from '@/utils/status'
import { formatPercent } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const line = ref<ProductionLine | null>(null)
const stations = ref<Station[]>([])
const workOrders = ref<WorkOrder[]>([])
const loading = ref(true)

async function load(id: string): Promise<void> {
  loading.value = true
  try {
    const [lineData, stationData, orderData] = await Promise.all([
      fetchLine(id),
      fetchLineStations(id),
      fetchLineWorkOrders(id),
    ])
    line.value = lineData
    stations.value = stationData
    workOrders.value = orderData
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const id = String(route.params.id ?? '')
  if (id) void load(id)
})

watch(
  () => route.params.id,
  (id) => {
    if (typeof id === 'string' && id) void load(id)
  },
)
</script>

<template>
  <div class="line-detail">
    <PageHeader
      :title="line ? `${line.id} · ${line.name}` : 'Line detail'"
      subtitle="Line performance, stations and current work orders"
    >
      <template #actions>
        <Button
          icon="pi pi-arrow-left"
          label="All lines"
          size="small"
          severity="secondary"
          text
          @click="router.push({ name: 'production-lines' })"
        />
      </template>
    </PageHeader>

    <EmptyState
      v-if="!loading && !line"
      icon="pi pi-times-circle"
      title="Line not found"
      message="The requested production line does not exist."
    />

    <template v-else-if="line">
      <section class="metrics">
        <div class="mes-card metric">
          <span class="mes-eyebrow">State</span>
          <StatusTag :value="line.status" :tone="LINE_TONES[line.status]" />
        </div>
        <div class="mes-card metric">
          <span class="mes-eyebrow">OEE</span>
          <strong class="mes-mono metric__value">{{ formatPercent(line.oee) }}</strong>
        </div>
        <div class="mes-card metric">
          <span class="mes-eyebrow">Availability</span>
          <strong class="mes-mono metric__value">{{ formatPercent(line.availability) }}</strong>
        </div>
        <div class="mes-card metric">
          <span class="mes-eyebrow">Performance</span>
          <strong class="mes-mono metric__value">{{ formatPercent(line.performance) }}</strong>
        </div>
        <div class="mes-card metric">
          <span class="mes-eyebrow">Quality</span>
          <strong class="mes-mono metric__value">{{ formatPercent(line.quality) }}</strong>
        </div>
        <div class="mes-card metric">
          <span class="mes-eyebrow">Current product</span>
          <strong class="metric__value metric__value--text">{{ line.product }}</strong>
        </div>
      </section>

      <div class="columns">
        <section class="mes-card">
          <header class="mes-card__header">
            <span class="mes-card__title">Stations</span>
          </header>
          <DataTable :value="stations" size="small" striped-rows>
            <Column field="id" header="Station">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.id }}</span>
              </template>
            </Column>
            <Column field="name" header="Name" />
            <Column field="state" header="State" style="width: 9rem">
              <template #body="{ data }">
                <StatusTag :value="data.state" :tone="STATION_TONES[data.state] ?? 'idle'" />
              </template>
            </Column>
          </DataTable>
        </section>

        <section class="mes-card">
          <header class="mes-card__header">
            <span class="mes-card__title">Work orders on this line</span>
          </header>
          <DataTable :value="workOrders" size="small" striped-rows>
            <Column field="id" header="Order">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.id }}</span>
              </template>
            </Column>
            <Column field="product" header="Product" />
            <Column field="status" header="Status" style="width: 8rem">
              <template #body="{ data }">
                <StatusTag :value="data.status" :tone="toneOf(WORK_ORDER_TONES, data.status)" />
              </template>
            </Column>
            <Column field="completedQty" header="Progress" style="width: 10rem">
              <template #body="{ data }">
                <div class="meter">
                  <ProgressBar
                    :value="data.plannedQty ? (data.completedQty / data.plannedQty) * 100 : 0"
                    :show-value="false"
                  />
                  <span class="mes-mono">{{ data.completedQty }}/{{ data.plannedQty }}</span>
                </div>
              </template>
            </Column>
          </DataTable>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.line-detail {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.6rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.6rem 0.75rem;
}

.metric__value {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--mes-text-strong);
}

.metric__value--text {
  font-size: 0.875rem;
}

.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 0.75rem;
  align-items: start;
}

.meter {
  display: grid;
  grid-template-columns: 1fr 4rem;
  align-items: center;
  gap: 0.4rem;
}

.meter :deep(.p-progressbar) {
  height: 6px;
  background: var(--mes-surface-sunken);
}
</style>
