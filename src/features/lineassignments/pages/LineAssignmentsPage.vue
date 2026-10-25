<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import EmptyState from '@/components/shared/EmptyState.vue'
import StatusTag from '@/components/shared/StatusTag.vue'
import PageHeader from '@/components/shared/PageHeader.vue'
import { LINE_TONES, type StatusTone } from '@/utils/status'
import {
  assignmentsOfLine,
  fetchAssignments,
  fetchLines,
} from '../services/lineassignments.service'
import type { LineAssignment, LineRecord } from '../types'
import ImportAssignmentsDialog from '../components/ImportAssignmentsDialog.vue'
import PrintDocument from '../components/PrintDocument.vue'
import { formatNumber } from '@/utils/format'

type PrintMode = 'lines' | 'assignments'

const lines = ref<LineRecord[]>([])
const assignments = ref<LineAssignment[]>([])
const selectedLine = ref<LineRecord | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const importVisible = ref(false)

const linesTable = ref<InstanceType<typeof DataTable> | null>(null)
const assignmentsTable = ref<InstanceType<typeof DataTable> | null>(null)

const printMode = ref<PrintMode | null>(null)

const lineAssignments = computed(() =>
  selectedLine.value ? assignmentsOfLine(assignments.value, selectedLine.value.id) : [],
)

const printAssignments = computed(() =>
  printMode.value === 'assignments' ? lineAssignments.value : [],
)

const statusTone = (row: LineRecord): StatusTone => LINE_TONES[row.status] ?? 'idle'

