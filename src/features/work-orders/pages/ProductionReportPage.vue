<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import FilterCard from '@/components/forms/FilterCard.vue'
import FilterField from '@/components/forms/FilterField.vue'
import { useFilteredList } from '@/composables/useFilteredList'
import { formatNumber } from '@/utils/format'
import {
  exportProductionReportXlsx,
  fetchProductionReport,
} from '../services/production-report.service'
import type { ProductionReportRow } from '../types/production-report'
import { PRODUCTION_REPORT_COLUMNS } from '../types/production-report.columns'

interface ReportFilterState {
  workdateFrom: Date
  workdateTo: Date
  lineSubCode: string | null
  siteCode: string | null
  classesCode: string | null
  orderCode: string
  model: string | null
}

type ClearableFilter = 'lineSubCode' | 'siteCode' | 'classesCode' | 'orderCode' | 'model'

function startOfToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function toIsoDate(value: Date): string {
  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, '0'),
    String(value.getDate()).padStart(2, '0'),
  ].join('-')
}

const today = startOfToday()

const { filters, rows, loading, error, refresh, reset } =
  useFilteredList<ReportFilterState, ProductionReportRow>({
    initialFilters: {
      workdateFrom: today,
      workdateTo: today,
      lineSubCode: null,
      siteCode: null,
      classesCode: null,
      orderCode: '',
      model: null,
    },
    load: async (state) => {
      if (state.workdateTo.getTime() < state.workdateFrom.getTime()) {
        throw new Error('The end date cannot be before the start date.')
      }

      return fetchProductionReport({
        lineSubCode: state.lineSubCode ?? '',
        siteCode: state.siteCode ?? '',
        workdateFrom: toIsoDate(state.workdateFrom),
        workdateTo: toIsoDate(state.workdateTo),
        classesCode: state.classesCode ?? '',
        orderCode: state.orderCode.trim(),
        model: state.model ?? '',
      })
    },
  })

// Reference lists come from the base-data API later; the controls stay
// editable so a code can still be typed in the meantime.
const lineOptions: { label: string; value: string }[] = []
const siteOptions: { label: string; value: string }[] = []
const classesOptions: { label: string; value: string }[] = []
const modelOptions: { label: string; value: string }[] = []

const firstRow = ref(0)

const activeChips = computed<{ key: ClearableFilter; label: string }[]>(() => {
  const chips: { key: ClearableFilter; label: string }[] = []
  if (filters.lineSubCode) chips.push({ key: 'lineSubCode', label: `Line: ${filters.lineSubCode}` })
  if (filters.siteCode) chips.push({ key: 'siteCode', label: `Site: ${filters.siteCode}` })
  if (filters.classesCode) chips.push({ key: 'classesCode', label: `Classes: ${filters.classesCode}` })
  if (filters.orderCode.trim()) chips.push({ key: 'orderCode', label: `Order: ${filters.orderCode.trim()}` })
  if (filters.model) chips.push({ key: 'model', label: `Model: ${filters.model}` })
  return chips
})

const totals = computed(() =>
  rows.value.reduce(
    (sum, row) => ({
      plan: sum.plan + quantity(row.jihuaQty),
      scan: sum.scan + quantity(row.scanQty),
      repair: sum.repair + quantity(row.repairQty),
    }),
    { plan: 0, scan: 0, repair: 0 },
  ),
)

const resultLabel = computed(() =>
  rows.value.length === 1 ? '1 row' : `${rows.value.length} rows`,
)

function quantity(value: string): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function qtyLabel(value: string): string {
  return value.trim() ? formatNumber(quantity(value)) : 'â€”'
}

function clearFilter(key: ClearableFilter): void {
  if (key === 'orderCode') {
    filters.orderCode = ''
    return
  }
  filters[key] = null
}

function onPage(event: { first: number }): void {
  firstRow.value = event.first
}

function exportXlsx(): void {
  if (rows.value.length) exportProductionReportXlsx(rows.value)
}
</script>

