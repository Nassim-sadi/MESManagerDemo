import type { ImportedRow, ParsedCsv } from '../types'

/** Headers the CSV must contain (matched case-insensitively). */
const REQUIRED_COLUMNS = ['lineId', 'productId', 'productName', 'plannedQty'] as const

/** Accepts small header spelling variants such as "Line ID" or "planned_qty". */
function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[\s_-]+/g, '')
}

/**
 * Splits a CSV line into values, honouring double quoted fields that
 * may contain commas or escaped quotes.
 */
function splitCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]

    if (inQuotes) {
      if (char === '"') {
        if (line[index + 1] === '"') {
          current += '"'
          index += 1
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }

  values.push(current)
  return values.map((value) => value.trim())
}

function isKnownHeaderRow(cells: string[]): boolean {
  const normalized = cells.map(normalizeHeader)
  return REQUIRED_COLUMNS.every((column) => normalized.includes(column))
}

function headerIndex(headers: string[], column: (typeof REQUIRED_COLUMNS)[number]): number {
  const normalized = normalizeHeader(column)
  return headers.findIndex((header) => normalizeHeader(header) === normalized)
}

/**
 * Parses a CSV export of line assignments.
 *
 * Validation contract:
 * - missing or wrong header columns reject the whole file (`fatalError`)
 * - empty or malformed fields mark the row `invalid`
 * - the same assignment appearing twice marks the second row `duplicate`
 * - assignments that already exist for a line are marked `exists` and are
 *   left untouched during the import - nothing is silently overwritten
 */
export function parseAssignmentCsv(text: string): ParsedCsv {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')

  if (lines.length === 0) {
    return { rows: [], fatalError: 'The file is empty.' }
  }

  const headers = splitCsvLine(lines[0] ?? '')
  if (!isKnownHeaderRow(headers)) {
    return {
      rows: [],
      fatalError: `Missing required columns. Expected: ${REQUIRED_COLUMNS.join(', ')}.`,
    }
  }

  const columns = {
    lineId: headerIndex(headers, 'lineId'),
    productId: headerIndex(headers, 'productId'),
    productName: headerIndex(headers, 'productName'),
    plannedQty: headerIndex(headers, 'plannedQty'),
  }

  const rows: ImportedRow[] = []
  const seen = new Set<string>()

  for (let index = 1; index < lines.length; index += 1) {
    const cells = lines[index] ? splitCsvLine(lines[index] ?? '') : []
    const rowNumber = index + 1
    const lineId = cells[columns.lineId] ?? ''
    const productId = cells[columns.productId] ?? ''
    const productName = cells[columns.productName] ?? ''
    const rawQty = cells[columns.plannedQty] ?? ''
    const plannedQty = Number(rawQty)

    const key = `${lineId.toLowerCase()}|${productId.toLowerCase()}`

    let status: ImportedRow['status'] = 'ready'
    let message: string | null = null

    if (!lineId || !productId || !productName) {
      status = 'invalid'
      message = !lineId
        ? 'Line ID is required.'
        : !productId
          ? 'Product ID is required.'
          : 'Product name is required.'
    } else if (
      !rawQty ||
      !Number.isFinite(plannedQty) ||
      !Number.isInteger(plannedQty) ||
      plannedQty <= 0
    ) {
      status = 'invalid'
      message = 'Planned quantity must be a whole number above zero.'
    } else if (seen.has(key)) {
      status = 'duplicate'
      message = 'Duplicate of an earlier row in this file.'
    }

    if (status !== 'duplicate') seen.add(key)

    rows.push({
      rowNumber,
      lineId,
      productId,
      productName,
      plannedQty: Number.isFinite(plannedQty) ? plannedQty : null,
      status,
      message,
    })
  }

  if (rows.length === 0) {
    return { rows, fatalError: 'The file contains no data rows.' }
  }

  return { rows, fatalError: null }
}
