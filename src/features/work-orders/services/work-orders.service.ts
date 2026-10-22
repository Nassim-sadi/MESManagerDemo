import { buildTraveler, mockData } from '@/services/mock/data'
import { delay, query as applyQuery } from '@/services/mock/support'
import type { PageResult } from '@/types/api'
import type { MaterialLot, TravelerStep, WorkOrder } from '@/types/mes'
import type { CreateWorkOrderPayload, WorkOrderQuery } from '../types'

export async function fetchWorkOrders(params: WorkOrderQuery): Promise<PageResult<WorkOrder>> {
  await delay(180, 380)

  const { filters } = params
  const term = filters.search.trim().toLowerCase()

  return applyQuery(mockData.workOrders, {
    ...params,
    filter: (order) => {
      if (filters.status && order.status !== filters.status) return false
      if (filters.line && order.line !== filters.line) return false
      if (filters.priority && order.priority !== filters.priority) return false
      if (!term) return true
      return (
        order.id.toLowerCase().includes(term) ||
        order.product.toLowerCase().includes(term) ||
        order.bom.toLowerCase().includes(term) ||
        order.workstation.toLowerCase().includes(term)
      )
    },
  })
}

export async function fetchWorkOrder(id: string): Promise<WorkOrder | null> {
  await delay(140, 300)
  return mockData.workOrders.find((order) => order.id === id) ?? null
}

export async function fetchWorkOrderLines(): Promise<string[]> {
  await delay(80, 160)
  return mockData.lines.map((line) => line.id)
}

export async function createWorkOrder(payload: CreateWorkOrderPayload): Promise<WorkOrder> {
  await delay(300, 600)

  const order: WorkOrder = {
    id: `WO-26${String(700 + mockData.workOrders.length).padStart(3, '0')}`,
    product: payload.product,
    bom: `BOM-${payload.product.slice(0, 3).toUpperCase()}-${payload.plannedQty}`,
    line: payload.line,
    workstation: payload.workstation,
    status: 'Queued',
    priority: payload.priority,
    plannedQty: payload.plannedQty,
    completedQty: 0,
    scrapQty: 0,
    dueAt: payload.dueAt,
    startedAt: null,
    operator: '—',
  }

  mockData.workOrders.unshift(order)
  return order
}

export async function setWorkOrderStatus(
  id: string,
  status: WorkOrder['status'],
): Promise<WorkOrder | null> {
  await delay(200, 420)
  const order = mockData.workOrders.find((entry) => entry.id === id)
  if (!order) return null
  order.status = status
  if (status === 'Running' && !order.startedAt) {
    order.startedAt = new Date().toISOString()
  }
  return order
}

export async function fetchWorkOrderOperations(id: string): Promise<TravelerStep[]> {
  await delay(140, 300)
  const unit = mockData.serialUnits.find((serial) => serial.workOrderId === id)
  const reference = unit ?? {
    sn: id,
    product: mockData.workOrders.find((order) => order.id === id)?.product ?? 'Unknown',
    workOrderId: id,
    line: mockData.lines[0]?.id ?? 'LINE-01',
    status: 'In Process' as const,
    producedAt: new Date().toISOString(),
    operator: '—',
    lots: [],
  }
  return buildTraveler(reference)
}

export async function fetchWorkOrderLots(id: string): Promise<MaterialLot[]> {
  await delay(120, 260)
  const unit = mockData.serialUnits.find((serial) => serial.workOrderId === id)
  if (unit) return unit.lots
  return [
    { material: 'MAT-8801', lot: `LOT-${id.slice(-4)}01`, quantity: 12 },
    { material: 'MAT-4412', lot: `LOT-${id.slice(-4)}02`, quantity: 4 },
  ]
}
