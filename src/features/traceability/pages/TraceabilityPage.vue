<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Message from 'primevue/message'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatusTag from '@/components/shared/StatusTag.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { fetchSerialUnits, searchSerial } from '../services/traceability.service'
import type { TraceabilityResult } from '../types'
import { SERIAL_TONES, toneOf } from '@/utils/status'
import { formatCompactDateTime, formatNumber } from '@/utils/format'
import { useDataTable } from '@/composables/useDataTable'
import type { SerialUnit } from '@/types/mes'

const serial = ref('')
const result = ref<TraceabilityResult | null>(null)
const searching = ref(false)
const notFound = ref(false)

const { items, loading } = useDataTable<SerialUnit>({
  loader: (params) => fetchSerialUnits(params),
  pageSize: 8,
  sortField: 'sn',
  sortOrder: 1,
})

async function onSearch(): Promise<void> {
  if (!serial.value.trim()) return

  searching.value = true
  notFound.value = false
  result.value = null

  try {
    const found = await searchSerial(serial.value)
    if (found) {
      result.value = found
    } else {
      notFound.value = true
    }
  } finally {
    searching.value = false
  }
}

function useSerial(unit: SerialUnit): void {
  serial.value = unit.sn
  void onSearch()
}

function clearSearch(): void {
  serial.value = ''
  result.value = null
  notFound.value = false
}
</script>

<template>
  <div class="traceability">
    <PageHeader title="Traceability" subtitle="Follow a serial number through the whole routing" />

    <div class="mes-card search">
      <IconField class="search__field">
        <InputIcon class="pi pi-barcode" />
        <InputText
          v-model="serial"
          placeholder="Serial number, e.g. SN024000000"
          class="search__input"
          @keyup.enter="onSearch"
        />
      </IconField>
      <Button label="Search" icon="pi pi-search" :loading="searching" @click="onSearch" />
      <Button label="Clear" icon="pi pi-times" severity="secondary" text @click="clearSearch" />
    </div>

    <Message v-if="notFound" severity="warn" :closable="false">
      No serial number <strong>{{ serial }}</strong> found. Pick one from the list below.
    </Message>

    <template v-if="result">
      <section class="mes-card unit">
        <header class="mes-card__header">
          <span class="mes-card__title">Serial {{ result.unit.sn }}</span>
          <StatusTag
            :value="result.unit.status"
            :tone="SERIAL_TONES[result.unit.status as keyof typeof SERIAL_TONES] ?? 'idle'"
          />
        </header>
        <dl class="unit__grid">
          <div>
            <dt>Product</dt>
            <dd>{{ result.unit.product }}</dd>
          </div>
          <div>
            <dt>Work order</dt>
            <dd class="mes-mono">{{ result.unit.workOrderId }}</dd>
          </div>
          <div>
            <dt>Line</dt>
            <dd class="mes-mono">{{ result.unit.line }}</dd>
          </div>
          <div>
            <dt>Produced</dt>
            <dd class="mes-mono">{{ formatCompactDateTime(result.unit.producedAt) }}</dd>
          </div>
          <div>
            <dt>Operator</dt>
            <dd>{{ result.unit.operator }}</dd>
          </div>
        </dl>
      </section>

      <div class="columns">
        <section class="mes-card">
          <header class="mes-card__header">
            <span class="mes-card__title">Routing history</span>
          </header>
          <DataTable :value="result.steps" size="small" striped-rows>
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
            <Column field="machine" header="Machine" style="width: 8rem" />
            <Column field="endedAt" header="Finished" style="width: 10rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ formatCompactDateTime(data.endedAt) }}</span>
              </template>
            </Column>
            <Column field="result" header="Result" style="width: 7rem">
              <template #body="{ data }">
                <span
                  class="mes-mono"
                  :class="{
                    'result--ok': data.result === 'Pass',
                    'result--bad': data.result === 'Fail',
                  }"
                >
                  {{ data.result }}
                </span>
              </template>
            </Column>
          </DataTable>
        </section>

        <section class="mes-card">
          <header class="mes-card__header">
            <span class="mes-card__title">Material lots</span>
          </header>
          <DataTable :value="result.lots" size="small" striped-rows>
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
                <span class="mes-mono">{{ formatNumber(data.quantity) }}</span>
              </template>
            </Column>
          </DataTable>
        </section>
      </div>
    </template>

    <section class="mes-card">
      <header class="mes-card__header">
        <span class="mes-card__title">Recent serial numbers</span>
        <span class="mes-eyebrow">click a row to load the traveller</span>
      </header>

      <EmptyState
        v-if="!loading && items.length === 0"
        icon="pi pi-inbox"
        title="No serial numbers available"
      />

      <DataTable
        v-else
        :value="items"
        :loading="loading"
        size="small"
        striped-rows
        :row-class="() => 'p-datatable-row-clickable'"
        @row-select="(event: { data: SerialUnit }) => useSerial(event.data)"
      >
        <Column field="sn" header="Serial" sortable>
          <template #body="{ data }">
            <span class="mes-mono">{{ data.sn }}</span>
          </template>
        </Column>
        <Column field="product" header="Product" sortable />
        <Column field="workOrderId" header="Work order" sortable>
          <template #body="{ data }">
            <span class="mes-mono">{{ data.workOrderId }}</span>
          </template>
        </Column>
        <Column field="line" header="Line" sortable style="width: 7rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ data.line }}</span>
          </template>
        </Column>
        <Column field="status" header="Status" sortable style="width: 9rem">
          <template #body="{ data }">
            <StatusTag :value="data.status" :tone="toneOf(SERIAL_TONES, data.status)" />
          </template>
        </Column>
        <Column field="producedAt" header="Produced" sortable style="width: 10rem">
          <template #body="{ data }">
            <span class="mes-mono">{{ formatCompactDateTime(data.producedAt) }}</span>
          </template>
        </Column>
      </DataTable>
    </section>
  </div>
</template>

<style scoped>
.traceability {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
}

.search__field {
  flex: 1 1 auto;
}

.search__input {
  width: 100%;
  font-family: var(--mes-font-mono);
}

.unit__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem 0.75rem;
  margin: 0;
  padding: 0.75rem 0.9rem;
}

.unit__grid dt {
  font-size: 0.625rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--mes-text-faint);
}

.unit__grid dd {
  margin: 0.1rem 0 0;
  font-size: 0.8125rem;
}

.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 0.75rem;
  align-items: start;
}

.result--ok {
  color: var(--mes-ok);
}

.result--bad {
  color: var(--mes-alarm);
}
</style>
