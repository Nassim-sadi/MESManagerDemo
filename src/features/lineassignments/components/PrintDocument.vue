<script setup lang="ts">
import type { LineAssignment, LineRecord } from '../types'

defineProps<{
  mode: 'lines' | 'assignments'
  lines: LineRecord[]
  assignments: LineAssignment[]
  selectedLine: LineRecord | null
}>()

function generatedAt(): string {
  return new Date().toLocaleString()
}
</script>

<template>
  <div class="print-doc">
    <header class="print-doc__header">
      <div>
        <p class="print-doc__eyebrow">MES Manager</p>
        <h2 class="print-doc__title">
          {{
            mode === 'lines'
              ? 'Production Lines'
              : `Assigned Products${selectedLine ? ` — ${selectedLine.name} (${selectedLine.id})` : ''}`
          }}
        </h2>
      </div>
      <p class="print-doc__meta">Generated {{ generatedAt() }}</p>
    </header>

    <table v-if="mode === 'lines'">
      <thead>
        <tr>
          <th>Line</th>
          <th>Name</th>
          <th>Area</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="line in lines" :key="line.id">
          <td>{{ line.id }}</td>
          <td>{{ line.name }}</td>
          <td>{{ line.area }}</td>
          <td>{{ line.status }}</td>
        </tr>
      </tbody>
    </table>

    <table v-else>
      <thead>
        <tr>
          <th>Line ID</th>
          <th>Product ID</th>
          <th>Product Name</th>
          <th>Planned Qty</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="assignment in assignments" :key="assignment.id">
          <td>{{ assignment.lineId }}</td>
          <td>{{ assignment.productId }}</td>
          <td>{{ assignment.productName }}</td>
          <td class="print-doc__num">{{ assignment.plannedQty.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.print-doc {
  font-size: 11px;
  color: #000;
}

.print-doc__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 2px solid #000;
  padding-bottom: 0.4rem;
  margin-bottom: 0.75rem;
}

.print-doc__eyebrow {
  margin: 0 0 0.15rem;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.print-doc__title {
  margin: 0;
  font-size: 15px;
  font-weight: 650;
}

.print-doc__meta {
  margin: 0;
  font-size: 10px;
  white-space: nowrap;
}

.print-doc table {
  width: 100%;
  border-collapse: collapse;
}

.print-doc th,
.print-doc td {
  border: 1px solid #cbd5e1;
  padding: 0.35rem 0.5rem;
  text-align: left;
  vertical-align: top;
}

.print-doc thead th {
  background: #eef2f5;
  font-weight: 600;
}

.print-doc tbody tr:nth-child(even) td {
  background: #f7f9fa;
}

.print-doc__num {
  text-align: right;
}
</style>
