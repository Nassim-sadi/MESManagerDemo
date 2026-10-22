<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/shared/PageHeader.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { fetchReports, runReport } from '../services/reports.service'
import type { ReportDefinition } from '@/types/mes'
import { formatRelative } from '@/utils/format'

const toast = useToast()

const reports = ref<ReportDefinition[]>([])
const loading = ref(true)
const running = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    reports.value = await fetchReports()
  } finally {
    loading.value = false
  }
})

async function onRun(report: ReportDefinition): Promise<void> {
  running.value = report.id
  try {
    await runReport(report)
    toast.add({
      severity: 'success',
      summary: 'Report generated',
      detail: `${report.name} · ${report.format}`,
      life: 3000,
    })
  } finally {
    running.value = null
  }
}
</script>

<template>
  <div class="reports">
    <PageHeader title="Reports" subtitle="Standard production, quality and inventory reports" />

    <EmptyState
      v-if="!loading && reports.length === 0"
      icon="pi pi-inbox"
      title="No reports configured"
      message="Add a report template to see it here."
    />

    <DataTable
      v-else
      :value="reports"
      :loading="loading"
      size="small"
      striped-rows
      :pt="{ table: { style: 'min-width: 52rem' } }"
    >
      <Column field="id" header="Report" sortable style="width: 7rem">
        <template #body="{ data }">
          <span class="mes-mono">{{ data.id }}</span>
        </template>
      </Column>
      <Column field="name" header="Name" sortable style="min-width: 13rem" />
      <Column field="category" header="Category" sortable style="width: 8rem">
        <template #body="{ data }">
          <Tag :value="data.category" severity="secondary" />
        </template>
      </Column>
      <Column field="description" header="Description" style="min-width: 20rem" />
      <Column field="format" header="Format" sortable style="width: 5rem">
        <template #body="{ data }">
          <span class="mes-mono">{{ data.format }}</span>
        </template>
      </Column>
      <Column field="owner" header="Owner" sortable style="width: 7.5rem" />
      <Column field="lastRunAt" header="Last run" sortable style="width: 7rem">
        <template #body="{ data }">
          <span class="mes-mono">{{ formatRelative(data.lastRunAt) }}</span>
        </template>
      </Column>
      <Column style="width: 5rem">
        <template #body="{ data }">
          <Button
            label="Run"
            icon="pi pi-play"
            size="small"
            severity="secondary"
            outlined
            :loading="running === data.id"
            @click="onRun(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.reports {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
</style>
