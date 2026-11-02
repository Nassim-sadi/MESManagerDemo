import { mockData } from '@/services/mock/data'
import { delay, query as applyQuery } from '@/services/mock/support'
import { allowedWarehouseCodes, canAccessWarehouse, emptyPage, hasSeededFactoryData, warehouseCode } from '@/services/mock/access'
import type { PageResult } from '@/types/api'
import type { MaterialMovement, StockItem } from '@/types/mes'
import type { MovementQuery, StockQuery } from '../types'

export async function fetchWarehouses(): Promise<string[]> {
  await delay(80, 160)
  if (!hasSeededFactoryData()) return []
  const allowed = new Set(allowedWarehouseCodes())
  return [...new Set(mockData.stock.map((item) => item.warehouse))]
    .filter((warehouse) => allowed.has(warehouseCode(warehouse)))
}

export async function fetchStock(params: StockQuery): Promise<PageResult<StockItem>> {
  await delay(170, 340)
  if (!hasSeededFactoryData()) return emptyPage()

  const { filters } = params
  const term = filters.search.trim().toLowerCase()

  return applyQuery(mockData.stock, {
    ...params,
    filter: (item) => {
      if (!canAccessWarehouse(item.warehouse)) return false
      if (filters.warehouse && item.warehouse !== filters.warehouse) return false
      if (filters.status && item.status !== filters.status) return false
      if (!term) return true
      return (
        item.id.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term)
      )
    },
  })
}

export async function fetchMovements(params: MovementQuery): Promise<PageResult<MaterialMovement>> {
  await delay(170, 360)
  if (!hasSeededFactoryData()) return emptyPage()

  const { filters } = params
  const term = filters.search.trim().toLowerCase()

  return applyQuery(mockData.movements, {
    ...params,
    filter: (movement) => {
      if (!canAccessWarehouse(movement.warehouse)) return false
      if (filters.type && movement.type !== filters.type) return false
      if (!term) return true
      return (
        movement.id.toLowerCase().includes(term) ||
        movement.material.toLowerCase().includes(term) ||
        movement.reference.toLowerCase().includes(term)
      )
    },
  })
}
