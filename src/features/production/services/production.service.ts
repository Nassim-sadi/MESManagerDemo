import { mockData } from '@/services/mock/data'
import { delay } from '@/services/mock/support'
import { hasSeededFactoryData } from '@/services/mock/access'
import type { ProductionLine, Station, WorkOrder } from '@/types/mes'

export async function fetchLines(): Promise<ProductionLine[]> {
  await delay(140, 300)
  return hasSeededFactoryData() ? mockData.lines : []
}

export async function fetchLine(id: string): Promise<ProductionLine | null> {
  await delay(120, 260)
  return hasSeededFactoryData() ? mockData.lines.find((line) => line.id === id) ?? null : null
}

export async function fetchStations(): Promise<Station[]> {
  await delay(140, 320)
  return hasSeededFactoryData() ? mockData.stations : []
}

export async function setLineState(
  id: string,
  state: ProductionLine['status'],
): Promise<ProductionLine | null> {
  await delay(220, 480)
  if (!hasSeededFactoryData()) return null
  const line = mockData.lines.find((entry) => entry.id === id)
  if (!line) return null
  line.status = state
  return line
}

export async function fetchLineWorkOrders(lineId: string): Promise<WorkOrder[]> {
  await delay(140, 300)
  return hasSeededFactoryData() ? mockData.workOrders.filter((order) => order.line === lineId).slice(0, 8) : []
}

export async function fetchLineStations(lineId: string): Promise<Station[]> {
  await delay(120, 260)
  return hasSeededFactoryData() ? mockData.stations.filter((station) => station.line === lineId) : []
}
