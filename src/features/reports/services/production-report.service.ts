import { mockData } from '@/services/mock/data'
import { delay } from '@/services/mock/support'
import { hasSeededFactoryData } from '@/services/mock/access'
import type { ProductionReportFilters, ProductionReportRow } from '../types/production-report'

const SITE = 'Plant 04 - Bratislava'

function getRows(filters: ProductionReportFilters): ProductionReportRow[] {
  if (!hasSeededFactoryData()) return []

  const lineById = new Map(mockData.lines.map((line) => [line.id, line]))
  const orderTerm = filters.orderCode.trim().toLowerCase()
  const modelTerm = filters.model.trim().toLowerCase()

  return mockData.workOrders
    .filter((order) => order.startedAt !== null)
    .map((order) => {
      const workDate = order.startedAt!.slice(0, 10)
      const line = lineById.get(order.line)
      return {
        workDate,
        line: order.line,
        site: SITE,
        shift: line?.shift ?? 'Shift A',
        orderCode: order.id,
        model: order.product,
        modelDescription: order.product,
        plannedQty: order.plannedQty,
        scanQty: order.completedQty,
        // The current demo work-order model does not contain repair quantities.
        repairQty: 0,
      }
    })
    .filter((row) => {
      const date = row.workDate.slice(0, 10)
      return (
        (!filters.dateFrom || date >= filters.dateFrom) &&
        (!filters.dateTo || date <= filters.dateTo) &&
        (!filters.line || row.line === filters.line) &&
        (!filters.site || row.site === filters.site) &&
        (!filters.shift || row.shift === filters.shift) &&
        (!orderTerm || row.orderCode.toLowerCase().includes(orderTerm)) &&
        (!modelTerm || row.model.toLowerCase().includes(modelTerm))
      )
    })
    .sort((a, b) => b.workDate.localeCompare(a.workDate))
}

export async function fetchProductionReport(
  filters: ProductionReportFilters,
): Promise<ProductionReportRow[]> {
  await delay(180, 360)
  return getRows(filters)
}

export function exportProductionReportCsv(rows: ProductionReportRow[]): void {
  const columns: { key: keyof ProductionReportRow; label: string }[] = [
    { key: 'workDate', label: 'Work date' },
    { key: 'line', label: 'Line' },
    { key: 'site', label: 'Site' },
    { key: 'shift', label: 'Shift' },
    { key: 'orderCode', label: 'Order code' },
    { key: 'model', label: 'Model' },
    { key: 'modelDescription', label: 'Model description' },
    { key: 'plannedQty', label: 'Planned quantity' },
    { key: 'scanQty', label: 'Scanned quantity' },
    { key: 'repairQty', label: 'Repair quantity' },
  ]
  const escape = (value: string | number): string => `"${String(value).replaceAll('"', '""')}"`
  const csv = [
    columns.map(({ label }) => escape(label)).join(','),
    ...rows.map((row) => columns.map(({ key }) => escape(row[key])).join(',')),
  ].join('\r\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `order-production-report-${new Date().toISOString().slice(0, 10)}.csv`
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
