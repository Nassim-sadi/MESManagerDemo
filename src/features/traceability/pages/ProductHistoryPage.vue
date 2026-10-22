<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { useDataTable } from '@/composables/useDataTable'
import { fetchProductHistory } from '../services/traceability.service'
import type { ProductHistoryRow } from '../types'
import { formatCompactDateTime, formatNumber } from '@/utils/format'
import { useRouter } from 'vue-router'

const router = useRouter()

const { items, total, loading, error, query, gotoPage, applySort } =
  useDataTable<ProductHistoryRow>({
    loader: (params) => fetchProductHistory(params),
    pageSize: 15,
    sortField: 'product',
    sortOrder: 1,
  })

function onPage(event: { page: number; rows: number }): void {
  query.size = event.rows
  void gotoPage(event.page)
}
</script>

<template>
  <div class="history">
    <PageHeader
      title="Product History"
      subtitle="Production history per product: work orders, quantities and yield"
    />

    <EmptyState
      v-if="error"
      icon="pi pi-exclamation-circle"
      title="Could not load product history"
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
        <Column field="product" header="Product" sortable style="min-width: 11rem" />
        <Column field="bom" header="BOM" sortable style="width: 8.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.bom }}</span>
          </template>
        </Column>
        <Column field="workOrders" header="Work orders" sortable style="width: 7rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.workOrders }}</span>
          </template>
        </Column>
        <Column field="producedQty" header="Produced" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatNumber(data.producedQty) }}</span>
          </template>
        </Column>
        <Column field="scrapQty" header="Scrap" sortable style="width: 6rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatNumber(data.scrapQty) }}</span>
          </template>
        </Column>
        <Column field="yieldPct" header="Yield" sortable style="width: 6rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.yieldPct.toFixed(1) }}%</span>
          </template>
        </Column>
        <Column field="lastBatch" header="Last batch" sortable style="width: 8rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.lastBatch }}</span>
          </template>
        </Column>
        <Column field="lastActivity" header="Last activity" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatCompactDateTime(data.lastActivity) }}</span>
          </template>
        </Column>
        <Column style="width: 4rem">
          <template #body>
            <Button
              icon="pi pi-barcode"
              severity="secondary"
              text
              size="small"
              aria-label="Open serial search"
              @click="router.push({ name: 'traceability-search' })"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.history {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
</style>
