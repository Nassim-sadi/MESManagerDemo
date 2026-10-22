<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatusTag from '@/components/shared/StatusTag.vue'
import KpiTile from '../components/KpiTile.vue'
import {
  acknowledgeAlarm,
  fetchAlarms,
  fetchLineOverview,
  fetchSummary,
} from '../services/dashboard.service'
import type { DashboardSummary, KpiTile as KpiTileModel, ProductionLineRow } from '../types'
import type { Alarm } from '@/types/mes'
import { ALARM_TONES, LINE_TONES, toneOf } from '@/utils/status'
import { formatNumber, formatRelative, formatTime } from '@/utils/format'
import { useAlarmsStore } from '@/stores/alarms.store'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const alarmStore = useAlarmsStore()

const summary = ref<DashboardSummary | null>(null)
const lineRows = ref<ProductionLineRow[]>([])
const alarms = ref<Alarm[]>([])
const loading = ref(true)
const updatedAt = ref<Date | null>(null)

let timer: number | undefined

async function loadAlarms(): Promise<void> {
  alarms.value = await fetchAlarms()
  alarmStore.alarms = alarms.value
}

async function loadAll(): Promise<void> {
  loading.value = true
  try {
    const [summaryData, lineData, alarmData] = await Promise.all([
      fetchSummary(),
      fetchLineOverview(),
      fetchAlarms(),
    ])
    summary.value = summaryData
    lineRows.value = lineData
    alarms.value = alarmData
    alarmStore.alarms = alarmData
    updatedAt.value = new Date()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadAll()
  // Live refresh, but only while the tab is visible.
  timer = window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      void loadAll()
    }
  }, 5000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

const tiles = computed<KpiTileModel[]>(() => {
  const data = summary.value
  return [
    {
      key: 'active-orders',
      label: 'Active work orders',
      value: data ? formatNumber(data.activeOrders) : '—',
      icon: 'pi pi-list-check',
      tone: 'info',
      hint: 'Queued, running, paused and held orders',
    },
    {
      key: 'running-lines',
      label: 'Running production lines',
      value: data ? `${data.runningLines} / ${data.totalLines}` : '—',
      icon: 'pi pi-th-large',
      tone: data && data.runningLines < data.totalLines ? 'warn' : 'ok',
      hint: 'Lines currently producing',
    },
    {
      key: 'units-today',
      label: 'Units produced today',
      value: data ? formatNumber(data.unitsToday) : '—',
      icon: 'pi pi-box',
      tone: 'ok',
      hint: 'All lines, current shift',
    },
    {
      key: 'open-alarms',
      label: 'Open alarms',
      value: data ? String(data.openAlarms) : '—',
      icon: 'pi pi-exclamation-triangle',
      tone: data && data.openAlarms > 0 ? 'alarm' : 'ok',
      hint: 'Requires review by the shift lead',
    },
  ]
})

const updatedLabel = computed(() =>
  updatedAt.value
    ? new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(updatedAt.value)
    : '—',
)

function onAcknowledge(alarm: Alarm): void {
  confirm.require({
    header: 'Acknowledge alarm',
    message: `Acknowledge ${alarm.code} on ${alarm.line}?`,
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Acknowledge',
    rejectLabel: 'Cancel',
    accept: async () => {
      await acknowledgeAlarm(alarm.id)
      await loadAlarms()
      toast.add({
        severity: 'success',
        summary: 'Alarm acknowledged',
        detail: `${alarm.code} on ${alarm.line}`,
        life: 2500,
      })
    },
  })
}
</script>

