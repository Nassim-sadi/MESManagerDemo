import { delay } from '@/services/mock/support'
import type { ProductionReportFilters, ProductionReportRow } from '../types/production-report'
import { PRODUCTION_REPORT_COLUMNS } from '../types/production-report.columns'
import * as XLSX from 'xlsx'

// Fixed source-shaped screenshot fixture. All values are explicitly sample data.
const SAMPLE_ROWS: ProductionReportRow[] = [
  ['SITE-01','DAY','ORD-260301','MODEL-X1','Refrigerator','',120,118,2],
  ['SITE-02','DAY','ORD-260301','MODEL-X1','Refrigerator','',120,116,1],
  ['SITE-03','DAY','ORD-260301','MODEL-X1','Refrigerator','',120,115,1],
  ['SITE-01','DAY','ORD-260302','MODEL-X2','Refrigerator','',96,94,0],
  ['SITE-02','DAY','ORD-260302','MODEL-X2','Refrigerator','',96,93,1],
  ['SITE-03','DAY','ORD-260302','MODEL-X2','Refrigerator','',96,92,1],
  ['SITE-01','DAY','ORD-260303','MODEL-X1','Refrigerator','',80,79,0],
  ['SITE-02','DAY','ORD-260303','MODEL-X1','Refrigerator','',80,78,1],
].map(([siteName, classesName, orderCode, model, modelDesc, modelDesc2, jihuaQty, scanQty, repairQty], i) => ({
  workdate: '2026-11-03', lineSubCode: `LINE-${String.fromCharCode(65 + Math.floor(i / 3))}`,
  siteCode: String(siteName), classesCode: String(classesName), siteName: String(siteName), classesName: String(classesName),
  orderCode: String(orderCode), model: String(model), modelDesc: String(modelDesc), modelDesc2: String(modelDesc2),
  jihuaQty: String(jihuaQty), scanQty: String(scanQty), repairQty: String(repairQty),
}))

/** Mirrors T_Scan_ScanInfoImp.P_Scan_SiteQty filter semantics. */
export async function fetchProductionReport(filters: ProductionReportFilters): Promise<ProductionReportRow[]> {
  await delay(120, 220)
  // WinForms sends the selected end date plus one day to its exclusive SQL bound.
  void addDays(filters.workdateTo, 1)
  return SAMPLE_ROWS.filter((row) =>
    row.workdate >= filters.workdateFrom && row.workdate <= filters.workdateTo &&
    (!filters.lineSubCode || row.lineSubCode.includes(filters.lineSubCode)) &&
    (!filters.siteCode || row.siteCode.includes(filters.siteCode)) &&
    (!filters.classesCode || row.classesCode.includes(filters.classesCode)) &&
    (!filters.orderCode || row.orderCode.includes(filters.orderCode)) &&
    (!filters.model || row.model.includes(filters.model)),
  )
}

function addDays(value: string, days: number): string {
  if (!value) return ''
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return ''
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}

export function exportProductionReportXlsx(rows: ProductionReportRow[]): void {
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: PRODUCTION_REPORT_COLUMNS.map(({ field }) => field) })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'ProductionReport')
  XLSX.writeFile(workbook, `production-report-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
