export interface StockRow {
  wareHouseCode: string; wareHouseName: string; model: string; modelDesc: string; modelDesc2: string;
  color: string; palletCode: string; boxCode: string; qty: string; fromStyle: string
}

/** Visible Frm_StockListHz columns in source order. */
export const STOCK_COLUMNS: { field: keyof StockRow; header: string }[] = [
  'wareHouseCode','wareHouseName','model','modelDesc','modelDesc2','color','palletCode','boxCode','qty','fromStyle',
].map((field) => ({ field: field as keyof StockRow, header: field }))

export const SAMPLE_STOCK: StockRow[] = Array.from({ length: 8 }, (_, i) => ({
  wareHouseCode: i < 4 ? 'WH-01' : 'WH-02', wareHouseName: i < 4 ? 'WH-01 Raw material' : 'WH-02 Components',
  model: i % 2 ? 'MODEL-X2' : 'MODEL-X1', modelDesc: 'Refrigerator', modelDesc2: '', color: 'White',
  palletCode: `PAL-${String(i + 1).padStart(4, '0')}`, boxCode: `BOX-${String(i + 1).padStart(5, '0')}`,
  qty: String(24 + i * 6), fromStyle: '',
}))
