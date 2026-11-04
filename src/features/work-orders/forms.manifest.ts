import type { SourceFormMeta } from '@/types/source-form'

/**
 * Order Management port checklist. Mirrors `QDHZMg\OrderMg` in the
 * CondorZentech MES source. Entries are enriched with filters, columns and
 * totals as each form is ported.
 */
export const ORDER_MANAGEMENT_FORMS: SourceFormMeta[] = [
  { id: 'FrmProductionReportList', title: 'Production report', source: 'QDHZMg/OrderMg/FrmProductionReportList.cs', kind: 'list', status: 'in-progress', route: '/work-orders/production-report' },
  { id: 'Frm_OrderListWh', title: 'Orders', source: 'QDHZMg/OrderMg/Frm_OrderListWh.cs', kind: 'list', status: 'in-progress', route: '/work-orders' },
  { id: 'Frm_OrderEdit', title: 'Order / SN detail', source: 'QDHZMg/OrderMg/Frm_OrderEdit.cs', kind: 'edit', status: 'todo' },
  { id: 'Frm_MultiOrder', title: 'Multiple orders', source: 'QDHZMg/OrderMg/Frm_MultiOrder.cs', kind: 'dialog', status: 'todo' },
  { id: 'Frm_OrderPartList', title: 'Order parts', source: 'QDHZMg/OrderMg/Frm_OrderPartList.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_OrderPartProcess', title: 'Order part process', source: 'QDHZMg/OrderMg/Frm_OrderPartProcess.cs', kind: 'dialog', status: 'todo' },
  { id: 'Frm_OrderOverWh', title: 'Completed orders', source: 'QDHZMg/OrderMg/Frm_OrderOverWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_ProductFilesListWh', title: 'Product files', source: 'QDHZMg/OrderMg/Frm_ProductFilesListWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_OnLineListWh', title: 'Online orders', source: 'QDHZMg/OrderMg/Frm_OnLineListWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_OnLineALLListWh', title: 'Online orders — all', source: 'QDHZMg/OrderMg/Frm_OnLineALLListWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_ScanListWh', title: 'Scans', source: 'QDHZMg/OrderMg/Frm_ScanListWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_ScanDetailListByAssemblyWh', title: 'Scans by assembly', source: 'QDHZMg/OrderMg/Frm_ScanDetailListByAssemblyWh.cs', kind: 'list', status: 'todo' },
  { id: 'FrmScanScanDetailReworkList', title: 'Rework list', source: 'QDHZMg/OrderMg/FrmScanScanDetailReworkList.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_FullProcessTraceabilityListWh', title: 'Full-process traceability', source: 'QDHZMg/OrderMg/Frm_FullProcessTraceabilityListWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_Log_SiteWh', title: 'Site log', source: 'QDHZMg/OrderMg/Frm_Log_SiteWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_LogSiteSubListWh', title: 'Sub-line site log', source: 'QDHZMg/OrderMg/Frm_LogSiteSubListWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_ImeiCodeListWh', title: 'IMEI codes', source: 'QDHZMg/OrderMg/Frm_ImeiCodeListWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_ImeiCodeOrderDetail', title: 'IMEI by order', source: 'QDHZMg/OrderMg/Frm_ImeiCodeOrderDetail.cs', kind: 'list', status: 'todo' },
  { id: 'FrmSNChinaList', title: 'SN China list', source: 'QDHZMg/OrderMg/FrmSNChinaList.cs', kind: 'list', status: 'todo' },
  { id: 'FrmSNChinaOrderList', title: 'SN China by order', source: 'QDHZMg/OrderMg/FrmSNChinaOrderList.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_SNChinaImpErrorList', title: 'SN import errors', source: 'QDHZMg/OrderMg/Frm_SNChinaImpErrorList.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_InstallDetailListWh', title: 'Installation details', source: 'QDHZMg/OrderMg/Frm_InstallDetailListWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_UserFinishList', title: 'User finish quantities', source: 'QDHZMg/OrderMg/Frm_UserFinishList.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_UserFinishListZXWh', title: 'User finish quantities — ZX', source: 'QDHZMg/OrderMg/Frm_UserFinishListZXWh.cs', kind: 'list', status: 'todo' },
  { id: 'Frm_DateFinishListZZWh', title: 'Daily finish quantities', source: 'QDHZMg/OrderMg/Frm_DateFinishListZZWh.cs', kind: 'list', status: 'todo' },
  { id: 'FrmReportProduceHourJiepaiList', title: 'Hourly output', source: 'QDHZMg/OrderMg/FrmReportProduceHourJiepaiList.cs', kind: 'list', status: 'in-progress', route: '/work-orders/hourly-output' },
  { id: 'FrmBoxFinishNoPalletLogList', title: 'Boxes finished without pallet', source: 'QDHZMg/OrderMg/FrmBoxFinishNoPalletLogList.cs', kind: 'list', status: 'todo' },
  { id: 'FrmBoxFinishNoPalletLogListDelete', title: 'Box log deletion', source: 'QDHZMg/OrderMg/FrmBoxFinishNoPalletLogListDelete.cs', kind: 'dialog', status: 'todo' },
  { id: 'Frm_ExcelJieDu', title: 'Order archive read', source: 'QDHZMg/OrderMg/Frm_ExcelJieDu.cs', kind: 'dialog', status: 'todo' },
  { id: 'Frm_CreateSNProcessMessage', title: 'SN creation progress', source: 'QDHZMg/OrderMg/Frm_CreateSNProcessMessage.cs', kind: 'dialog', status: 'todo' },
  { id: 'Frm_ProcessDialog', title: 'Progress dialog', source: 'QDHZMg/OrderMg/Frm_ProcessDialog.cs', kind: 'dialog', status: 'todo' },
  { id: 'Frm_OrderSNPrintMessage', title: 'SN print result', source: 'QDHZMg/OrderMg/Frm_OrderSNPrintMessage.cs', kind: 'dialog', status: 'todo' },
]

export const ORDER_MANAGEMENT_FORM_IDS = ORDER_MANAGEMENT_FORMS.map(({ id }) => id)
