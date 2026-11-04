export interface HourlyOutputRow {
  workdate: string; lineSubCode: string; orderCode: string; model: string; hourTime: string
  hourOnly: number; planJiepai: number; realJiepai: number; productivity: number
  qcStdQty: number; qcQty: number; qcPercent: number; repairQty: number; repairPercent: number; createTime: string
}

/** FrmReportProduceHourJiepaiList visible business columns; id is hidden in source. */
export const HOURLY_OUTPUT_COLUMNS: { field: keyof HourlyOutputRow; header: string }[] = [
  { field: 'workdate', header: 'workdate' }, { field: 'lineSubCode', header: 'lineSubCode' },
  { field: 'orderCode', header: 'orderCode' }, { field: 'model', header: 'model' },
  { field: 'hourTime', header: 'hourTime' }, { field: 'hourOnly', header: 'hourOnly' },
  { field: 'planJiepai', header: 'planJiepai' }, { field: 'realJiepai', header: 'realJiepai' },
  { field: 'productivity', header: 'productivity' }, { field: 'qcStdQty', header: 'qcStdQty' },
  { field: 'qcQty', header: 'qcQty' }, { field: 'qcPercent', header: 'qcPercent' },
  { field: 'repairQty', header: 'repairQty' }, { field: 'repairPercent', header: 'repairPercent' },
  { field: 'createTime', header: 'createTime' },
]

export const HOURLY_OUTPUT_SAMPLE: HourlyOutputRow[] = Array.from({ length: 8 }, (_, i) => ({
  workdate: '2026-11-03', lineSubCode: 'LINE-A', orderCode: 'ORD-260301', model: 'MODEL-X1',
  hourTime: `${String(i + 8).padStart(2, '0')}-${String(i + 9).padStart(2, '0')}`, hourOnly: i + 8,
  planJiepai: 120, realJiepai: [112, 116, 118, 121, 117, 119, 114, 120][i]!,
  productivity: [93, 97, 98, 101, 98, 99, 95, 100][i]!, qcStdQty: 120,
  qcQty: [112, 116, 117, 120, 116, 118, 113, 119][i]!, qcPercent: [99, 100, 99, 99, 99, 99, 99, 99][i]!,
  repairQty: [2, 1, 1, 0, 1, 1, 1, 0][i]!, repairPercent: [2, 1, 1, 0, 1, 1, 1, 0][i]!,
  createTime: `2026-11-03 ${String(i + 9).padStart(2, '0')}:00:00`,
}))
