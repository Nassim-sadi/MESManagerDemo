<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Message from 'primevue/message'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { mockData } from '@/services/mock/data'
import { formatQty } from '@/utils/format'
import {
  fetchProductionReport,
  exportProductionReportCsv,
} from '../services/production-report.service'
import type { ProductionReportFilters, ProductionReportRow } from '../types/production-report'

const filters = reactive<ProductionReportFilters>({
  dateFrom: '',
  dateTo: '',
  line: null,
  site: null,
  shift: null,
  orderCode: '',
  model: '',
})
const rows = ref<ProductionReportRow[]>([])
const loading = ref(false)
const error = ref('')
let searchTimer: number | undefined

const lines = [...new Set(mockData.workOrders.map((order) => order.line))].sort()
const shifts = [...new Set(mockData.lines.map((line) => line.shift))].sort()
const sites = ['Plant 04 - Bratislava']
const totals = computed(() =>
  rows.value.reduce(
    (total, row) => ({
      plannedQty: total.plannedQty + row.plannedQty,
      scanQty: total.scanQty + row.scanQty,
      repairQty: total.repairQty + row.repairQty,
    }),
    { plannedQty: 0, scanQty: 0, repairQty: 0 },
  ),
)

async function refresh(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    rows.value = await fetchProductionReport({ ...filters })
  } catch {
    error.value = 'Production report could not be loaded.'
  } finally {
    loading.value = false
  }
}

function resetFilters(): void {
  Object.assign(filters, {
    dateFrom: '',
    dateTo: '',
    line: null,
    site: null,
    shift: null,
    orderCode: '',
    model: '',
  })
  void refresh()
}

function onDateChange(field: 'dateFrom' | 'dateTo', value: unknown): void {
  const date = value instanceof Date ? value : null
  filters[field] =
    date && !Number.isNaN(date.getTime())
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : ''
}

function dateValue(value: string): Date | null {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
}

watch(
  () => [filters.orderCode, filters.model],
  () => {
    if (searchTimer) window.clearTimeout(searchTimer)
    searchTimer = window.setTimeout(() => void refresh(), 250)
  },
)
watch(
  () => [filters.dateFrom, filters.dateTo, filters.line, filters.site, filters.shift],
  () => void refresh(),
)
onMounted(() => void refresh())
</script>

<template>
  <div class="report-page">
    <PageHeader
      title="Order Production Report"
      subtitle="Production quantities by date, line, shift, order and model"
    >
      <template #actions>
        <Button
          label="Export CSV"
          icon="pi pi-download"
          size="small"
          severity="secondary"
          outlined
          :disabled="rows.length === 0"
          @click="exportProductionReportCsv(rows)"
        />
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          size="small"
          severity="secondary"
          text
          @click="refresh"
        />
      </template>
    </PageHeader>

    <div class="mes-card filters">
      <DatePicker
        :model-value="dateValue(filters.dateFrom)"
        date-format="yy-mm-dd"
        placeholder="From date"
        show-icon
        @update:model-value="onDateChange('dateFrom', $event)"
      />
      <DatePicker
        :model-value="dateValue(filters.dateTo)"
        date-format="yy-mm-dd"
        placeholder="To date"
        show-icon
        @update:model-value="onDateChange('dateTo', $event)"
      />
      <Select
        v-model="filters.line"
        :options="lines"
        placeholder="Line"
        show-clear
        class="filter-select"
      />
      <Select
        v-model="filters.site"
        :options="sites"
        placeholder="Site"
        show-clear
        class="filter-select filter-select--wide"
      />
      <Select
        v-model="filters.shift"
        :options="shifts"
        placeholder="Shift"
        show-clear
        class="filter-select"
      />
      <IconField class="filter-search"
        ><InputIcon class="pi pi-search" /><InputText
          v-model="filters.orderCode"
          placeholder="Order code"
      /></IconField>
      <IconField class="filter-search"
        ><InputIcon class="pi pi-search" /><InputText v-model="filters.model" placeholder="Model"
      /></IconField>
      <Button
        label="Reset"
        icon="pi pi-filter-slash"
        severity="secondary"
        text
        size="small"
        @click="resetFilters"
      />
    </div>

    <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
    <EmptyState
      v-else-if="!loading && rows.length === 0"
      icon="pi pi-inbox"
      title="No production records found"
      message="Adjust the filters or choose another factory account."
    />
    <div v-else class="mes-card report-table">
      <DataTable
        :value="rows"
        :loading="loading"
        paginator
        :rows="20"
        :rows-per-page-options="[10, 20, 50, 100]"
        size="small"
        striped-rows
        scrollable
      >
        <Column field="workDate" header="Work date" sortable style="min-width: 10rem"
          ><template #body="{ data }"
            ><span class="mes-mono">{{ data.workDate }}</span></template
          ></Column
        >
        <Column field="line" header="Line" sortable style="min-width: 7rem"
          ><template #body="{ data }"
            ><span class="mes-mono">{{ data.line }}</span></template
          ></Column
        >
        <Column field="site" header="Site" sortable style="min-width: 12rem" />
        <Column field="shift" header="Shift" sortable style="min-width: 7rem" />
        <Column field="orderCode" header="Order code" sortable style="min-width: 9rem"
          ><template #body="{ data }"
            ><span class="mes-mono">{{ data.orderCode }}</span></template
          ></Column
        >
        <Column field="model" header="Model" sortable style="min-width: 12rem" />
        <Column field="modelDescription" header="Model description" style="min-width: 14rem" />
        <Column field="plannedQty" header="Planned" sortable style="min-width: 7rem"
          ><template #body="{ data }"
            ><span class="mes-mono">{{ formatQty(data.plannedQty) }}</span></template
          ></Column
        >
        <Column field="scanQty" header="Scanned" sortable style="min-width: 7rem"
          ><template #body="{ data }"
            ><span class="mes-mono">{{ formatQty(data.scanQty) }}</span></template
          ></Column
        >
        <Column field="repairQty" header="Repair" sortable style="min-width: 7rem"
          ><template #body="{ data }"
            ><span class="mes-mono">{{ formatQty(data.repairQty) }}</span></template
          ></Column
        >
      </DataTable>
      <footer class="totals">
        <strong>{{ rows.length }} records</strong
        ><span
          >Planned <b>{{ formatQty(totals.plannedQty) }}</b></span
        ><span
          >Scanned <b>{{ formatQty(totals.scanQty) }}</b></span
        ><span
          >Repair <b>{{ formatQty(totals.repairQty) }}</b></span
        >
      </footer>
    </div>
  </div>
</template>

<style scoped>
.report-page {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem;
}
.filter-select {
  min-width: 8rem;
  flex: 1 1 8rem;
}
.filter-select--wide {
  flex-basis: 12rem;
}
.filter-search {
  flex: 1 1 10rem;
  min-width: 9rem;
}
.filter-search :deep(.p-inputtext) {
  width: 100%;
}
.report-table {
  overflow: hidden;
}
.totals {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--mes-border);
  font-size: 0.8rem;
}
.totals span {
  color: var(--mes-text-muted);
}
.totals b {
  margin-left: 0.2rem;
  color: var(--mes-text);
  font-family: var(--mes-font-mono);
}
</style>
