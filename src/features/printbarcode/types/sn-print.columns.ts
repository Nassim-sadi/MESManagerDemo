export interface SnPrintRow { sn: string; snshow: string; model: string; EAN: string }

/** PrintOrdersnInfo model fields consumed by the orderSN label dataset. */
export const SN_PRINT_COLUMNS: { field: keyof SnPrintRow; header: string }[] = [
  { field: 'sn', header: 'sn' }, { field: 'snshow', header: 'snshow' },
  { field: 'model', header: 'model' }, { field: 'EAN', header: 'EAN' },
]

export const SN_PRINT_SAMPLE: SnPrintRow[] = Array.from({ length: 8 }, (_, i) => ({
  sn: `SN-${String(i + 1).padStart(6, '0')}`,
  snshow: `SN-${String(i + 1).padStart(6, '0')}`,
  model: i < 4 ? 'MODEL-X1' : 'MODEL-X2',
  EAN: `69012345678${String(i).padStart(2, '0')}`,
}))
