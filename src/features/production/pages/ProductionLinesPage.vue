<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import PageHeader from '@/components/shared/PageHeader.vue'
import StatusTag from '@/components/shared/StatusTag.vue'
import LineStatusGrid from '../components/LineStatusGrid.vue'
import { fetchLines, fetchStations } from '../services/production.service'
import type { ProductionLine, Station } from '@/types/mes'
import { LINE_TONES, STATION_TONES, toneOf } from '@/utils/status'
import { formatPercent } from '@/utils/format'

const router = useRouter()

const lines = ref<ProductionLine[]>([])
const stations = ref<Station[]>([])
const loading = ref(true)
const activeTab = ref('lines')

onMounted(async () => {
  loading.value = true
  try {
    const [lineData, stationData] = await Promise.all([fetchLines(), fetchStations()])
    lines.value = lineData
    stations.value = stationData
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="production">
    <PageHeader title="Production Lines" subtitle="Equipment status across plant 04">
      <template #actions>
        <Button
          icon="pi pi-list-check"
          label="Work orders"
          size="small"
          severity="secondary"
          outlined
          @click="router.push({ name: 'work-orders-list' })"
        />
      </template>
    </PageHeader>

    <Tabs v-model:value="activeTab">
      <TabList>
        <Tab value="lines">Lines</Tab>
        <Tab value="cards">Status cards</Tab>
        <Tab value="stations">Stations</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="lines">
          <DataTable
            :value="lines"
            :loading="loading"
            size="small"
            striped-rows
            data-key="id"
            :pt="{ table: { style: 'min-width: 58rem' } }"
          >
            <Column field="id" header="Line" sortable style="width: 8rem">
              <template #body="{ data }">
                <RouterLink :to="{ name: 'production-line-detail', params: { id: data.id } }">
                  <span class="mes-mono link">{{ data.id }}</span>
                </RouterLink>
              </template>
            </Column>
            <Column field="status" header="State" sortable style="width: 8rem">
              <template #body="{ data }">
                <StatusTag :value="data.status" :tone="toneOf(LINE_TONES, data.status)" />
              </template>
            </Column>
            <Column field="product" header="Product" sortable style="min-width: 12rem" />
            <Column field="workOrderId" header="Work order" style="width: 9rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.workOrderId ?? '—' }}</span>
              </template>
            </Column>
            <Column field="operator" header="Operator" sortable style="width: 9rem" />
            <Column field="shift" header="Shift" sortable style="width: 7rem" />
            <Column field="oee" header="OEE" sortable style="width: 9rem">
              <template #body="{ data }">
                <div class="meter">
                  <ProgressBar :value="data.oee" :show-value="false" />
                  <span class="mes-mono">{{ formatPercent(data.oee, 0) }}</span>
                </div>
              </template>
            </Column>
            <Column field="utilization" header="Utilisation" sortable style="width: 9rem">
              <template #body="{ data }">
                <div class="meter">
                  <ProgressBar :value="data.utilization" :show-value="false" />
                  <span class="mes-mono">{{ formatPercent(data.utilization, 0) }}</span>
                </div>
              </template>
            </Column>
            <Column field="cycleTimeSec" header="Cycle" sortable style="width: 6rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.cycleTimeSec }} s</span>
              </template>
            </Column>
          </DataTable>
        </TabPanel>

        <TabPanel value="cards">
          <LineStatusGrid :lines="lines" />
        </TabPanel>

        <TabPanel value="stations">
          <DataTable
            :value="stations"
            :loading="loading"
            size="small"
            striped-rows
            :pt="{ table: { style: 'min-width: 42rem' } }"
          >
            <Column field="id" header="Station" style="width: 10rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.id }}</span>
              </template>
            </Column>
            <Column field="name" header="Name" sortable />
            <Column field="line" header="Line" sortable style="width: 8rem">
              <template #body="{ data }">
                <span class="mes-mono">{{ data.line }}</span>
              </template>
            </Column>
            <Column field="type" header="Type" sortable style="width: 10rem" />
            <Column field="state" header="State" sortable style="width: 9rem">
              <template #body="{ data }">
                <StatusTag :value="data.state" :tone="toneOf(STATION_TONES, data.state)" />
              </template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped>
.production {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.meter {
  display: grid;
  grid-template-columns: 1fr 2.8rem;
  align-items: center;
  gap: 0.4rem;
}

.meter :deep(.p-progressbar) {
  height: 6px;
  background: var(--mes-surface-sunken);
}

.link {
  color: var(--mes-accent);
  font-weight: 600;
}
</style>
