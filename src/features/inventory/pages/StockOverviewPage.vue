<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { useDataTable } from '@/composables/useDataTable'
import { fetchStock, fetchWarehouses } from '../services/inventory.service'
import type { StockFilters } from '../types'
import type { StockItem } from '@/types/mes'
import { formatNumber } from '@/utils/format'

const filters = reactive<StockFilters>({ search: '', warehouse: null, status: null })
const warehouses = ref<string[]>([])

let searchTimer: number | undefined

const { items, total, loading, error, query, gotoPage, applySort, onFilterChanged } =
  useDataTable<StockItem>({
    loader: (params) => fetchStock({ ...params, filters: { ...filters } }),
    pageSize: 15,
    sortField: 'id',
    sortOrder: 1,
  })

onMounted(async () => {
  warehouses.value = await fetchWarehouses()
})

watch(
  () => filters.search,
  () => {
    if (searchTimer) window.clearTimeout(searchTimer)
    searchTimer = window.setTimeout(() => void onFilterChanged(), 250)
  },
)

watch(
  () => [filters.warehouse, filters.status],
  () => void onFilterChanged(),
)

function onPage(event: { page: number; rows: number }): void {
  query.size = event.rows
  void gotoPage(event.page)
}

function levelOf(item: StockItem): number {
  return item.minLevel ? Math.min(100, (item.onHand / item.minLevel) * 100) : 100
}
</script>

<template>
  <div class="stock">
    <PageHeader title="Stock Overview" subtitle="Material stock per warehouse and bin location" />

    <div class="mes-card filters">
      <IconField class="filters__search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="filters.search" placeholder="Material, description or location" />
      </IconField>

      <Select
        v-model="filters.warehouse"
        :options="warehouses"
        placeholder="Warehouse"
        show-clear
        class="filters__select"
      />
      <Select
        v-model="filters.status"
        :options="['Available', 'Low', 'Blocked']"
        placeholder="Status"
        show-clear
        class="filters__select"
      />
    </div>

    <EmptyState
      v-if="error"
      icon="pi pi-exclamation-circle"
      title="Could not load stock"
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
        <Column field="id" header="Material" sortable style="width: 9rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.id }}</span>
          </template>
        </Column>
        <Column field="description" header="Description" sortable />
        <Column field="warehouse" header="Warehouse" sortable style="width: 12rem" />
        <Column field="location" header="Location" sortable style="width: 7rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.location }}</span>
          </template>
        </Column>
        <Column field="onHand" header="On hand" sortable style="width: 11rem">
          <template #body="{ data }">
            <div class="meter">
              <ProgressBar :value="levelOf(data)" :show-value="false" />
              <span class="mes-mono"> {{ formatNumber(data.onHand) }} {{ data.unit }} </span>
            </div>
          </template>
        </Column>
        <Column field="minLevel" header="Min level" sortable style="width: 8rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatNumber(data.minLevel) }}</span>
          </template>
        </Column>
        <Column field="status" header="Status" sortable style="width: 8rem">
          <template #body="{ data }">
            <Tag
              :value="data.status"
              :severity="
                data.status === 'Available' ? 'success' : data.status === 'Low' ? 'warn' : 'danger'
              "
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.stock {
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
  min-width: 10rem;
}

.meter {
  display: grid;
  grid-template-columns: 1fr 6rem;
  align-items: center;
  gap: 0.4rem;
}

.meter :deep(.p-progressbar) {
  height: 6px;
  background: var(--mes-surface-sunken);
}
</style>
