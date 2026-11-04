export interface BomRow {
  model: string
  levelStr: string
  materialCode: string
  materialName: string
  repairStyle: string
  materialClass: string
  materialQty: string
  materialType: string
  materialUnit: string
}

/** Canonical Frm_BOMImport grid and workbook contract. */
export const BOM_COLUMNS: { field: keyof BomRow; header: string }[] = [
  { field: 'model', header: 'model' },
  { field: 'levelStr', header: 'levelStr' },
  { field: 'materialCode', header: 'materialCode' },
  { field: 'materialName', header: 'materialName' },
  { field: 'repairStyle', header: 'repairStyle' },
  { field: 'materialClass', header: 'materialClass' },
  { field: 'materialQty', header: 'materialQty' },
  { field: 'materialType', header: 'materialType' },
  { field: 'materialUnit', header: 'materialUnit' },
]

export const BOM_IMPORT_SHEET = 'BOMList'

export const BOM_SAMPLE_ROWS: BomRow[] = [
  { model: 'MODEL-X1', levelStr: '1', materialCode: 'MAT-0001', materialName: 'Main body', repairStyle: '', materialClass: '', materialQty: '1', materialType: '', materialUnit: '' },
  { model: 'MODEL-X1', levelStr: '1', materialCode: 'MAT-0002', materialName: 'Rear cover', repairStyle: '', materialClass: '', materialQty: '1', materialType: '', materialUnit: '' },
  { model: 'MODEL-X1', levelStr: '2', materialCode: 'MAT-0003', materialName: 'Screw', repairStyle: '', materialClass: '', materialQty: '4', materialType: '', materialUnit: '' },
  { model: 'MODEL-X1', levelStr: '2', materialCode: 'MAT-0004', materialName: 'Harness', repairStyle: '', materialClass: '', materialQty: '1', materialType: '', materialUnit: '' },
  { model: 'MODEL-X2', levelStr: '1', materialCode: 'MAT-0001', materialName: 'Main body', repairStyle: '', materialClass: '', materialQty: '1', materialType: '', materialUnit: '' },
  { model: 'MODEL-X2', levelStr: '1', materialCode: 'MAT-0005', materialName: 'Front panel', repairStyle: '', materialClass: '', materialQty: '1', materialType: '', materialUnit: '' },
  { model: 'MODEL-X2', levelStr: '2', materialCode: 'MAT-0003', materialName: 'Screw', repairStyle: '', materialClass: '', materialQty: '6', materialType: '', materialUnit: '' },
  { model: 'MODEL-X2', levelStr: '2', materialCode: 'MAT-0006', materialName: 'Seal', repairStyle: '', materialClass: '', materialQty: '1', materialType: '', materialUnit: '' },
]
