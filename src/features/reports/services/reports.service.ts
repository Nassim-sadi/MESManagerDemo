import { mockData } from '@/services/mock/data'
import { delay } from '@/services/mock/support'
import { hasSeededFactoryData } from '@/services/mock/access'
import type { ReportDefinition } from '@/types/mes'

export async function fetchReports(): Promise<ReportDefinition[]> {
  await delay(160, 340)
  return hasSeededFactoryData() ? mockData.reports : []
}

export async function runReport(report: ReportDefinition): Promise<ReportDefinition> {
  await delay(400, 800)
  if (!hasSeededFactoryData()) throw new Error('No demo records are available for this factory.')
  report.lastRunAt = new Date().toISOString()
  return report
}
