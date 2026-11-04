<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import FileUpload from 'primevue/fileupload'
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import Tag from 'primevue/tag'
import * as XLSX from 'xlsx'
import PageHeader from '@/components/shared/PageHeader.vue'
import { BOM_COLUMNS, BOM_IMPORT_SHEET, BOM_SAMPLE_ROWS, type BomRow } from '../types/bom.columns'

const rows = ref<BomRow[]>(BOM_SAMPLE_ROWS.map((row) => ({ ...row })))
const message = ref('')

function downloadTemplate(): void {
  const worksheet = XLSX.utils.json_to_sheet(BOM_SAMPLE_ROWS, { header: BOM_COLUMNS.map(({ field }) => field) })
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, worksheet, BOM_IMPORT_SHEET)
  XLSX.writeFile(book, 'BOMList.xlsx')
}

async function importWorkbook(event: FileUploadUploaderEvent): Promise<void> {
  const file = Array.isArray(event.files) ? event.files[0] : event.files
  if (!file) return
  try {
    const book = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const sheet = book.Sheets[BOM_IMPORT_SHEET]
    if (!sheet) throw new Error(`Workbook must contain the ${BOM_IMPORT_SHEET} sheet.`)
    const input = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
    const headers = Object.keys(input[0] ?? {})
    if (headers.join('|') !== BOM_COLUMNS.map(({ field }) => field).join('|')) throw new Error('Headers do not match the source BOM import contract.')
    rows.value = input.map((record) => ({ ...record, materialQty: String(record.materialQty ?? '') })) as unknown as BomRow[]
    message.value = `${rows.value.length} rows loaded from ${BOM_IMPORT_SHEET}.`
  } catch (error) {
    message.value = error instanceof Error ? error.message : 'Unable to read workbook.'
  }
}
</script>

<template>
  <div class="bom-page">
    <PageHeader title="BOM import" subtitle="Source columns from Frm_BOMImport.">
      <template #actions>
        <Tag value="Sample data" severity="info" />
      </template>
    </PageHeader>
    <section class="mes-card bom-tools">
      <div><strong>Workbook contract</strong><span>Sheet: {{ BOM_IMPORT_SHEET }} · {{ BOM_COLUMNS.length }} columns</span></div>
      <Button label="Download sample workbook" icon="pi pi-download" size="small" severity="secondary" outlined class="bom-action" @click="downloadTemplate" />
      <FileUpload mode="basic" name="bom" accept=".xlsx,.xls" choose-label="Import workbook" choose-icon="pi pi-upload" :choose-button-props="{ severity: 'secondary', outlined: true, size: 'small' }" :auto="true" custom-upload class="bom-action" @uploader="importWorkbook" />
      <p v-if="message" role="status">{{ message }}</p>
    </section>
    <section class="mes-card bom-table">
      <DataTable :value="rows" size="small" paginator :rows="10" responsive-layout="scroll">
        <Column v-for="column in BOM_COLUMNS" :key="column.field" :field="column.field" :header="column.header" />
      </DataTable>
    </section>
  </div>
</template>

<style scoped>
.bom-page {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.bom-tools {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem;
}

.bom-tools>div {
  display: grid;
  gap: 0.2rem;
  margin-inline-end: auto;
}

.bom-tools :deep(.bom-action),
.bom-tools :deep(.p-fileupload-basic) {
  width: 14rem;
}

.bom-tools :deep(.p-fileupload-basic .p-button) {
  width: 100%;
  min-height: 2.25rem;
  justify-content: center;
}

.bom-tools>.p-button {
  min-height: 2.25rem;
  justify-content: center;
}

.bom-tools span,
.bom-tools p {
  color: var(--mes-text-muted);
  font-size: var(--mes-fs-xs);
}

.bom-tools p {
  flex-basis: 100%;
  margin: 0;
}

.bom-table {
  overflow: auto;
}
</style>
