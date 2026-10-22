import type { PageQuery } from '@/types/api'
import type { WorkOrderPriority, WorkOrderStatus } from '@/types/mes'

export interface WorkOrderFilters {
  search: string
  status: WorkOrderStatus | null
  line: string | null
  priority: WorkOrderPriority | null
}

export type WorkOrderQuery = PageQuery & { filters: WorkOrderFilters }

export interface CreateWorkOrderPayload {
  product: string
  line: string
  workstation: string
  plannedQty: number
  priority: WorkOrderPriority
  dueAt: string
}
