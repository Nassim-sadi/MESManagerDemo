export type LineRecordStatus = 'Running' | 'Setup' | 'Idle' | 'Down' | 'Maintenance'

export interface LineRecord {
  id: string
  name: string
  area: string
  status: LineRecordStatus
}

export interface LineAssignment {
  id: string
  lineId: string
  productId: string
  productName: string
  plannedQty: number
}

/** Per-row outcome of validating an imported CSV record. */
export type ImportRowStatus = 'ready' | 'duplicate' | 'exists' | 'invalid'

export interface ImportedRow {
  rowNumber: number
  lineId: string
  productId: string
  productName: string
  plannedQty: number | null
  status: ImportRowStatus
  message: string | null
}

export interface ParsedCsv {
  rows: ImportedRow[]
  /** File level problem; when set the file is rejected completely. */
  fatalError: string | null
}

export interface ImportResult {
  imported: number
  keptExisting: number
}
