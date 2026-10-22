import { mockData } from '@/services/mock/data'
import { delay, query as applyQuery } from '@/services/mock/support'
import type { PageResult } from '@/types/api'
import type { MaterialMovement, StockItem } from '@/types/mes'
import type { MovementQuery, StockQuery } from '../types'

export async function fetchWarehouses(): Promise<string[]> {
  await delay(80, 160)
  return [...new Set(mockData.stock.map((item) => item.warehouse))]
}

export async function fetchStock(params: StockQuery): Promise<PageResult<StockItem>> {
  await delay(170, 340)

  const { filters } = params
  const term = filters.search.trim().toLowerCase()

  return applyQuery(mockData.stock, {
    ...params,
    filter: (item) => {
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

  const { filters } = params
  const term = filters.search.trim().toLowerCase()

  return applyQuery(mockData.movements, {
    ...params,
    filter: (movement) => {
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
