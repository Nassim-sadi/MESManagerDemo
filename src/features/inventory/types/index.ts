import type { PageQuery } from '@/types/api'

export interface StockFilters {
  search: string
  warehouse: string | null
  status: string | null
}

export interface MovementFilters {
  search: string
  type: string | null
}

export type StockQuery = PageQuery & { filters: StockFilters }
export type MovementQuery = PageQuery & { filters: MovementFilters }
