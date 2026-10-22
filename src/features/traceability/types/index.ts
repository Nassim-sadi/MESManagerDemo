export interface TraceabilityResult {
  unit: {
    sn: string
    product: string
    workOrderId: string
    line: string
    status: string
    producedAt: string
    operator: string
  }
  steps: {
    seq: number
    operation: string
    station: string
    machine: string
    result: string
    endedAt: string
    operator: string
  }[]
  lots: {
    material: string
    lot: string
    quantity: number
  }[]
}

export interface ProductHistoryRow {
  product: string
  bom: string
  workOrders: number
  producedQty: number
  scrapQty: number
  yieldPct: number
  lines: string[]
  lastBatch: string
  lastActivity: string
}
