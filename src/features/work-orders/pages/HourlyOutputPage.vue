<script setup lang="ts">
import { computed } from 'vue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Tag from 'primevue/tag'
import Chart from 'primevue/chart'
import PageHeader from '@/components/shared/PageHeader.vue'
import {
  HOURLY_OUTPUT_COLUMNS,
  HOURLY_OUTPUT_SAMPLE,
} from '../types/hourly-output.columns'

const rows = HOURLY_OUTPUT_SAMPLE

// KPI calculations
const productivity = computed(() =>
  rows.length
    ? Math.round(
      rows.reduce((sum, row) => sum + row.productivity, 0) / rows.length,
    )
    : 0,
)

const qcQty = computed(() =>
  rows.reduce((sum, row) => sum + row.qcQty, 0),
)

const repairQty = computed(() =>
  rows.reduce((sum, row) => sum + row.repairQty, 0),
)

// Mixed chart: production bars + QC line
const chartData = computed(() => ({
  labels: rows.map((row) => row.hourTime),

  datasets: [
    {
      type: 'bar' as const,
      label: 'Planned output',
      data: rows.map((row) => row.planJiepai),
      backgroundColor: '#94a3b8',
      borderRadius: 4,
      yAxisID: 'y',
      order: 2,
    },
    {
      type: 'bar' as const,
      label: 'Actual output',
      data: rows.map((row) => row.realJiepai),
      backgroundColor: '#2563eb',
      borderRadius: 4,
      yAxisID: 'y',
      order: 2,
    },
    {
      type: 'line' as const,
      label: 'QC percentage',
      data: rows.map((row) => row.qcPercent),
      borderColor: '#16a34a',
      pointBackgroundColor: '#16a34a',
      borderWidth: 2,
      tension: 0.35,
      yAxisID: 'y1',
      order: 1,
    },
    {
      type: 'line' as const,
      label: 'Productivity',
      data: rows.map((row) => row.productivity),
      borderColor: '#f59e0b',
      pointBackgroundColor: '#f59e0b',
      borderWidth: 2,
      borderDash: [5, 4],
      tension: 0.35,
      yAxisID: 'y2',
      order: 0,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  interaction: {
    mode: 'index' as const,
    intersect: false,
  },

  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        padding: 20,
      },
    },

    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.dataset.label || ''
          const value = context.parsed.y

          return context.dataset.yAxisID === 'y1'
            ? `${label}: ${value}%`
            : `${label}: ${value}`
        },
      },
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },

    y2: {
      type: 'linear' as const,
      position: 'right' as const,
      min: 0,
      max: 120,
      display: false,
      grid: {
        drawOnChartArea: false,
      },
    },

    y1: {
      type: 'linear' as const,
      position: 'right' as const,
      min: 0,
      max: 100,

      title: {
        display: true,
        text: 'QC percentage',
      },

      ticks: {
        callback: (value: string | number) => `${value}%`,
      },

      grid: {
        drawOnChartArea: false,
      },
    },
  },
}


// pie chart data
const totalPlan = computed(() =>
  rows.reduce((sum, row) => sum + row.planJiepai, 0),
)

const totalActual = computed(() =>
  rows.reduce((sum, row) => sum + row.realJiepai, 0),
)

const totalQc = computed(() =>
  rows.reduce((sum, row) => sum + row.qcPercent, 0) / rows.length,
)

const totalQcQty = computed(() =>
  rows.reduce((sum, row) => sum + row.qcQty, 0),
)

const totalRepair = computed(() =>
  rows.reduce((sum, row) => sum + row.repairQty, 0),
)

const productionChartData = computed(() => ({
  labels: ['Actual Output', 'Remaining'],
  datasets: [{
    data: [
      Math.min(totalActual.value, totalPlan.value),
      Math.max(totalPlan.value - totalActual.value, 0),
    ],
    backgroundColor: ['#2563eb', '#dbeafe'],
    borderWidth: 0,
  }],
}))

const qualityChartData = computed(() => ({
  labels: ['QC Rate', 'Remaining'],
  datasets: [{
    data: [
      Math.min(totalQc.value, 100),
      Math.max(100 - totalQc.value, 0),
    ],
    backgroundColor: ['#16a34a', '#dcfce7'],
    borderWidth: 0,
  }],
}))

