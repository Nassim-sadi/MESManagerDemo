<script setup lang="ts">
import { reactive, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { useDataTable } from '@/composables/useDataTable'
import { fetchNonConformances } from '../services/quality.service'
import type { NonConformance, QualityFilters } from '../types'
import { formatCompactDateTime } from '@/utils/format'

const filters = reactive<QualityFilters>({
  search: '',
  severity: null,
  status: null,
})

let searchTimer: number | undefined

const { items, total, loading, error, query, gotoPage, applySort, onFilterChanged } =
  useDataTable<NonConformance>({
    loader: (params) => fetchNonConformances({ ...params, filters: { ...filters } }),
    pageSize: 15,
    sortField: 'raisedAt',
    sortOrder: -1,
  })

watch(
  () => filters.search,
  () => {
    if (searchTimer) window.clearTimeout(searchTimer)
    searchTimer = window.setTimeout(() => void onFilterChanged(), 250)
  },
)

watch(
  () => [filters.severity, filters.status],
  () => void onFilterChanged(),
)

function onPage(event: { page: number; rows: number }): void {
  query.size = event.rows
  void gotoPage(event.page)
}

function severityOf(value: string): 'info' | 'warn' | 'danger' {
  if (value === 'Critical') return 'danger'
  if (value === 'Major') return 'warn'
  return 'info'
}
</script>

<template>
  <div class="quality">
    <PageHeader title="Defects" subtitle="Open and closed non-conformances of plant 04" />

    <div class="mes-card filters">
      <IconField class="filters__search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="filters.search" placeholder="NCR, serial number or defect" />
      </IconField>

      <Select
        v-model="filters.severity"
        :options="['Minor', 'Major', 'Critical']"
        placeholder="Severity"
        show-clear
        class="filters__select"
      />
      <Select
        v-model="filters.status"
        :options="['Open', 'Closed']"
        placeholder="Status"
        show-clear
        class="filters__select"
      />
    </div>

    <EmptyState
      v-if="error"
      icon="pi pi-exclamation-circle"
      title="Could not load non-conformances"
      :message="error"
    />

    <div v-else class="mes-table-wrap">
      <DataTable
        :value="items"
        lazy
        paginator
        :rows="query.size"
        :total-records="total"
        :loading="loading"
        :rows-per-page-options="[10, 15, 50]"
        :sort-field="query.sortField"
        :sort-order="query.sortOrder"
        size="small"
        striped-rows
        @page="onPage"
        @sort="applySort"
      >
        <Column field="id" header="NCR" sortable style="width: 8rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.id }}</span>
          </template>
        </Column>
        <Column field="raisedAt" header="Raised" sortable style="width: 10rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatCompactDateTime(data.raisedAt) }}</span>
          </template>
        </Column>
        <Column field="serial" header="Serial" sortable>
          <template #body="{ data }">
            <span class="mes-mono">{{ data.serial }}</span>
          </template>
        </Column>
        <Column field="workOrderId" header="Work order" sortable style="width: 9rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.workOrderId }}</span>
          </template>
        </Column>
        <Column field="line" header="Line" sortable style="width: 7rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.line }}</span>
          </template>
        </Column>
        <Column field="defect" header="Defect" />
        <Column field="severity" header="Severity" sortable style="width: 8rem">
          <template #body="{ data }">
            <Tag :value="data.severity" :severity="severityOf(data.severity)" />
          </template>
        </Column>
        <Column field="disposition" header="Disposition" style="width: 8rem" />
        <Column field="status" header="Status" sortable style="width: 7rem">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="data.status === 'Open' ? 'danger' : 'secondary'" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.quality {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
}

.filters__search {
  flex: 1 1 18rem;
}

.filters__select {
  min-width: 9rem;
}
</style>
