import { mockData } from '@/services/mock/data'
import { delay, isoWithin, pick, query as applyQuery, randomInt } from '@/services/mock/support'
import type { PageQuery, PageResult } from '@/types/api'
import type { Inspection } from '@/types/mes'
import type { InspectionFilters, NonConformance, QualityFilters } from '../types'

const DEFECTS = [
  'Dimensional deviation',
  'Surface scratch',
  'Incomplete labelling',
  'Weld porosity',
  'Wrong component fitted',
  'Torque out of tolerance',
]

const nonConformances: NonConformance[] = Array.from({ length: 64 }, (_, index) => {
  const unit = mockData.serialUnits[index % mockData.serialUnits.length]!

  return {
    id: `NCR-${String(3000 + index)}`,
    raisedAt: isoWithin(randomInt(1, 320)),
    serial: unit.sn,
    workOrderId: unit.workOrderId,
    line: unit.line,
    defect: pick(DEFECTS),
    severity: pick(['Minor', 'Major', 'Critical'] as const),
    disposition: pick(['Rework', 'Scrap', 'Use as is', 'Pending'] as const),
    status: index % 3 === 0 ? 'Open' : 'Closed',
  }
})

export async function fetchNonConformances(
  params: PageQuery & { filters: QualityFilters },
): Promise<PageResult<NonConformance>> {
  await delay(180, 380)

  const { filters } = params
  const term = filters.search.trim().toLowerCase()

  return applyQuery(nonConformances, {
    ...params,
    filter: (entry) => {
      if (filters.severity && entry.severity !== filters.severity) return false
      if (filters.status && entry.status !== filters.status) return false
      if (!term) return true
      return (
        entry.id.toLowerCase().includes(term) ||
        entry.serial.toLowerCase().includes(term) ||
        entry.defect.toLowerCase().includes(term)
      )
    },
  })
}

export async function fetchInspections(
  params: PageQuery & { filters: InspectionFilters },
): Promise<PageResult<Inspection>> {
  await delay(180, 360)

  const { filters } = params
  const term = filters.search.trim().toLowerCase()

  return applyQuery(mockData.inspections, {
    ...params,
    filter: (entry) => {
      if (filters.type && entry.type !== filters.type) return false
      if (filters.result && entry.result !== filters.result) return false
      if (!term) return true
      return (
        entry.id.toLowerCase().includes(term) ||
        entry.serial.toLowerCase().includes(term) ||
        entry.station.toLowerCase().includes(term)
      )
    },
  })
}
