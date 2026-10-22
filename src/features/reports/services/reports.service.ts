import { mockData } from '@/services/mock/data'
import { delay } from '@/services/mock/support'
import type { ReportDefinition } from '@/types/mes'

export async function fetchReports(): Promise<ReportDefinition[]> {
  await delay(160, 340)
  return mockData.reports
}

export async function runReport(report: ReportDefinition): Promise<ReportDefinition> {
  await delay(400, 800)
  report.lastRunAt = new Date().toISOString()
  return report
}
