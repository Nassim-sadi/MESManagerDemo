import { buildTraveler, mockData } from '@/services/mock/data'
import { delay, query as applyQuery } from '@/services/mock/support'
import type { PageQuery, PageResult } from '@/types/api'
import type { SerialUnit } from '@/types/mes'
import type { ProductHistoryRow, TraceabilityResult } from '../types'

export async function searchSerial(sn: string): Promise<TraceabilityResult | null> {
  await delay(220, 520)

  const term = sn.trim().toUpperCase()
  if (!term) return null

  const unit = mockData.serialUnits.find((entry) => entry.sn.toUpperCase() === term)
  if (!unit) return null

  return {
    unit: {
      sn: unit.sn,
      product: unit.product,
      workOrderId: unit.workOrderId,
      line: unit.line,
      status: unit.status,
      producedAt: unit.producedAt,
      operator: unit.operator,
    },
    steps: buildTraveler(unit).map((step) => ({
      seq: step.seq,
      operation: step.operation,
      station: step.station,
      machine: step.machine,
      result: step.result,
      endedAt: step.endedAt,
      operator: step.operator,
    })),
    lots: unit.lots,
  }
}

export async function fetchSerialUnits(params: PageQuery): Promise<PageResult<SerialUnit>> {
  await delay(160, 340)
  return applyQuery(mockData.serialUnits, params)
}

/**
 * Aggregated production history per product: how many units were built,
 * on which work orders and with which yield.
 */
export async function fetchProductHistory(
  params: PageQuery,
): Promise<PageResult<ProductHistoryRow>> {
  await delay(180, 360)

  const grouped = new Map<string, { row: ProductHistoryRow; lines: Set<string> }>()

  for (const order of mockData.workOrders) {
    const existing = grouped.get(order.product)

    if (!existing) {
      grouped.set(order.product, {
        row: {
          product: order.product,
          bom: order.bom,
          workOrders: 1,
          producedQty: order.completedQty,
          scrapQty: order.scrapQty,
          yieldPct: 0,
          lines: [],
          lastBatch: order.id,
          lastActivity: order.startedAt ?? order.dueAt,
        },
        lines: new Set([order.line]),
      })
      continue
    }

    existing.row.workOrders += 1
    existing.row.producedQty += order.completedQty
    existing.row.scrapQty += order.scrapQty
    existing.lines.add(order.line)
    existing.row.lastBatch = order.id
    if ((order.startedAt ?? order.dueAt) > existing.row.lastActivity) {
      existing.row.lastActivity = order.startedAt ?? order.dueAt
    }
  }

  const rows = [...grouped.values()].map(({ row, lines }) => {
    const produced = row.producedQty + row.scrapQty
    return {
      ...row,
      lines: [...lines],
      yieldPct: produced
        ? Math.round(((row.producedQty / produced) * 100 + Number.EPSILON) * 10) / 10
        : 0,
    }
  })

  return applyQuery(rows, params)
}
