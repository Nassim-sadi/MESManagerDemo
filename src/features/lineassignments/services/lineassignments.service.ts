import { delay } from '@/services/mock/support'
import type { ImportResult, LineAssignment, LineRecord } from '../types'

/**
 * Mock store for the master-detail demo. Lines are static, assignments live
 * here so an import survives navigating between pages.
 */
const LINES: LineRecord[] = [
  { id: 'LINE-01', name: 'Line 1', area: 'SMT', status: 'Running' },
  { id: 'LINE-02', name: 'Line 2', area: 'SMT', status: 'Running' },
  { id: 'LINE-03', name: 'Line 3', area: 'Assembly', status: 'Setup' },
  { id: 'LINE-04', name: 'Line 4', area: 'Assembly', status: 'Idle' },
  { id: 'LINE-05', name: 'Line 5', area: 'Machining', status: 'Running' },
  { id: 'LINE-06', name: 'Line 6', area: 'Welding', status: 'Maintenance' },
  { id: 'LINE-07', name: 'Line 7', area: 'Testing', status: 'Running' },
  { id: 'LINE-08', name: 'Line 8', area: 'Packing', status: 'Down' },
]

const ASSIGNMENTS: LineAssignment[] = [
  {
    id: 'LA-001',
    lineId: 'LINE-01',
    productId: 'AX-200',
    productName: 'AX-200 Drive Housing',
    plannedQty: 1200,
  },
  {
    id: 'LA-002',
    lineId: 'LINE-01',
    productId: 'AX-210',
    productName: 'AX-210 Drive Housing',
    plannedQty: 800,
  },
  {
    id: 'LA-003',
    lineId: 'LINE-02',
    productId: 'CV-700',
    productName: 'CV-700 Conveyor Module',
    plannedQty: 350,
  },
  {
    id: 'LA-004',
    lineId: 'LINE-03',
    productId: 'CH-120',
    productName: 'CH-120 Chassis Frame',
    plannedQty: 640,
  },
  {
    id: 'LA-005',
    lineId: 'LINE-03',
    productId: 'DV-900',
    productName: 'DV-900 Drive Unit',
    plannedQty: 200,
  },
  {
    id: 'LA-006',
    lineId: 'LINE-04',
    productId: 'BR-410',
    productName: 'BR-410 Brake Rotor',
    plannedQty: 910,
  },
  {
    id: 'LA-007',
    lineId: 'LINE-05',
    productId: 'GC-500',
    productName: 'GC-500 Gear Carrier',
    plannedQty: 460,
  },
  {
    id: 'LA-008',
    lineId: 'LINE-05',
    productId: 'GC-510',
    productName: 'GC-510 Gear Carrier',
    plannedQty: 410,
  },
  {
    id: 'LA-009',
    lineId: 'LINE-05',
    productId: 'GC-520',
    productName: 'GC-520 Gear Carrier',
    plannedQty: 380,
  },
  {
    id: 'LA-010',
    lineId: 'LINE-06',
    productId: 'WP-300',
    productName: 'WP-300 Weld Panel',
    plannedQty: 150,
  },
  {
    id: 'LA-011',
    lineId: 'LINE-07',
    productId: 'TS-990',
    productName: 'TS-990 Test Fixture',
    plannedQty: 90,
  },
]

let assignmentStore: LineAssignment[] = [...ASSIGNMENTS]

export async function fetchLines(): Promise<LineRecord[]> {
  await delay(120, 260)
  return [...LINES]
}

export async function fetchAssignments(): Promise<LineAssignment[]> {
  await delay(120, 260)
  return [...assignmentStore]
}

export function assignmentsOfLine(assignments: LineAssignment[], lineId: string): LineAssignment[] {
  return assignments.filter((assignment) => assignment.lineId === lineId)
}

/**
 * Appends validated rows to the store. Rows flagged as `exists` have already
 * been filtered out by the dialog - existing assignments are never replaced.
 */
export async function importAssignments(rows: ImportedRowInput[]): Promise<ImportResult> {
  await delay(220, 420)

  let nextId = assignmentStore.length + 1
  const imported = rows.length

  for (const row of rows) {
    assignmentStore = [
      ...assignmentStore,
      {
        id: `LA-${String(nextId).padStart(3, '0')}`,
        lineId: row.lineId,
        productId: row.productId,
        productName: row.productName,
        plannedQty: row.plannedQty,
      },
    ]
    nextId += 1
  }

  return { imported, keptExisting: 0 }
}

export interface ImportedRowInput {
  lineId: string
  productId: string
  productName: string
  plannedQty: number
}
