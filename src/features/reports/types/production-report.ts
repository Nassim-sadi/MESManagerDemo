export interface ProductionReportFilters {
  dateFrom: string
  dateTo: string
  line: string | null
  site: string | null
  shift: string | null
  orderCode: string
  model: string
}

export interface ProductionReportRow {
  workDate: string
  line: string
  site: string
  shift: string
  orderCode: string
  model: string
  modelDescription: string
  plannedQty: number
  scanQty: number
  repairQty: number
}