<template>
  <div class="report-page">
    <PageHeader
      title="Production report"
      subtitle="Scanned quantities by date, line, site, shift, order and model."
    >
      <template #actions>
        <Button
          label="Export Excel"
          icon="pi pi-download"
          size="small"
          severity="secondary"
          outlined
          :disabled="rows.length === 0"
          @click="exportXlsx"
        />
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          size="small"
          severity="secondary"
          text
          :loading="loading"
          @click="refresh"
        />
      </template>
    </PageHeader>

    <FilterCard
      title="Filters"
      description="Dates default to today. Changes reload the report automatically; Apply reloads immediately."
    >
      <template #actions>
        <Button
          label="Reset"
          icon="pi pi-undo"
          size="small"
          severity="secondary"
          text
          @click="reset"
        />
        <Button
          label="Apply"
          icon="pi pi-search"
          size="small"
          :loading="loading"
          @click="refresh"
        />
      </template>

      <FilterField label="Work date" wide>
        <div class="date-range">
          <DatePicker
            v-model="filters.workdateFrom"
            date-format="yy-mm-dd"
            show-icon
            fluid
            aria-label="Start date"
          />
          <span class="date-range__separator">to</span>
          <DatePicker
            v-model="filters.workdateTo"
            date-format="yy-mm-dd"
            show-icon
            fluid
            aria-label="End date"
          />
        </div>
      </FilterField>

      <FilterField label="Line">
        <Select
          v-model="filters.lineSubCode"
          :options="lineOptions"
          option-label="label"
          option-value="value"
          placeholder="All lines"
          editable
          show-clear
          fluid
        />
      </FilterField>

      <FilterField label="Site">
        <Select
          v-model="filters.siteCode"
          :options="siteOptions"
          option-label="label"
          option-value="value"
          placeholder="All sites"
          editable
          show-clear
          fluid
        />
      </FilterField>

      <FilterField label="Classes">
        <Select
          v-model="filters.classesCode"
          :options="classesOptions"
          option-label="label"
          option-value="value"
          placeholder="All classes"
          editable
          show-clear
          fluid
        />
      </FilterField>

      <FilterField label="Order">
        <InputText v-model="filters.orderCode" placeholder="Order code" fluid />
      </FilterField>

      <FilterField label="Model">
        <Select
          v-model="filters.model"
          :options="modelOptions"
          option-label="label"
          option-value="value"
          placeholder="All models"
          editable
          show-clear
          fluid
        />
      </FilterField>

      <template v-if="activeChips.length" #chips>
        <Chip
          v-for="chip in activeChips"
          :key="chip.key"
          :label="chip.label"
          removable
          @remove="clearFilter(chip.key)"
        />
      </template>
    </FilterCard>

    <Message v-if="error" severity="error" :closable="false" class="report-error">
      {{ error }}
    </Message>

    <section class="mes-card report-table-card">
      <header class="report-table-card__header">
        <div>
          <h2 class="report-table-card__title">Report rows</h2>
          <p class="report-table-card__meta">{{ resultLabel }}</p>
        </div>
        <Tag value="Sample data" severity="info" />
      </header>

      <div class="report-table">
        <DataTable
          :value="rows"
          :loading="loading"
          size="small"
          paginator
          :rows="25"
          :rows-per-page-options="[25, 50, 100]"
          @page="onPage"
        >
          <Column header="#" style="width: 3.25rem">
            <template #body="{ index }">
              <span class="row-index">{{ firstRow + index + 1 }}</span>
            </template>
          </Column>

          <Column v-for="column in PRODUCTION_REPORT_COLUMNS" :key="column.field" :field="column.field" :header="column.header" style="min-width: 7rem" /><template #empty>
            <EmptyState
              icon="pi-chart-bar"
              title="No production records"
              message="No rows match these filters. Try a different date range or clear the filters."
            />
          </template>
        </DataTable>
      </div>

      <footer v-if="rows.length" class="report-summary">
        <span class="report-summary__label">Total</span>
        <dl class="report-summary__items">
          <div>
            <dt>Plan qty</dt>
            <dd class="mes-mono">{{ formatNumber(totals.plan) }}</dd>
          </div>
          <div>
            <dt>Scan qty</dt>
            <dd class="mes-mono">{{ formatNumber(totals.scan) }}</dd>
          </div>
          <div>
            <dt>Repair</dt>
            <dd class="mes-mono">{{ formatNumber(totals.repair) }}</dd>
          </div>
        </dl>
        <span class="report-summary__count">{{ resultLabel }}</span>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.report-page {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.date-range :deep(.p-datepicker) {
  flex: 1 1 0;
  min-width: 0;
}

.date-range__separator {
  flex: 0 0 auto;
  color: var(--mes-text-faint);
  font-size: var(--mes-fs-xs);
}

.report-error {
  margin: 0;
}

.report-table-card {
  overflow: hidden;
}

.report-table-card__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.65rem 0.9rem;
  border-bottom: 1px solid var(--mes-border-soft);
}

.report-table-card__title {
  margin: 0;
  font-size: var(--mes-fs-md);
  font-weight: 650;
}

.report-table-card__meta {
  margin: 0;
  font-size: var(--mes-fs-xs);
  color: var(--mes-text-muted);
}

.report-table-card__source {
  font-family: var(--mes-font-mono);
  font-size: 11px;
  color: var(--mes-text-faint);
}

.report-table {
  max-height: calc(100vh - 23rem);
  overflow: auto;
}

.report-table :deep(.p-datatable-thead > tr > th) {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--mes-surface-header);
  white-space: nowrap;
}

.report-table :deep(.p-datatable-tbody > tr > td) {
  vertical-align: middle;
}

.row-index {
  color: var(--mes-text-faint);
  font-family: var(--mes-font-mono);
  font-size: 12px;
}

.qty {
  display: block;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.report-summary {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.65rem 0.9rem;
  border-top: 1px solid var(--mes-border);
  background: var(--mes-surface-sunken);
}

.report-summary__label {
  font-size: var(--mes-fs-xs);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--mes-text-muted);
}

.report-summary__items {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 0;
}

.report-summary__items div {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.report-summary__items dt {
  font-size: var(--mes-fs-xs);
  color: var(--mes-text-muted);
}

.report-summary__items dd {
  margin: 0;
  font-size: var(--mes-fs-md);
  font-weight: 650;
  color: var(--mes-text-strong);
  font-variant-numeric: tabular-nums;
}

.report-summary__count {
  margin-inline-start: auto;
  font-size: var(--mes-fs-xs);
  color: var(--mes-text-muted);
}

@media (max-width: 720px) {
  .report-summary {
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
  }

  .report-summary__count {
    margin-inline-start: 0;
  }
}
</style>
