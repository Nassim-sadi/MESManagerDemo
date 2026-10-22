<script setup lang="ts">
import { reactive, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { useDataTable } from '@/composables/useDataTable'
import { fetchInspections } from '../services/quality.service'
import type { InspectionFilters } from '../types'
import type { Inspection } from '@/types/mes'
import { formatCompactDateTime } from '@/utils/format'

const filters = reactive<InspectionFilters>({ search: '', type: null, result: null })

let searchTimer: number | undefined

const { items, total, loading, error, query, gotoPage, applySort, onFilterChanged } =
  useDataTable<Inspection>({
    loader: (params) => fetchInspections({ ...params, filters: { ...filters } }),
    pageSize: 15,
    sortField: 'inspectedAt',
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
  () => [filters.type, filters.result],
  () => void onFilterChanged(),
)

function onPage(event: { page: number; rows: number }): void {
  query.size = event.rows
  void gotoPage(event.page)
}

function resultOf(value: string): 'success' | 'warn' | 'danger' {
  if (value === 'Pass') return 'success'
  if (value === 'Conditional') return 'warn'
  return 'danger'
}
</script>

<template>
  <div class="inspections">
    <PageHeader
      title="Inspections"
      subtitle="Incoming, in process and final inspections of plant 04"
    />

    <div class="mes-card filters">
      <IconField class="filters__search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="filters.search" placeholder="Inspection, serial number or station" />
      </IconField>

      <Select
        v-model="filters.type"
        :options="['Incoming', 'In process', 'Final']"
        placeholder="Type"
        show-clear
        class="filters__select"
      />
      <Select
        v-model="filters.result"
        :options="['Pass', 'Conditional', 'Fail']"
        placeholder="Result"
        show-clear
        class="filters__select"
      />
    </div>

    <EmptyState
      v-if="error"
      icon="pi pi-exclamation-circle"
      title="Could not load inspections"
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
        <Column field="id" header="Inspection" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.id }}</span>
          </template>
        </Column>
        <Column field="inspectedAt" header="Inspected" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatCompactDateTime(data.inspectedAt) }}</span>
          </template>
        </Column>
        <Column field="type" header="Type" sortable style="width: 7rem">
          <template #body="{ data }">
            <Tag :value="data.type" severity="secondary" />
          </template>
        </Column>
        <Column field="serial" header="Serial" sortable>
          <template #body="{ data }">
            <span class="mes-mono">{{ data.serial }}</span>
          </template>
        </Column>
        <Column field="station" header="Station" sortable style="width: 10rem" />
        <Column field="measured" header="Measured" style="width: 7rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.measured }}</span>
          </template>
        </Column>
        <Column field="inspector" header="Inspector" sortable style="width: 8rem" />
        <Column field="result" header="Result" sortable style="width: 7rem">
          <template #body="{ data }">
            <Tag :value="data.result" :severity="resultOf(data.result)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.inspections {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
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
