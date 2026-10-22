<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatusTag from '@/components/shared/StatusTag.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import WorkOrderDialog from '../components/WorkOrderDialog.vue'
import { useDataTable } from '@/composables/useDataTable'
import {
  fetchWorkOrderLines,
  fetchWorkOrders,
  setWorkOrderStatus,
} from '../services/work-orders.service'
import type { WorkOrderFilters } from '../types'
import type { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '@/types/mes'
import { WORK_ORDER_TONES, toneOf } from '@/utils/status'
import { formatCompactDateTime, formatQty } from '@/utils/format'
import { useAuthStore } from '@/stores/auth.store'
import { PERMISSIONS } from '@/types/permissions'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const auth = useAuthStore()

const canEdit = auth.hasPermission(PERMISSIONS.workOrdersEdit)

const filters = reactive<WorkOrderFilters>({
  search: '',
  status: null,
  line: null,
  priority: null,
})

const lines = ref<string[]>([])
const dialogVisible = ref(false)
let searchTimer: number | undefined

const statuses: WorkOrderStatus[] = [
  'Queued',
  'Running',
  'Paused',
  'Hold',
  'Completed',
  'Cancelled',
]
const priorities: WorkOrderPriority[] = ['Low', 'Normal', 'High', 'Urgent']

const { items, total, loading, error, query, gotoPage, applySort, refresh, onFilterChanged } =
  useDataTable<WorkOrder>({
    loader: (params) => fetchWorkOrders({ ...params, filters: { ...filters } }),
    pageSize: 20,
    sortField: 'id',
    sortOrder: 1,
  })

onMounted(async () => {
  lines.value = await fetchWorkOrderLines()
})

watch(
  () => filters.search,
  () => {
    if (searchTimer) window.clearTimeout(searchTimer)
    searchTimer = window.setTimeout(() => void onFilterChanged(), 250)
  },
)

watch(
  () => [filters.status, filters.line, filters.priority],
  () => void onFilterChanged(),
)

function onPage(event: { page: number; rows: number }): void {
  query.size = event.rows
  void gotoPage(event.page)
}

function resetFilters(): void {
  filters.search = ''
  filters.status = null
  filters.line = null
  filters.priority = null
  void onFilterChanged()
}

function openDetail(order: WorkOrder): void {
  router.push({ name: 'work-order-detail', params: { id: order.id } })
}

function changeStatus(order: WorkOrder, status: WorkOrder['status']): void {
  confirm.require({
    header: 'Change status',
    message: `Set ${order.id} to ${status}?`,
    icon: 'pi pi-question-circle',
    acceptLabel: 'Apply',
    rejectLabel: 'Cancel',
    accept: async () => {
      await setWorkOrderStatus(order.id, status)
      await refresh()
      toast.add({
        severity: 'success',
        summary: 'Status updated',
        detail: `${order.id} → ${status}`,
        life: 2500,
      })
    },
  })
}
</script>

<template>
  <div class="work-orders">
    <PageHeader title="Work orders" subtitle="Production orders, quantities and line assignment">
      <template #actions>
        <Button
          v-if="canEdit"
          icon="pi pi-plus"
          label="New work order"
          size="small"
          @click="dialogVisible = true"
        />
        <Button
          icon="pi pi-refresh"
          label="Refresh"
          size="small"
          severity="secondary"
          outlined
          @click="refresh"
        />
      </template>
    </PageHeader>

    <div class="mes-card filters">
      <IconField class="filters__search">
        <InputIcon class="pi pi-search" />
        <InputText v-model="filters.search" placeholder="Order, product, BOM or workstation" />
      </IconField>

      <Select
        v-model="filters.status"
        :options="statuses"
        placeholder="Status"
        show-clear
        class="filters__select"
      />
      <Select
        v-model="filters.line"
        :options="lines"
        placeholder="Line"
        show-clear
        class="filters__select"
      />
      <Select
        v-model="filters.priority"
        :options="priorities"
        placeholder="Priority"
        show-clear
        class="filters__select"
      />

      <Button
        label="Reset"
        icon="pi pi-filter-slash"
        severity="secondary"
        text
        size="small"
        @click="resetFilters"
      />
    </div>

    <EmptyState
      v-if="error"
      icon="pi pi-exclamation-circle"
      title="Could not load work orders"
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
        :rows-per-page-options="[10, 20, 50, 100]"
        :sort-field="query.sortField"
        :sort-order="query.sortOrder"
        data-key="id"
        size="small"
        striped-rows
        selection-mode="single"
        :row-class="() => 'p-datatable-row-clickable'"
        @page="onPage"
        @sort="applySort"
        @row-select="(event: { data: WorkOrder }) => openDetail(event.data)"
      >
        <Column field="id" header="Order ID" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <span class="mes-mono link">{{ data.id }}</span>
          </template>
        </Column>
        <Column field="product" header="Product" sortable style="min-width: 10rem" />
        <Column field="line" header="Line" sortable style="width: 5.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.line }}</span>
          </template>
        </Column>
        <Column field="workstation" header="Workstation" sortable style="width: 6.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.workstation }}</span>
          </template>
        </Column>
        <Column field="status" header="Status" sortable style="width: 6.5rem">
          <template #body="{ data }">
            <StatusTag :value="data.status" :tone="toneOf(WORK_ORDER_TONES, data.status)" />
          </template>
        </Column>
        <Column field="priority" header="Priority" sortable style="width: 5.5rem">
          <template #body="{ data }">
            <Tag
              :value="data.priority"
              :severity="
                data.priority === 'Urgent'
                  ? 'danger'
                  : data.priority === 'High'
                    ? 'warn'
                    : 'secondary'
              "
            />
          </template>
        </Column>
        <Column field="completedQty" header="Progress" sortable style="width: 9rem">
          <template #body="{ data }">
            <div class="meter">
              <ProgressBar
                :value="data.plannedQty ? (data.completedQty / data.plannedQty) * 100 : 0"
                :show-value="false"
              />
              <span class="mes-mono">
                {{ formatQty(data.completedQty) }}/{{ formatQty(data.plannedQty) }}
              </span>
            </div>
          </template>
        </Column>
        <Column field="scrapQty" header="Scrap" sortable style="width: 4.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.scrapQty }}</span>
          </template>
        </Column>
        <Column field="dueAt" header="Due" sortable style="width: 7.5rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatCompactDateTime(data.dueAt) }}</span>
          </template>
        </Column>
        <Column style="width: 5rem">
          <template #body="{ data }">
            <div class="row-actions">
              <Button
                icon="pi pi-eye"
                severity="secondary"
                text
                size="small"
                aria-label="Open work order"
                @click.stop="openDetail(data)"
              />
              <Button
                v-if="canEdit && data.status === 'Queued'"
                icon="pi pi-play"
                severity="secondary"
                text
                size="small"
                aria-label="Start work order"
                @click.stop="changeStatus(data, 'Running')"
              />
              <Button
                v-if="canEdit && data.status === 'Running'"
                icon="pi pi-pause"
                severity="secondary"
                text
                size="small"
                aria-label="Pause work order"
                @click.stop="changeStatus(data, 'Paused')"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <WorkOrderDialog v-model:visible="dialogVisible" :lines="lines" @saved="refresh" />
  </div>
</template>

<style scoped>
.work-orders {
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
  min-width: 12rem;
}

.filters__select {
  min-width: 9rem;
}

.meter {
  display: grid;
  grid-template-columns: 1fr 5.2rem;
  align-items: center;
  gap: 0.35rem;
}

.meter :deep(.p-progressbar) {
  height: 6px;
  background: var(--mes-surface-sunken);
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.link {
  color: var(--mes-accent);
  font-weight: 600;
}
</style>