onMounted(async () => {
  window.addEventListener('afterprint', onAfterPrint)

  try {
    const [lineData, assignmentData] = await Promise.all([fetchLines(), fetchAssignments()])
    lines.value = lineData
    assignments.value = assignmentData
    selectedLine.value = lineData[0] ?? null
  } catch (cause) {
    error.value = 'Data could not be loaded.'
    console.error(cause)
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('afterprint', onAfterPrint)
})

/** Printing renders the hidden print document instead of the app shell. */
async function print(mode: PrintMode): Promise<void> {
  printMode.value = mode
  document.body.dataset.print = mode
  await nextTick()
  window.print()
}

function onAfterPrint(): void {
  printMode.value = null
  delete document.body.dataset.print
}

async function onImported(): Promise<void> {
  try {
    const refreshed = await fetchAssignments()
    assignments.value = refreshed
    const stillThere = selectedLine.value
      ? lines.value.some((line) => line.id === selectedLine.value?.id)
      : true
    if (!stillThere) selectedLine.value = lines.value[0] ?? null
  } catch (cause) {
    console.error(cause)
  }
}
</script>

<template>
  <div class="line-assignments">
    <PageHeader
      title="Line Assignments"
      subtitle="Select a production line to review and manage its assigned products"
    >
      <template #actions>
        <Button
          label="Import assignments"
          icon="pi pi-upload"
          severity="primary"
          size="small"
          @click="importVisible = true"
        />
      </template>
    </PageHeader>

    <EmptyState
      v-if="error"
      icon="pi pi-exclamation-circle"
      title="Could not load data"
      :message="error"
    />

    <template v-else>
      <div class="line-assignments__grid">
        <div class="mes-card line-assignments__master">
          <div class="mes-card__header">
            <span class="mes-card__title">Production Lines</span>
            <div class="mes-card__actions">
              <Button
                label="Export CSV"
                icon="pi pi-download"
                severity="primary"
                outlined
                size="small"
                :disabled="lines.length === 0"
                @click="linesTable?.exportCSV()"
              />
              <Button
                label="Print"
                icon="pi pi-print"
                severity="primary"
                outlined
                size="small"
                :disabled="lines.length === 0"
                @click="print('lines')"
              />
            </div>
          </div>

          <DataTable
            ref="linesTable"
            :value="lines"
            :loading="loading"
            data-key="id"
            v-model:selection="selectedLine"
            selection-mode="single"
            :meta-key-selection="false"
            export-filename="production-lines"
            striped-rows
            size="small"
            scrollable
            scroll-height="24rem"
          >
            <Column selection-mode="single" style="width: 3.5rem" />
            <Column field="id" header="Line" sortable style="width: 8.5rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.id }}</span>
              </template>
            </Column>
            <Column field="name" header="Name" sortable />
            <Column field="area" header="Area" sortable style="width: 10rem" />
            <Column field="status" header="Status" sortable style="width: 9rem">
              <template #body="{ data }">
                <StatusTag :value="data.status" :tone="statusTone(data)" />
              </template>
            </Column>
          </DataTable>
        </div>

        <div class="mes-card line-assignments__detail">
          <div class="mes-card__header">
            <span class="mes-card__title">
              Assigned Products
              <span v-if="selectedLine" class="mes-muted">
                — {{ selectedLine.name }} ({{ selectedLine.id }})</span
              >
            </span>
            <div class="mes-card__actions">
              <Button
                label="Export CSV"
                icon="pi pi-download"
                severity="primary"
                outlined
                size="small"
                :disabled="lineAssignments.length === 0"
                @click="assignmentsTable?.exportCSV()"
              />
              <Button
                label="Print"
                icon="pi pi-print"
                severity="primary"
                outlined
                size="small"
                :disabled="!selectedLine || lineAssignments.length === 0"
                @click="print('assignments')"
              />
            </div>
          </div>

          <EmptyState
            v-if="!selectedLine"
            icon="pi-arrow-circle-down"
            title="No line selected"
            message="Select a production line on the left to show its assigned products."
          />
          <EmptyState
            v-else-if="lineAssignments.length === 0"
            icon="pi pi-inbox"
            :title="`No assignments for ${selectedLine.name}`"
            message="This line currently has no assigned products. Import a CSV to add assignments."
          />
          <DataTable
            v-else
            ref="assignmentsTable"
            :value="lineAssignments"
            data-key="id"
            export-filename="line-assignments"
            size="small"
            striped-rows
          >
            <Column field="lineId" header="Line ID" sortable style="width: 8rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.lineId }}</span>
              </template>
            </Column>
            <Column field="productId" header="Product ID" sortable style="width: 9.5rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.productId }}</span>
              </template>
            </Column>
            <Column field="productName" header="Product Name" sortable />
            <Column field="plannedQty" header="Planned Qty" sortable style="width: 9.5rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ formatNumber(data.plannedQty) }}</span>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </template>

    <ImportAssignmentsDialog
      v-model:visible="importVisible"
      :existing="assignments"
      @imported="onImported"
    />

    <PrintDocument
      v-if="printMode"
      :mode="printMode"
      :lines="lines"
      :assignments="printAssignments"
      :selected-line="selectedLine"
    />
  </div>
</template>

<style scoped>
.line-assignments {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Master table left, assignments right; stacks vertically on small screens. */
.line-assignments__grid {
  display: grid;
  grid-template-columns:
    minmax(18rem, 2fr)
    minmax(22rem, 3fr);
  align-items: start;
  gap: 0.75rem;
}

@media (max-width: 64rem) {
  .line-assignments__grid {
    grid-template-columns: 1fr;
  }
}

.line-assignments__master {
  overflow: hidden;
}

.line-assignments__detail {
  overflow: hidden;
}

.mes-card__actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
</style>

<style>
/* Print pass: show only the print document, never the app shell or
   PrimeVue scroll containers. The document is a plain HTML table, so it
   cannot be clipped on paper. */
@media print {
  body[data-print] #app * {
    visibility: hidden !important;
  }

  body[data-print] #app .print-doc,
  body[data-print] #app .print-doc * {
    visibility: visible !important;
  }

  body[data-print] #app .print-doc {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }

  @page {
    margin: 14mm;
  }
}
</style>
