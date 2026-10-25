<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import type { FileUploadSelectEvent } from 'primevue/fileupload'
import { importAssignments } from '../services/lineassignments.service'
import { parseAssignmentCsv } from '../utils/csv'
import type { ImportedRow, LineAssignment, ParsedCsv } from '../types'

const props = defineProps<{
  visible: boolean
  /** Current store contents, used to flag assignments that already exist. */
  existing: LineAssignment[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  imported: []
}>()

const toast = useToast()

const uploadKey = ref(0)

const fileName = ref<string | null>(null)
const parsed = ref<ParsedCsv | null>(null)

const visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
})

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      fileName.value = null
      parsed.value = null
      uploadKey.value += 1
    }
  },
)

const rows = computed(() => parsed.value?.rows ?? [])
const readyRows = computed(() => rows.value.filter((row) => row.status === 'ready'))
const invalidCount = computed(() => rows.value.filter((row) => row.status === 'invalid').length)
const duplicateCount = computed(() => rows.value.filter((row) => row.status === 'duplicate').length)
const existsCount = computed(() => rows.value.filter((row) => row.status === 'exists').length)
const issuesCount = computed(() => invalidCount.value + duplicateCount.value + existsCount.value)

const canConfirm = computed(() => readyRows.value.length > 0)
const confirmLabel = computed(() =>
  readyRows.value.length === 1
    ? 'Import 1 assignment'
    : `Import ${readyRows.value.length} assignments`,
)

function summarySeverity(): 'info' | 'success' | 'warn' {
  return issuesCount.value > 0 ? 'warn' : readyRows.value.length > 0 ? 'success' : 'info'
}

function severityText(): string {
  if (!parsed.value) return ''
  if (readyRows.value.length === 0) return 'No importable rows found.'
  const parts = [`${readyRows.value.length} ready to import`]
  if (invalidCount.value) parts.push(`${invalidCount.value} invalid (skipped)`)
  if (duplicateCount.value) parts.push(`${duplicateCount.value} duplicates (skipped)`)
  if (existsCount.value) parts.push(`${existsCount.value} already assigned (left unchanged)`)
  return parts.join(' · ')
}

function isRowAlert(row: ImportedRow): boolean {
  return row.status === 'invalid' || row.status === 'duplicate'
}

function alertClass(row: ImportedRow): string {
  return row.status === 'invalid' ? 'csv-invalid' : 'csv-warn'
}

function statusLabel(row: ImportedRow): string {
  return row.status === 'ready'
    ? 'Ready'
    : row.status === 'exists'
      ? 'Exists'
      : row.status === 'duplicate'
        ? 'Duplicate'
        : 'Invalid'
}

async function onSelect(event: FileUploadSelectEvent): Promise<void> {
  const file = event.files[0]
  if (!file) return

  fileName.value = file.name

  const text = await file.text()
  const result = parseAssignmentCsv(text)

  if (!result.fatalError) {
    for (const row of result.rows) {
      if (row.status !== 'ready') continue
      const clash = props.existing.some(
        (assignment) =>
          assignment.lineId.toLowerCase() === row.lineId.toLowerCase() &&
          assignment.productId.toLowerCase() === row.productId.toLowerCase(),
      )
      if (clash) {
        row.status = 'exists'
        row.message = 'Already assigned to this line - will be left unchanged.'
      }
    }
  }

  parsed.value = result
}

function cancel(): void {
  parsed.value = null
  fileName.value = null
  visible.value = false
}

async function confirm(): Promise<void> {
  if (!canConfirm.value) return

  const result = await importAssignments(
    readyRows.value.map((row) => ({
      lineId: row.lineId,
      productId: row.productId,
      productName: row.productName,
      plannedQty: row.plannedQty ?? 0,
    })),
  )

  toast.add({
    severity: 'success',
    summary: 'Import complete',
    detail: `${result.imported} assignment${result.imported === 1 ? '' : 's'} added${
      result.keptExisting ? `, ${result.keptExisting} existing left unchanged` : ''
    }.`,
    life: 4000,
  })

  emit('imported')
  cancel()
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Import line assignments"
    :style="{ width: 'min(46rem, 94vw)' }"
    :dismissable-mask="true"
    @hide="cancel"
  >
    <template #header>
      <div class="import-dialog__header">
        <span class="import-dialog__title">Import line assignments</span>
        <span class="mes-muted">CSV with columns: lineId, productId, productName, plannedQty</span>
      </div>
    </template>

    <div class="import-dialog__body">
      <FileUpload
        :key="uploadKey"
        mode="basic"
        custom-upload
        auto
        accept=".csv,text/csv"
        choose-label="Choose CSV file"
        :max-file-size="1_000_000"
        invalid-file-size-message="File larger than 1 MB."
        :show-upload-button="false"
        @select="onSelect"
      >
        <template #empty>
          <p class="mes-faint">Select a .csv file to preview its records before importing.</p>
        </template>
      </FileUpload>

      <p v-if="fileName" class="import-dialog__file mes-mono">{{ fileName }}</p>

      <Message
        v-if="parsed?.fatalError"
        severity="error"
        :closable="false"
        class="import-dialog__banner"
      >
        {{ parsed.fatalError }} No records were parsed.
      </Message>

      <template v-if="parsed && !parsed.fatalError">
        <Message
          v-if="readyRows.length === 0"
          severity="warn"
          :closable="false"
          class="import-dialog__banner"
        >
          No importable rows found. Nothing will be added.
        </Message>
        <Message
          v-else
          :severity="summarySeverity()"
          :closable="false"
          class="import-dialog__banner"
        >
          {{ severityText() }}
        </Message>

        <div class="import-dialog__table">
          <DataTable :value="parsed.rows" size="small" striped-rows data-key="rowNumber">
            <Column field="rowNumber" header="Row" style="width: 4rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.rowNumber }}</span>
              </template>
            </Column>
            <Column field="lineId" header="Line" style="width: 7.5rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.lineId || '—' }}</span>
              </template>
            </Column>
            <Column field="productId" header="Product ID" style="width: 8rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.productId || '—' }}</span>
              </template>
            </Column>
            <Column field="productName" header="Product Name">
              <template #body="{ data }">
                {{ data.productName || '—' }}
              </template>
            </Column>
            <Column field="plannedQty" header="Qty" style="width: 5rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.plannedQty ?? '—' }}</span>
              </template>
            </Column>
            <Column field="status" header="Status" style="width: 15rem">
              <template #body="{ data }">
                <span :class="isRowAlert(data) ? alertClass(data) : ''">
                  {{ statusLabel(data)
                  }}<template v-if="data.message"> · {{ data.message }}</template>
                </span>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </div>

    <template #footer>
      <Button label="Cancel" severity="secondary" text @click="cancel" />
      <Button
        :label="confirmLabel"
        icon="pi pi-upload"
        severity="primary"
        :disabled="!canConfirm"
        @click="confirm"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.import-dialog__header {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.import-dialog__title {
  font-size: 1.05rem;
  font-weight: 650;
}

.import-dialog__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.import-dialog__file {
  margin: 0;
}

.import-dialog__banner {
  width: 100%;
}

.import-dialog__table {
  max-height: 22rem;
  overflow: auto;
  border: 1px solid var(--mes-border);
  border-radius: var(--mes-radius);
}

.csv-invalid {
  color: var(--mes-alarm);
}

.csv-warn {
  color: var(--mes-warn);
}
</style>
