<script setup lang="ts">
import { computed, ref, watch, onMounted, onUpdated } from 'vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import PageHeader from '@/components/shared/PageHeader.vue'
import { SN_PRINT_COLUMNS, SN_PRINT_SAMPLE, type SnPrintRow } from '../types/sn-print.columns'
import jsbarcode from 'jsbarcode'

const serialInput = ref('')
const selected = ref<SnPrintRow | null>(SN_PRINT_SAMPLE[0]!)
const message = ref('')
const rows = computed(() => SN_PRINT_SAMPLE.filter((row) => !serialInput.value.trim() || row.sn.includes(serialInput.value.trim())))
const preview = computed(() => selected.value ?? rows.value[0] ?? SN_PRINT_SAMPLE[0]!)


const jsBarcodeSvg = ref<SVGSVGElement | null>(null)

function renderJsBarcode(): void {
  if (!jsBarcodeSvg.value || !preview.value.sn) return

  jsbarcode(jsBarcodeSvg.value, preview.value.sn, {
    format: 'CODE128',
    lineColor: '#172b3e',
    background: '#ffffff',
    width: 2,
    height: 48,
    displayValue: false,
    margin: 0,
  })
}

watch(rows, (currentRows) => {
  if (!currentRows.some((row) => row.sn === selected.value?.sn)) selected.value = currentRows[0] ?? null
})

function lookup(): void {
  selected.value = rows.value[0] ?? null
  message.value = rows.value.length ? '' : 'No sample serial matches that value.'
}

function printLabel2(): void {
  message.value = `Sample label preview for ${preview.value.sn}. BarTender output is not connected in this web demo.`
}

function downloadSvg(): void {
  if (!jsBarcodeSvg.value) return

  const svg = jsBarcodeSvg.value.cloneNode(true) as SVGSVGElement
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const content = new XMLSerializer().serializeToString(svg)
  const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' })

  downloadFile(blob, `${preview.value.sn}.svg`)
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function downloadPng(): void {
  const canvas = document.createElement('canvas')

  jsbarcode(canvas, preview.value.sn, {
    format: 'CODE128',
    lineColor: '#172b3e',
    background: '#ffffff',
    width: 2,
    height: 48,
    displayValue: false,
    margin: 0,
  })

  canvas.toBlob((blob) => {
    if (!blob) {
      message.value = 'Failed to generate PNG.'
      return
    }

    downloadFile(blob, `${preview.value.sn}.png`)
  }, 'image/png')
}

function printLabel(): void {
  if (!jsBarcodeSvg.value) return

  const printWindow = window.open('', '_blank', 'width=600,height=400')

  if (!printWindow) {
    message.value = 'Allow popups to print the label.'
    return
  }

  const doc = printWindow.document

  doc.title = `Print ${preview.value.sn}`

  const style = doc.createElement('style')
  style.textContent = `
    @page {
      size: 60mm 40mm;
      margin: 0;
    }

    body {
      margin: 0;
      padding: 4mm;
      font-family: Arial, sans-serif;
      text-align: center;
    }

    .label {
      width: 52mm;
    }

    svg {
      width: 100%;
      height: auto;
    }

    .sn {
      font-family: monospace;
      font-weight: bold;
      font-size: 12pt;
      margin: 4mm 0;
    }

    .ean {
      font-size: 9pt;
    }
  `

  doc.head.append(style)

  const label = doc.createElement('div')
  label.className = 'label'

  const model = doc.createElement('strong')
  model.textContent = preview.value.model

  const barcode = jsBarcodeSvg.value.cloneNode(true) as SVGSVGElement
  barcode.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  const sn = doc.createElement('div')
  sn.className = 'sn'
  sn.textContent = preview.value.snshow

  const ean = doc.createElement('div')
  ean.className = 'ean'
  ean.textContent = preview.value.EAN

  label.append(model, barcode, sn, ean)
  doc.body.replaceChildren(label)

  printWindow.setTimeout(() => {
    printWindow.print()
  }, 250)
}



onMounted(renderJsBarcode)
onUpdated(renderJsBarcode)
</script>

<template>
  <div class="print-page">
    <PageHeader title="SN print" subtitle="Serial label fields from PrintOrdersnInfo and the orderSN dataset.">
      <template #actions>
        <Tag value="Sample data" severity="info" />
      </template>
    </PageHeader>
    <section class="mes-card lookup-card">
      <label for="sn-lookup">sn</label>
      <InputText id="sn-lookup" v-model="serialInput" placeholder="Enter sample serial" @keyup.enter="lookup" />
      <Button label="Find serial" icon="pi pi-search" size="small" @click="lookup" />
      <Button label="Clear" icon="pi pi-times" severity="secondary" text size="small" @click="serialInput = ''; message = ''" />
    </section>
    <Message v-if="message" :closable="false" severity="info">{{ message }}</Message>
    <div class="print-grid">
      <section class="mes-card table-card">
        <header>
          <h2>Serials</h2><span>{{ rows.length }} rows</span>
        </header>
        <DataTable :value="rows" v-model:selection="selected" selection-mode="single" data-key="sn" size="small" paginator :rows="8">
          <Column v-for="column in SN_PRINT_COLUMNS" :key="column.field" :field="column.field" :header="column.header" />
        </DataTable>
      </section>
      <section class="mes-card preview-card">
        <header>
          <h2>Label preview</h2><span>orderSN.btw fields</span>
        </header>


        <!-- NEW: JsBarcode preview -->
        <h3>JsBarcode</h3>

        <div class="label-preview">
          <strong>{{ preview.model }}</strong>

          <svg ref="jsBarcodeSvg" class="barcode" role="img" :aria-label="preview.sn"></svg>

          <strong class="label-sn">{{ preview.snshow }}</strong>
          <span>{{ preview.EAN }}</span>
        </div>
        <div class="label-actions">
          <!-- <Button label="Download SVG" icon="pi pi-download" size="small" severity="secondary" @click="downloadSvg" />

          <Button label="Download PNG" icon="pi pi-image" size="small" severity="secondary" @click="downloadPng" /> -->

          <Button label="Print label" icon="pi pi-print" size="small" @click="printLabel" />
        </div>

      </section>
    </div>
  </div>
</template>

<style scoped>
.print-page {
  display: flex;
  flex-direction: column;
  gap: .8rem;
}

.lookup-card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: .6rem;
  padding: .8rem 1rem;
}

.lookup-card label {
  font-size: var(--mes-fs-xs);
  color: var(--mes-text-muted);
}

.print-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(18rem, .85fr);
  gap: .8rem;
}

.table-card,
.preview-card {
  min-width: 0;
  padding: .8rem;
}

.table-card header,
.preview-card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: .5rem;
  margin-bottom: .7rem;
}

h2 {
  margin: 0;
  font-size: var(--mes-fs-md);
}

.table-card header span,
.preview-card header span {
  color: var(--mes-text-muted);
  font-size: var(--mes-fs-xs);
}

.label-preview {
  display: grid;
  justify-items: center;
  gap: .7rem;
  min-height: 16rem;
  margin: .5rem 0 1rem;
  padding: 1.5rem;
  border: 1px dashed var(--mes-border);
  background: white;
  color: #172b3e;
}

.barcode {
  width: min(100%, 16rem);
  fill: none;
}

.label-sn {
  letter-spacing: .1em;
  font-family: var(--mes-font-mono);
}

@media (max-width: 800px) {
  .print-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.label-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}
</style>
