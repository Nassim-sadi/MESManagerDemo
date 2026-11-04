export interface SourceOrderRow {
  supplierNo: string; orderCode: string; ischeck: string; LockStatus: string; lineName: string; lineSubName: string;
  planDate: string; model: string; modelDesc: string; modelDesc2: string; color: string; fromNo: string; toNo: string;
  qty: string; printQty: string; isUrgent: string; softwareVersion: string; exportCountry: string; commandNo: string;
  orderStatus: string; note: string; userName: string; createDate: string;
}

/** Visible business columns from Frm_OrderListWh; hidden factory fields and row number are excluded. */
export const ORDER_COLUMNS: { field: keyof SourceOrderRow; header: string }[] = [
  'supplierNo','orderCode','ischeck','LockStatus','lineName','lineSubName','planDate','model','modelDesc','modelDesc2',
  'color','fromNo','toNo','qty','printQty','isUrgent','softwareVersion','exportCountry','commandNo','orderStatus','note','userName','createDate',
].map((field) => ({ field: field as keyof SourceOrderRow, header: field }))

export const SAMPLE_ORDERS: SourceOrderRow[] = Array.from({ length: 8 }, (_, i) => ({
  supplierNo: `SUP-${String(i + 1).padStart(3, '0')}`, orderCode: `ORD-26030${i + 1}`,
  ischeck: '', LockStatus: '', lineName: `LINE-${String.fromCharCode(65 + i % 3)}`,
  lineSubName: `LINE-${String.fromCharCode(65 + i % 3)}-01`, planDate: `2026-11-${String(i + 3).padStart(2, '0')}`,
  model: i % 2 ? 'MODEL-X2' : 'MODEL-X1', modelDesc: 'Refrigerator', modelDesc2: '', color: 'White',
  fromNo: `SN-${String(i * 100 + 1).padStart(6, '0')}`, toNo: `SN-${String(i * 100 + 80).padStart(6, '0')}`,
  qty: '80', printQty: '80', isUrgent: '', softwareVersion: '', exportCountry: '', commandNo: '',
  orderStatus: '', note: '', userName: 'DEMO', createDate: `2026-11-${String(i + 1).padStart(2, '0')} 08:00:00`,
}))
