<script setup lang="ts">
import { computed, ref } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import * as XLSX from 'xlsx'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useAuthStore } from '@/stores/auth.store'
import { SAMPLE_STOCK, STOCK_COLUMNS } from '../types/stock.columns'

const auth = useAuthStore()
const warehouse = ref('')
const model = ref('')
const pallet = ref('')
const box = ref('')
const serial = ref('')
const scoped = computed(() => SAMPLE_STOCK.filter((row) => auth.user?.role === 'admin' || auth.user?.warehouseCodes.includes(row.wareHouseCode)))
const warehouseOptions = computed(() => [...new Set(scoped.value.map((row) => row.wareHouseCode))])
const rows = computed(() => {
  return scoped.value.filter((row) => {
    const sampleSerial = `SN-${String(SAMPLE_STOCK.indexOf(row) + 1).padStart(6, '0')}`
    return (!warehouse.value || row.wareHouseCode === warehouse.value)
      && (!model.value || row.model.toLowerCase().includes(model.value.toLowerCase()))
      && (!pallet.value || row.palletCode.includes(pallet.value))
      && (!box.value || row.boxCode.includes(box.value))
      && (!serial.value || sampleSerial.includes(serial.value))
  })
})
function reset(): void { warehouse.value = ''; model.value = ''; pallet.value = ''; box.value = ''; serial.value = '' }
function exportExcel(): void {
  const worksheet = XLSX.utils.json_to_sheet(rows.value, { header: STOCK_COLUMNS.map(({ field }) => field) })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock')
  XLSX.writeFile(workbook, 'stock-sample.xlsx')
}
</script>

<template>
  <div class="stock-page">
    <PageHeader title="Stock overview" subtitle="Warehouse quantities from Frm_StockListHz, scoped to assigned warehouses.">
      <template #actions>
        <Tag value="Sample data" severity="info" /><Button label="Export Excel" icon="pi pi-download" size="small" severity="secondary" outlined @click="exportExcel" />
      </template>
    </PageHeader>
    <section class="mes-card filters">
      <Select v-model="warehouse" :options="warehouseOptions" placeholder="All warehouses" show-clear aria-label="wareHouseCode" />
      <InputText v-model="model" placeholder="model" aria-label="model" />
      <InputText v-model="pallet" placeholder="palletCode" aria-label="palletCode" />
      <InputText v-model="box" placeholder="boxCode" aria-label="boxCode" />
      <InputText v-model="serial" placeholder="SN" aria-label="SN" />
      <Button label="Reset" severity="secondary" text size="small" @click="reset" />
    </section>
    <section class="mes-card table-card">
      <DataTable :value="rows" size="small" paginator :rows="10" responsive-layout="scroll">
        <Column v-for="column in STOCK_COLUMNS" :key="column.field" :field="column.field" :header="column.header" />
      </DataTable>
    </section>
  </div>
</template>

<style scoped>
.stock-page {
  display: flex;
  flex-direction: column;
  gap: .8rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: .6rem;
  padding: .8rem 1rem;
}

.filters :deep(.p-inputtext),
.filters :deep(.p-select) {
  min-width: 10rem;
}

.table-card {
  overflow: auto;
}
</style>
