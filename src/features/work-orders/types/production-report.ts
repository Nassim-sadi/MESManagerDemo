/** Mirrors ProductionReportInfo returned by P_Scan_SiteQty. */
export interface ProductionReportRow {
  workdate: string
  lineSubCode: string
  siteCode: string
  classesCode: string
  orderCode: string
  model: string
  scanQty: string
  jihuaQty: string
  repairQty: string
  siteName: string
  classesName: string
  modelDesc: string
  modelDesc2: string
}

/** Parameters passed to the WinForms P_Scan_SiteQty stored procedure. */
export interface ProductionReportFilters {
  lineSubCode: string
  siteCode: string
  workdateFrom: string
  workdateTo: string
  classesCode: string
  orderCode: string
  model: string
}