const repairChartData = computed(() => ({
  labels: ['Good Output', 'Repair'],
  datasets: [{
    data: [
      Math.max(totalQcQty.value - totalRepair.value, 0),
      totalRepair.value,
    ],
    backgroundColor: ['#16a34a', '#f97316'],
    borderWidth: 0,
  }],
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

const radarChartData = computed(() => ({
  labels: [
    'Productivity',
    'QC Rate',
    'Production Achievement',
    'Quality Output',
  ],
  datasets: [{
    label: 'Performance',
    data: [
      productivity.value,
      totalQc.value,
      totalPlan.value > 0
        ? (totalActual.value / totalPlan.value) * 100
        : 0,
      totalQcQty.value > 0
        ? ((totalQcQty.value - totalRepair.value) / totalQcQty.value) * 100
        : 0,
    ],
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: '#2563eb',
    pointBackgroundColor: '#2563eb',
    borderWidth: 2,
  }],
}))


</script>

<template>
  <div class="hourly-page">
    <PageHeader title="Hourly output" subtitle="Hourly takt and quality figures from FrmReportProduceHourJiepaiList.">
      <template #actions>
        <Tag value="Sample data" severity="info" />
      </template>
    </PageHeader>

    <!-- KPI cards -->
    <section class="metric-row">
      <article class="mes-card metric">
        <span>productivity</span>
        <strong>{{ productivity }}%</strong>
      </article>

      <article class="mes-card metric">
        <span>qcQty</span>
        <strong>{{ qcQty }}</strong>
      </article>

      <article class="mes-card metric">
        <span>repairQty</span>
        <strong>{{ repairQty }}</strong>
      </article>
    </section>

    <!-- Charts -->
    <section class="mes-card chart-card">
      <header class="chart-header">
        <div>
          <h2>Hourly production performance</h2>
          <span>Planned vs actual output and quality rate</span>
        </div>

        <Tag value="Hourly" severity="info" />
      </header>

      <div class="chart-container">
        <Chart type="bar" :data="chartData" :options="chartOptions" class="hourly-chart" :canvas-props="{
          role: 'img',
          'aria-label':
            'Hourly planned production, actual production and QC percentage',
        }" />
      </div>
    </section>

    <div class="chart-grid">
      <div class="mes-card chart-card">
        <h3>Production Achievement</h3>
        <Chart type="doughnut" :data="productionChartData" :options="doughnutOptions" />
      </div>

      <div class="mes-card chart-card">
        <h3>Quality Rate</h3>
        <Chart type="doughnut" :data="qualityChartData" :options="doughnutOptions" />
      </div>

      <div class="mes-card chart-card">
        <h3>Production Status</h3>
        <Chart type="pie" :data="repairChartData" :options="pieOptions" />
      </div>
    </div>

    <!-- Data table -->
    <section class="mes-card table-card">
      <header class="table-header">
        <h2>Hourly details</h2>
        <span>{{ rows.length }} rows</span>
      </header>

      <DataTable :value="rows" size="small" paginator :rows="10" responsive-layout="scroll">
        <Column v-for="column in HOURLY_OUTPUT_COLUMNS" :key="column.field" :field="column.field" :header="column.header" />
      </DataTable>
    </section>
  </div>
</template>

<style scoped>
.hourly-page {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1rem;
}

.metric span {
  color: var(--mes-text-muted);
  font-size: var(--mes-fs-xs);
}

.metric strong {
  font-size: var(--mes-fs-xl);
  font-weight: 700;
}

.chart-card,
.table-card {
  min-width: 0;
  padding: 1rem;
}

.chart-header,
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.chart-header h2,
.table-header h2 {
  margin: 0;
  font-size: var(--mes-fs-md);
}

.chart-header span,
.table-header span {
  display: block;
  margin-top: 0.3rem;
  color: var(--mes-text-muted);
  font-size: var(--mes-fs-xs);
}

.chart-container {
  position: relative;
  width: 100%;
  height: 340px;
}

.hourly-chart {
  width: 100%;
  height: 100%;
}

@media (max-width: 800px) {
  .metric-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .metric-row {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 280px;
  }
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.chart-card {
  min-width: 0;
  padding: 1.25rem;
}

.chart-card h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.chart-card :deep(canvas) {
  max-height: 240px;
}

@media (max-width: 1100px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}
</style>
