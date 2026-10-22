/** Shared MES domain entities. Feature specific DTOs live in the features. */

export type WorkOrderStatus = 'Queued' | 'Running' | 'Paused' | 'Hold' | 'Completed' | 'Cancelled'
export type WorkOrderPriority = 'Low' | 'Normal' | 'High' | 'Urgent'
export type LineStatus = 'Running' | 'Setup' | 'Idle' | 'Down' | 'Maintenance'
export type AlarmSeverity = 'Critical' | 'Warning' | 'Info'
export type SerialStatus = 'In Process' | 'Passed' | 'Failed' | 'Scrapped'
export type StepResult = 'Pass' | 'Fail' | 'Rework' | 'Pending'

export interface WorkOrder {
  id: string
  product: string
  bom: string
  line: string
  workstation: string
  status: WorkOrderStatus
  priority: WorkOrderPriority
  plannedQty: number
  completedQty: number
  scrapQty: number
  dueAt: string
  startedAt: string | null
  operator: string
}

export interface ProductionLine {
  id: string
  name: string
  status: LineStatus
  product: string
  workOrderId: string | null
  shift: string
  operator: string
  oee: number
  availability: number
  performance: number
  quality: number
  utilization: number
  cycleTimeSec: number
}

export interface Alarm {
  id: string
  raisedAt: string
  line: string
  code: string
  message: string
  severity: AlarmSeverity
  acknowledged: boolean
}

export interface SerialUnit {
  sn: string
  product: string
  workOrderId: string
  line: string
  status: SerialStatus
  producedAt: string
  operator: string
  lots: MaterialLot[]
}

export interface MaterialLot {
  material: string
  lot: string
  quantity: number
}

export interface TravelerStep {
  seq: number
  operation: string
  station: string
  machine: string
  result: StepResult
  startedAt: string
  endedAt: string
  operator: string
}

export interface Station {
  id: string
  name: string
  line: string
  type: string
  state: 'Available' | 'Busy' | 'Maintenance' | 'Offline'
}

export interface StockItem {
  id: string
  description: string
  warehouse: string
  location: string
  onHand: number
  unit: string
  minLevel: number
  status: 'Available' | 'Low' | 'Blocked'
}

export interface MaterialMovement {
  id: string
  material: string
  description: string
  type: 'Goods receipt' | 'Issue to line' | 'Transfer' | 'Scrap' | 'Return'
  quantity: number
  unit: string
  reference: string
  warehouse: string
  movedAt: string
  user: string
}

export interface Inspection {
  id: string
  type: 'Incoming' | 'In process' | 'Final'
  serial: string
  station: string
  result: 'Pass' | 'Fail' | 'Conditional'
  inspector: string
  measured: string
  inspectedAt: string
}

export interface ReportDefinition {
  id: string
  name: string
  category: string
  description: string
  format: 'XLSX' | 'CSV' | 'PDF'
  owner: string
  lastRunAt: string
}
