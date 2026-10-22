import type { StatusTone } from '@/utils/status'

export interface DashboardSummary {
  activeOrders: number
  runningLines: number
  totalLines: number
  openAlarms: number
  unitsToday: number
}

export interface KpiTile {
  key: string
  label: string
  value: string
  unit?: string
  icon: string
  tone: StatusTone
  hint: string
}

/** One row of the dashboard production line table. */
export interface ProductionLineRow {
  id: string
  name: string
  workOrderId: string | null
  product: string
  targetQty: number
  producedQty: number
  status: string
  oee: number
  operator: string
  shift: string
}
