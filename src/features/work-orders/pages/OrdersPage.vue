<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import * as XLSX from 'xlsx'
import PageHeader from '@/components/shared/PageHeader.vue'
import { ORDER_COLUMNS, SAMPLE_ORDERS } from '../types/orders.columns'

const query = ref('')
const line = ref('')
const subline = ref('')
const lockStatus = ref('')
const fromDate = ref<Date | null>(null)
const toDate = ref<Date | null>(null)
const rows = computed(() => SAMPLE_ORDERS.filter((row) => {
  const term = query.value.trim().toLowerCase()
  const matchesText = !term || [row.orderCode, row.supplierNo, row.model].some((value) => value.toLowerCase().includes(term))
  const date = new Date(row.planDate).getTime()
  return matchesText && (!line.value || row.lineName.includes(line.value)) && (!subline.value || row.lineSubName.includes(subline.value))
    && (!lockStatus.value || row.LockStatus.includes(lockStatus.value))
    && (!fromDate.value || date >= day(fromDate.value)) && (!toDate.value || date <= day(toDate.value))
}))
function day(value: Date): number { return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime() }
function exportExcel(): void {
  const worksheet = XLSX.utils.json_to_sheet(rows.value, { header: ORDER_COLUMNS.map(({ field }) => field) })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders')
  XLSX.writeFile(workbook, 'orders-sample.xlsx')
}
</script>

<template>
  <div class="orders-page">
    <PageHeader title="Orders" subtitle="Order list fields from Frm_OrderListWh.">
      <template #actions><Tag value="Sample data" severity="info" /><Button label="Export Excel" icon="pi pi-download" size="small" severity="secondary" outlined @click="exportExcel" /></template>
    </PageHeader>
    <section class="mes-card filters">
      <InputText v-model="query" placeholder="orderCode / supplierNo / model" aria-label="Order, supplier or model" />
      <InputText v-model="line" placeholder="line" aria-label="line" />
      <InputText v-model="subline" placeholder="subline" aria-label="subline" />
      <InputText v-model="lockStatus" placeholder="LockStatus" aria-label="LockStatus" />
      <DatePicker v-model="fromDate" placeholder="Plan date from" show-icon />
      <DatePicker v-model="toDate" placeholder="Plan date to" show-icon />
      <Button label="Reset" severity="secondary" text size="small" @click="query = ''; line = ''; subline = ''; lockStatus = ''; fromDate = null; toDate = null" />
    </section>
    <section class="mes-card table-card"><DataTable :value="rows" size="small" paginator :rows="10" responsive-layout="scroll"><Column v-for="column in ORDER_COLUMNS" :key="column.field" :field="column.field" :header="column.header" /></DataTable></section>
  </div>
</template>

<style scoped>
.orders-page { display: flex; flex-direction: column; gap: .8rem; }.filters { display: flex; gap: .6rem; flex-wrap: wrap; padding: .8rem 1rem; }.filters :deep(.p-inputtext), .filters :deep(.p-datepicker) { min-width: 12rem; }.table-card { overflow: auto; }
</style>