<template>
  <div class="dashboard">
    <PageHeader title="Production Overview" subtitle="Plant 04 - Bratislava, current shift">
      <template #actions>
        <span class="dashboard__updated">
          <i class="pi pi-sync" />
          updated {{ updatedLabel }}
        </span>
        <Button
          icon="pi pi-list-check"
          label="Work orders"
          size="small"
          severity="secondary"
          outlined
          @click="router.push({ name: 'work-orders-list' })"
        />
        <Button
          icon="pi pi-refresh"
          label="Refresh"
          size="small"
          severity="secondary"
          outlined
          @click="loadAll"
        />
      </template>
    </PageHeader>

    <section class="kpis">
      <KpiTile v-for="tile in tiles" :key="tile.key" :tile="tile" :loading="loading" />
    </section>

    <section class="mes-card">
      <header class="mes-card__header">
        <span class="mes-card__title">Production lines</span>
        <span class="mes-eyebrow">current work order per line</span>
      </header>

      <DataTable
        :value="lineRows"
        :loading="loading"
        size="small"
        striped-rows
        data-key="id"
        :pt="{ table: { style: 'min-width: 58rem' } }"
      >
        <Column field="id" header="Line" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <RouterLink :to="{ name: 'production-line-detail', params: { id: data.id } }">
              <span class="mes-mono link">{{ data.id }}</span>
            </RouterLink>
          </template>
        </Column>
        <Column field="workOrderId" header="Current work order" style="width: 9.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.workOrderId ?? '—' }}</span>
          </template>
        </Column>
        <Column field="product" header="Product" sortable style="min-width: 11rem" />
        <Column field="targetQty" header="Target qty" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatNumber(data.targetQty) }}</span>
          </template>
        </Column>
        <Column field="producedQty" header="Produced" sortable style="width: 10rem">
          <template #body="{ data }">
            <div class="meter">
              <ProgressBar
                :value="data.targetQty ? (data.producedQty / data.targetQty) * 100 : 0"
                :show-value="false"
              />
              <span class="mes-mono">{{ formatNumber(data.producedQty) }}</span>
            </div>
          </template>
        </Column>
        <Column field="status" header="Status" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <StatusTag :value="data.status" :tone="toneOf(LINE_TONES, data.status)" />
          </template>
        </Column>
        <Column field="oee" header="OEE" sortable style="width: 8.5rem">
          <template #body="{ data }">
            <div class="meter">
              <ProgressBar :value="data.oee" :show-value="false" />
              <span class="mes-mono">{{ data.oee.toFixed(0) }}%</span>
            </div>
          </template>
        </Column>
      </DataTable>
    </section>

    <section class="mes-card">
      <header class="mes-card__header">
        <span class="mes-card__title">Open alarms</span>
        <span class="mes-eyebrow">{{ alarms.length }} events</span>
      </header>

      <DataTable :value="alarms" :loading="loading" size="small" striped-rows>
        <Column field="raisedAt" header="Time" style="width: 12rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatTime(data.raisedAt) }}</span>
            <span class="mes-faint mes-relative">{{ formatRelative(data.raisedAt) }}</span>
          </template>
        </Column>
        <Column field="line" header="Line" style="width: 8rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.line }}</span>
          </template>
        </Column>
        <Column field="code" header="Code" style="width: 8rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.code }}</span>
          </template>
        </Column>
        <Column field="message" header="Message" />
        <Column field="severity" header="Severity" style="width: 8rem">
          <template #body="{ data }">
            <StatusTag :value="data.severity" :tone="toneOf(ALARM_TONES, data.severity)" />
          </template>
        </Column>
        <Column field="acknowledged" header="State" style="width: 8rem">
          <template #body="{ data }">
            <Tag
              :value="data.acknowledged ? 'Acknowledged' : 'Open'"
              :severity="data.acknowledged ? 'secondary' : 'danger'"
            />
          </template>
        </Column>
        <Column style="width: 9rem">
          <template #body="{ data }">
            <Button
              v-if="!data.acknowledged"
              label="Acknowledge"
              size="small"
              severity="secondary"
              text
              @click="onAcknowledge(data)"
            />
          </template>
        </Column>
      </DataTable>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.7rem;
}

.dashboard__updated {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--mes-text-faint);
}

.meter {
  display: grid;
  grid-template-columns: 1fr 3.4rem;
  align-items: center;
  gap: 0.4rem;
}

.meter :deep(.p-progressbar) {
  height: 6px;
  background: var(--mes-surface-sunken);
}

.mes-relative {
  margin-left: 0.4rem;
  font-size: 11px;
}

.link {
  color: var(--mes-accent);
  font-weight: 600;
}
</style>
