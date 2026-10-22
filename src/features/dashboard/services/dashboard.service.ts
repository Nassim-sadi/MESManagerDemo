import { mockData } from '@/services/mock/data'
import { delay, round } from '@/services/mock/support'
import type { Alarm, ProductionLine } from '@/types/mes'
import type { DashboardSummary, ProductionLineRow } from '../types'

/**
 * Demo data layer. Every function mimics the latency and the shape of a
 * real endpoint so the pages can be wired to the API without changes.
 */
export async function fetchSummary(): Promise<DashboardSummary> {
  await delay(140, 320)

  const active = mockData.workOrders.filter((order) =>
    ['Running', 'Queued', 'Paused', 'Hold'].includes(order.status),
  )
  const running = mockData.lines.filter((line) => line.status === 'Running')

  return {
    activeOrders: active.length,
    runningLines: running.length,
    totalLines: mockData.lines.length,
    openAlarms: mockData.alarms.filter((alarm) => !alarm.acknowledged).length,
    unitsToday: mockData.serialUnits.length * 6,
  }
}

export async function fetchLineStatus(): Promise<ProductionLine[]> {
  await delay(120, 280)
  return mockData.lines
}

/**
 * Production lines with the quantities of their current work orders.
 * This is the table the supervisor reads first.
 */
export async function fetchLineOverview(): Promise<ProductionLineRow[]> {
  await delay(160, 340)

  return mockData.lines.map((line) => {
    const orders = mockData.workOrders.filter(
      (order) =>
        order.line === line.id && ['Running', 'Paused', 'Queued', 'Hold'].includes(order.status),
    )

    return {
      id: line.id,
      name: line.name,
      workOrderId: line.workOrderId,
      product: line.product,
      targetQty: orders.reduce((sum, order) => sum + order.plannedQty, 0),
      producedQty: orders.reduce((sum, order) => sum + order.completedQty, 0),
      status: line.status,
      oee: line.oee,
      operator: line.operator,
      shift: line.shift,
    }
  })
}

export async function fetchAlarms(): Promise<Alarm[]> {
  await delay(100, 260)
  return [...mockData.alarms].sort(
    (a, b) => new Date(b.raisedAt).getTime() - new Date(a.raisedAt).getTime(),
  )
}

export async function acknowledgeAlarm(id: string): Promise<Alarm | null> {
  await delay(150, 320)
  const alarm = mockData.alarms.find((entry) => entry.id === id)
  if (!alarm) return null
  alarm.acknowledged = true
  return alarm
}

export const plantOee = round(
  mockData.lines.reduce((sum, line) => sum + line.oee, 0) / (mockData.lines.length || 1),
)
