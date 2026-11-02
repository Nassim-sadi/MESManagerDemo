<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Message from 'primevue/message'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { useDataTable } from '@/composables/useDataTable'
import {
  fetchSerialUnits,
  searchSerial,
} from '@/features/traceability/services/traceability.service'
import type { TraceabilityResult } from '@/features/traceability/types'
import type { SerialUnit } from '@/types/mes'
import { formatCompactDateTime } from '@/utils/format'
import Code39Barcode from '../components/Code39Barcode.vue'

const serialInput = ref('')
const label = ref<TraceabilityResult['unit'] | null>(null)
const loading = ref(false)
const notFound = ref(false)
const { items, loading: listLoading } = useDataTable<SerialUnit>({
  loader: (params) => fetchSerialUnits(params),
  pageSize: 8,
  sortField: 'sn',
  sortOrder: 1,
})

async function lookup(value = serialInput.value): Promise<void> {
  const serial = value.trim().toUpperCase()
  if (!serial) return
  serialInput.value = serial
  loading.value = true
  notFound.value = false
  label.value = null
  try {
    const result = await searchSerial(serial)
    if (result) label.value = result.unit
    else notFound.value = true
  } finally {
    loading.value = false
  }
}

function selectSerial(unit: SerialUnit): void {
  void lookup(unit.sn)
}

function clearLookup(): void {
  label.value = null
  serialInput.value = ''
  notFound.value = false
}

function printLabel(): void {
  if (!label.value) return
  document.body.dataset.barcodePrint = 'true'
  window.removeEventListener('afterprint', finishPrint)
  window.addEventListener('afterprint', finishPrint, { once: true })
  window.print()
}

function finishPrint(): void {
  delete document.body.dataset.barcodePrint
}

onUnmounted(() => {
  window.removeEventListener('afterprint', finishPrint)
  delete document.body.dataset.barcodePrint
})
</script>

<template>
  <div class="print-barcode">
    <PageHeader
      title="Print & Barcode"
      subtitle="Look up a serial number, preview its label and print from this browser"
    />

    <div class="mes-card lookup">
      <IconField class="lookup__field">
        <InputIcon class="pi pi-barcode" />
        <InputText
          v-model="serialInput"
          placeholder="Scan or enter a serial number"
          autofocus
          @keyup.enter="lookup()"
        />
      </IconField>
      <Button label="Find serial" icon="pi pi-search" :loading="loading" @click="lookup()" />
      <Button label="Clear" icon="pi pi-times" text severity="secondary" @click="clearLookup" />
    </div>

    <Message v-if="notFound" severity="warn" :closable="false"
      >Serial {{ serialInput }} was not found in the demo records.</Message
    >

    <div class="content-grid">
      <section class="mes-card serial-list">
        <header class="mes-card__header">
          <span class="mes-card__title">Recent demo serials</span>
          <span class="mes-eyebrow">Select a row to preview its label</span>
        </header>
        <EmptyState
          v-if="!listLoading && items.length === 0"
          icon="pi pi-inbox"
          title="No serial numbers available"
        />
        <DataTable
          v-else
          :value="items"
          :loading="listLoading"
          paginator
          :rows="8"
          :rows-per-page-options="[8, 16, 32]"
          size="small"
          striped-rows
          scrollable
          data-key="sn"
          selection-mode="single"
          :row-class="() => 'p-datatable-row-clickable'"
          @row-select="(event: { data: SerialUnit }) => selectSerial(event.data)"
        >
          <Column field="sn" header="Serial number" sortable
            ><template #body="{ data }"
              ><span class="mes-mono">{{ data.sn }}</span></template
            ></Column
          >
          <Column field="product" header="Product" sortable />
          <Column field="workOrderId" header="Work order" sortable
            ><template #body="{ data }"
              ><span class="mes-mono">{{ data.workOrderId }}</span></template
            ></Column
          >
          <Column field="line" header="Line" sortable
            ><template #body="{ data }"
              ><span class="mes-mono">{{ data.line }}</span></template
            ></Column
          >
        </DataTable>
      </section>

      <section class="mes-card preview-card">
        <header class="mes-card__header">
          <span class="mes-card__title">Label preview</span>
          <Button
            label="Print label"
            icon="pi pi-print"
            size="small"
            :disabled="!label"
            @click="printLabel"
          />
        </header>
        <article v-if="label" class="label">
          <div class="label__brand">MES MANAGER <span>PRODUCT SERIAL</span></div>
          <div class="label__product">{{ label.product }}</div>
          <Code39Barcode :value="label.sn" />
          <div class="label__serial">{{ label.sn }}</div>
          <dl class="label__details">
            <div>
              <dt>Work order</dt>
              <dd>{{ label.workOrderId }}</dd>
            </div>
            <div>
              <dt>Line</dt>
              <dd>{{ label.line }}</dd>
            </div>
            <div>
              <dt>Produced</dt>
              <dd>{{ formatCompactDateTime(label.producedAt) }}</dd>
            </div>
          </dl>
        </article>
        <EmptyState
          v-else
          icon="pi pi-barcode"
          title="No label selected"
          message="Scan a serial number or choose one from the list."
        />
      </section>
    </div>

    <article v-if="label" class="print-label" aria-hidden="true">
      <div class="label__brand">MES MANAGER <span>PRODUCT SERIAL</span></div>
      <div class="label__product">{{ label.product }}</div>
      <Code39Barcode :value="label.sn" />
      <div class="label__serial">{{ label.sn }}</div>
      <dl class="label__details">
        <div>
          <dt>Work order</dt>
          <dd>{{ label.workOrderId }}</dd>
        </div>
        <div>
          <dt>Line</dt>
          <dd>{{ label.line }}</dd>
        </div>
        <div>
          <dt>Produced</dt>
          <dd>{{ formatCompactDateTime(label.producedAt) }}</dd>
        </div>
      </dl>
    </article>
  </div>
