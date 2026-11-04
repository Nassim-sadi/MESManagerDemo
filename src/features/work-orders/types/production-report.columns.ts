import type { ProductionReportRow } from './production-report'

/** Visible FrmProductionReportList columns, in source order. */
export const PRODUCTION_REPORT_COLUMNS: { field: keyof ProductionReportRow; header: string }[] = [
  { field: 'workdate', header: 'workdate' },
  { field: 'lineSubCode', header: 'lineSubCode' },
  { field: 'siteName', header: 'siteName' },
  { field: 'classesName', header: 'classesName' },
  { field: 'orderCode', header: 'orderCode' },
  { field: 'model', header: 'model' },
  { field: 'modelDesc', header: 'modelDesc' },
  { field: 'modelDesc2', header: 'modelDesc2' },
  { field: 'jihuaQty', header: 'jihuaQty' },
  { field: 'scanQty', header: 'scanQty' },
  { field: 'repairQty', header: 'repairQty' },
]
