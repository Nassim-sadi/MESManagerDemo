import type { PageQuery, PageResult } from '@/types/api'

/** Deterministic PRNG so the demo data looks the same on every reload. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const random = mulberry32(20260421)

export function pick<T>(values: readonly T[]): T {
  return values[Math.floor(random() * values.length)] ?? (values[0] as T)
}

export function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min
}

export function round(value: number, digits = 1): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function isoWithin(hoursAgo: number): string {
  return new Date(Date.now() - hoursAgo * 3600_000).toISOString()
}

/** Simulated network latency for the mock services. */
export function delay(min = 120, max = 320): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Sorts, filters and paginates an in-memory collection the way the API would. */
export function query<T>(
  rows: T[],
  options: PageQuery & { filter?: (row: T) => boolean; search?: (row: T, term: string) => boolean },
): PageResult<T> {
  let result = rows

  if (options.filter) {
    result = result.filter(options.filter)
  }

  if (options.sortField && options.sortOrder) {
    const field = options.sortField as keyof T
    const direction = options.sortOrder
    result = [...result].sort((a, b) => {
      const left = a[field]
      const right = b[field]
      if (left === right) return 0
      if (left === null || left === undefined) return 1
      if (right === null || right === undefined) return -1
      return (left > right ? 1 : -1) * direction
    })
  }

  const total = result.length
  const start = options.page * options.size
  const items = result.slice(start, start + options.size)

  return { items, total }
}