</template>

<style scoped>
.print-barcode {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lookup {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem;
}

.lookup__field {
  flex: 1 1 18rem;
}

.lookup__field :deep(.p-inputtext) {
  width: 100%;
  font-family: var(--mes-font-mono);
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(19rem, 0.75fr);
  align-items: start;
  gap: 0.75rem;
}

.preview-card {
  padding: 0.9rem;
}

.label {
  width: min(100%, 26rem);
  padding: 1rem;
  border: 1px solid #c8cdd2;
  border-radius: 0.35rem;
  background: #fff;
  color: #111;
}

.label__brand {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.label__brand span {
  font-size: 0.55rem;
  font-weight: 600;
}

.label__product {
  margin: 0.7rem 0;
  font-size: 0.85rem;
  font-weight: 700;
}

.label__serial {
  margin-top: 0.2rem;
  text-align: center;
  font-family: var(--mes-font-mono);
  font-size: 0.95rem;
  letter-spacing: 0.12em;
}

.label__details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  margin: 0.8rem 0 0;
  padding-top: 0.6rem;
  border-top: 1px solid #d9dde1;
}

.label__details div:last-child {
  grid-column: 1 / -1;
}

.label__details dt {
  color: #666;
  font-size: 0.6rem;
  text-transform: uppercase;
}

.label__details dd {
  margin: 0.15rem 0 0;
  font-family: var(--mes-font-mono);
  font-size: 0.72rem;
}

.serial-list {
  overflow: hidden;
}

.print-label {
  display: none;
}

@media (max-width: 960px) {
  .content-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

<style>
@media print {
  body[data-barcode-print] #app * {
    visibility: hidden !important;
  }

  body[data-barcode-print] #app .print-label,
  body[data-barcode-print] #app .print-label * {
    visibility: visible !important;
  }

  body[data-barcode-print] #app .print-label {
    display: block;
    position: absolute;
    inset: 0 auto auto 0;
    width: 80mm;
    padding: 4mm;
    background: white;
    color: black;
  }

  @page {
    margin: 0;
  }
}
</style>
