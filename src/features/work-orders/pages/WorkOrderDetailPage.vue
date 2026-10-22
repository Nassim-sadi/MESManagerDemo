<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatusTag from '@/components/shared/StatusTag.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import {
  fetchWorkOrder,
  fetchWorkOrderLots,
  fetchWorkOrderOperations,
  setWorkOrderStatus,
} from '../services/work-orders.service'
import type { MaterialLot, TravelerStep, WorkOrder } from '@/types/mes'
import { WORK_ORDER_TONES } from '@/utils/status'
import { formatDateTime, formatNumber } from '@/utils/format'
import { useAuthStore } from '@/stores/auth.store'
import { PERMISSIONS } from '@/types/permissions'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const canEdit = auth.hasPermission(PERMISSIONS.workOrdersEdit)

const order = ref<WorkOrder | null>(null)
const operations = ref<TravelerStep[]>([])
const lots = ref<MaterialLot[]>([])
const loading = ref(true)

const progress = computed(() =>
  order.value?.plannedQty ? (order.value.completedQty / order.value.plannedQty) * 100 : 0,
)

async function load(id: string): Promise<void> {
  loading.value = true
  try {
    const [orderData, operationData, lotData] = await Promise.all([
      fetchWorkOrder(id),
      fetchWorkOrderOperations(id),
      fetchWorkOrderLots(id),
    ])
    order.value = orderData
    operations.value = operationData
    lots.value = lotData
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

async function changeStatus(status: WorkOrder['status']): Promise<void> {
  if (!order.value) return
  await setWorkOrderStatus(order.value.id, status)
  await load(order.value.id)
  toast.add({
    severity: 'success',
    summary: 'Status updated',
    detail: `${order.value.id} → ${status}`,
    life: 2500,
  })
}
</script>

<template>
  <div class="detail">
    <PageHeader
      :title="order ? order.id : 'Work order'"
      :subtitle="order ? `${order.product} · ${order.line} · ${order.workstation}` : ''"
    >
      <template #actions>
        <Button
          icon="pi pi-arrow-left"
          label="Back"
          size="small"
          severity="secondary"
          text
          @click="router.push({ name: 'work-orders-list' })"
        />
        <Button
          v-if="canEdit && order?.status === 'Queued'"
          label="Start"
          icon="pi pi-play"
          size="small"
          @click="changeStatus('Running')"
        />
        <Button
          v-if="canEdit && order?.status === 'Running'"
          label="Pause"
          icon="pi pi-pause"
          size="small"
          severity="secondary"
          @click="changeStatus('Paused')"
        />
        <Button
          v-if="canEdit && order?.status !== 'Completed'"
          label="Complete"
          icon="pi pi-check"
          size="small"
          severity="secondary"
          outlined
          @click="changeStatus('Completed')"
        />
      </template>
    </PageHeader>

    <EmptyState
      v-if="!loading && !order"
      icon="pi pi-times-circle"
      title="Work order not found"
      message="The requested work order does not exist."
    />

    <template v-else-if="order">
      <section class="mes-card summary">
        <div class="summary__status">
          <span class="mes-eyebrow">Status</span>
          <StatusTag :value="order.status" :tone="WORK_ORDER_TONES[order.status]" />
        </div>

        <div class="summary__progress">
          <div class="summary__progress-head">
            <span class="mes-eyebrow">Production progress</span>
            <span class="mes-mono">
              {{ formatNumber(order.completedQty) }} / {{ formatNumber(order.plannedQty) }} pcs
            </span>
          </div>
          <ProgressBar :value="progress" :show-value="false" />
        </div>

        <dl class="summary__grid">
          <div>
            <dt>Product</dt>
            <dd>{{ order.product }}</dd>
          </div>
          <div>
            <dt>BOM</dt>
            <dd class="mes-mono">{{ order.bom }}</dd>
          </div>
          <div>
            <dt>Line</dt>
            <dd class="mes-mono">{{ order.line }}</dd>
          </div>
          <div>
            <dt>Workstation</dt>
            <dd class="mes-mono">{{ order.workstation }}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>
              <Tag
                :value="order.priority"
                :severity="
                  order.priority === 'Urgent'
                    ? 'danger'
                    : order.priority === 'High'
                      ? 'warn'
                      : 'secondary'
                "
              />
            </dd>
          </div>
          <div>
            <dt>Operator</dt>
            <dd>{{ order.operator }}</dd>
          </div>
          <div>
            <dt>Due</dt>
            <dd class="mes-mono">{{ formatDateTime(order.dueAt) }}</dd>
          </div>
          <div>
            <dt>Started</dt>
            <dd class="mes-mono">{{ formatDateTime(order.startedAt) }}</dd>
          </div>
          <div>
            <dt>Scrap</dt>
            <dd class="mes-mono">{{ order.scrapQty }} pcs</dd>
          </div>
        </dl>
      </section>

      <section class="mes-card">
        <Tabs value="operations">
          <TabList>
            <Tab value="operations">Routing</Tab>
            <Tab value="materials">Materials</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="operations">
              <DataTable :value="operations" size="small" striped-rows>
                <Column field="seq" header="Step" style="width: 5rem">
                  <template #body="{ data }">
                    <span class="mes-mono">{{ data.seq }}</span>
                  </template>
                </Column>
                <Column field="operation" header="Operation" />
                <Column field="station" header="Station" style="width: 8rem">
                  <template #body="{ data }">
                    <span class="mes-mono">{{ data.station }}</span>
                  </template>
                </Column>
                <Column field="machine" header="Machine" style="width: 9rem" />
                <Column field="operator" header="Operator" style="width: 9rem" />
                <Column field="endedAt" header="Finished" style="width: 10rem">
                  <template #body="{ data }">
                    <span class="mes-mono">{{ formatDateTime(data.endedAt) }}</span>
                  </template>
                </Column>
                <Column field="result" header="Result" style="width: 7rem">
                  <template #body="{ data }">
                    <Tag
                      :value="data.result"
                      :severity="
                        data.result === 'Pass'
                          ? 'success'
                          : data.result === 'Fail'
                            ? 'danger'
                            : 'warn'
                      "
                    />
                  </template>
                </Column>
              </DataTable>
            </TabPanel>

            <TabPanel value="materials">
              <DataTable :value="lots" size="small" striped-rows>
                <Column field="material" header="Material">
                  <template #body="{ data }">
                    <span class="mes-mono">{{ data.material }}</span>
                  </template>
                </Column>
                <Column field="lot" header="Lot">
                  <template #body="{ data }">
                    <span class="mes-mono">{{ data.lot }}</span>
                  </template>
                </Column>
                <Column field="quantity" header="Quantity" style="width: 8rem">
                  <template #body="{ data }">
                    <span class="mes-mono">{{ data.quantity }}</span>
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>
    </template>
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary {
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 0.9rem;
  padding: 0.85rem;
}

.summary__status {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
}

.summary__progress {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.summary__progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary__progress :deep(.p-progressbar) {
  height: 8px;
  background: var(--mes-surface-sunken);
}

.summary__grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem 0.75rem;
  margin: 0;
  padding-top: 0.6rem;
  border-top: 1px solid var(--mes-border);
}

.summary__grid dt {
  font-size: 0.625rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--mes-text-faint);
}

.summary__grid dd {
  margin: 0.1rem 0 0;
  font-size: 0.8125rem;
}
</style>
