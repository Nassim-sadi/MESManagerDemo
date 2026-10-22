<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
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
import { fetchMovements } from '../services/inventory.service'
import type { MovementFilters } from '../types'
import type { MaterialMovement } from '@/types/mes'
import { formatCompactDateTime, formatNumber } from '@/utils/format'

const filters = reactive<MovementFilters>({ search: '', type: null })

const types = ['Goods receipt', 'Issue to line', 'Transfer', 'Scrap', 'Return']

let searchTimer: number | undefined

const { items, total, loading, error, query, gotoPage, applySort, onFilterChanged } =
  useDataTable<MaterialMovement>({
    loader: (params) => fetchMovements({ ...params, filters: { ...filters } }),
    pageSize: 15,
    sortField: 'movedAt',
    sortOrder: -1,
  })

onMounted(() => {
  void onFilterChanged()
})

watch(
  () => filters.search,
  () => {
    if (searchTimer) window.clearTimeout(searchTimer)
    searchTimer = window.setTimeout(() => void onFilterChanged(), 250)
  },
)

watch(
  () => filters.type,
  () => void onFilterChanged(),
)

function onPage(event: { page: number; rows: number }): void {
  query.size = event.rows
  void gotoPage(event.page)
}

function severityOf(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
  switch (type) {
    case 'Goods receipt':
      return 'success'
    case 'Issue to line':
      return 'info'
    case 'Scrap':
      return 'danger'
    case 'Return':
      return 'warn'
    default:
      return 'secondary'
  }
}
</script>

<template>
  <div class="movements">
    <PageHeader
      title="Material Movements"
      subtitle="Goods receipts, issues to the line, transfers and scrap"
    />

    <div class="mes-card filters">
      <IconField class="filters__search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="filters.search" placeholder="Movement, material or reference" />
      </IconField>

      <Select
        v-model="filters.type"
        :options="types"
        placeholder="Movement type"
        show-clear
        class="filters__select"
      />
    </div>

    <EmptyState
      v-if="error"
      icon="pi pi-exclamation-circle"
      title="Could not load movements"
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
        <Column field="id" header="Movement" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.id }}</span>
          </template>
        </Column>
        <Column field="movedAt" header="Moved" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatCompactDateTime(data.movedAt) }}</span>
          </template>
        </Column>
        <Column field="material" header="Material" sortable style="width: 8rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.material }}</span>
          </template>
        </Column>
        <Column field="description" header="Description" style="min-width: 12rem" />
        <Column field="type" header="Type" sortable style="width: 8.5rem">
          <template #body="{ data }">
            <Tag :value="data.type" :severity="severityOf(data.type)" />
          </template>
        </Column>
        <Column field="quantity" header="Quantity" sortable style="width: 7rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatNumber(data.quantity) }} {{ data.unit }}</span>
          </template>
        </Column>
        <Column field="reference" header="Reference" sortable style="width: 8rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.reference }}</span>
          </template>
        </Column>
        <Column field="user" header="User" sortable style="width: 7rem" />
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.movements {
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
  min-width: 11rem;
}
</style>
