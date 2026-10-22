import type {
  Alarm,
  AlarmSeverity,
  Inspection,
  LineStatus,
  MaterialMovement,
  ProductionLine,
  ReportDefinition,
  SerialStatus,
  SerialUnit,
  Station,
  StockItem,
  TravelerStep,
  WorkOrder,
  WorkOrderPriority,
  WorkOrderStatus,
} from '@/types/mes'
import { isoWithin, pick, randomInt, round } from './support'

const PRODUCTS = [
  'AX-200 Drive Housing',
  'AX-210 Drive Housing',
  'BR-410 Brake Rotor',
  'BR-430 Brake Rotor',
  'CH-120 Chassis Frame',
  'CH-140 Chassis Frame',
  'CV-700 Conveyor Module',
  'DV-900 Drive Unit',
  'EN-310 End Cap',
  'GC-500 Gear Carrier',
] as const

const OPERATORS = [
  'A. Fischer',
  'B. Nowak',
  'C. Duarte',
  'M. Keller',
  'R. Singh',
  'T. Lindqvist',
  'J. Moreau',
  'P. Nowicki',
] as const

const LINE_STATUSES: LineStatus[] = [
  'Running',
  'Running',
  'Running',
  'Setup',
  'Idle',
  'Down',
  'Maintenance',
]
const WORK_ORDER_STATUSES: WorkOrderStatus[] = [
  'Running',
  'Running',
  'Running',
  'Queued',
  'Queued',
  'Paused',
  'Hold',
  'Completed',
  'Completed',
]
const PRIORITIES: WorkOrderPriority[] = ['Low', 'Normal', 'Normal', 'Normal', 'High', 'Urgent']
const ALARM_SEVERITIES: AlarmSeverity[] = ['Critical', 'Warning', 'Warning', 'Info']
const SERIAL_STATUSES: SerialStatus[] = [
  'Passed',
  'Passed',
  'Passed',
  'In Process',
  'Failed',
  'Scrapped',
]

const WORKSTATIONS = ['SMT-01', 'ASSY-02', 'CNC-03', 'WELD-04', 'TEST-05', 'PACK-06']

function buildLines(): ProductionLine[] {
  return Array.from({ length: 10 }, (_, index) => {
    const id = `LINE-${String(index + 1).padStart(2, '0')}`
    const status = LINE_STATUSES[index % LINE_STATUSES.length] ?? 'Idle'
    const availability = status === 'Running' ? round(randomInt(88, 99)) : round(randomInt(35, 80))
    const performance = status === 'Running' ? round(randomInt(85, 99)) : round(randomInt(40, 85))
    const quality = round(randomInt(94, 99.9))

    return {
      id,
      name: `Line ${index + 1}`,
      status,
      product: pick(PRODUCTS),
      workOrderId: status === 'Running' ? `WO-26${String(400 + index).padStart(3, '0')}` : null,
      shift: index % 2 === 0 ? 'Shift A' : 'Shift B',
      operator: pick(OPERATORS),
      oee: round((availability / 100) * (performance / 100) * (quality / 100) * 100),
      availability,
      performance,
      quality,
      utilization: status === 'Running' ? round(randomInt(72, 98)) : round(randomInt(5, 60)),
      cycleTimeSec: randomInt(42, 96),
    }
  })
}

function buildWorkOrders(lines: ProductionLine[]): WorkOrder[] {
  return Array.from({ length: 268 }, (_, index) => {
    const line = lines[index % lines.length] ?? lines[0]!
    const status = pick(WORK_ORDER_STATUSES)
    const plannedQty = randomInt(120, 2400)
    const completedQty =
      status === 'Completed'
        ? plannedQty
        : status === 'Queued'
          ? 0
          : Math.min(plannedQty, Math.round(plannedQty * (randomInt(5, 92) / 100)))

    return {
      id: `WO-26${String(400 + index).padStart(3, '0')}`,
      product: pick(PRODUCTS),
      bom: `BOM-${String(randomInt(1000, 9999))}`,
      line: line.id,
      workstation: pick(WORKSTATIONS),
      status,
      priority: pick(PRIORITIES),
      plannedQty,
      completedQty,
      scrapQty: randomInt(0, 14),
      dueAt: isoWithin(-randomInt(-96, 72)),
      startedAt: status === 'Queued' ? null : isoWithin(randomInt(2, 60)),
      operator: pick(OPERATORS),
    }
  })
}

function buildAlarms(lines: ProductionLine[]): Alarm[] {
  const templates: { code: string; message: string }[] = [
    { code: 'AL-1042', message: 'Spindle vibration above threshold' },
    { code: 'AL-2210', message: 'Material starvation at infeed conveyor' },
    { code: 'AL-3318', message: 'Torque verification failed' },
    { code: 'AL-4471', message: 'Coolant level below minimum' },
    { code: 'AL-5503', message: 'Vision inspection camera not responding' },
    { code: 'AL-6120', message: 'Hydraulic pressure drop detected' },
  ]

  return Array.from({ length: 16 }, (_, index) => {
    const line = lines[index % lines.length] ?? lines[0]!
    const template = templates[index % templates.length]!

    return {
      id: `ALM-${String(9000 + index)}`,
      raisedAt: isoWithin(randomInt(1, 40)),
      line: line.id,
      code: template.code,
      message: template.message,
      severity: pick(ALARM_SEVERITIES),
      acknowledged: index > 2,
    }
  })
}

function buildSerialUnits(workOrders: WorkOrder[]): SerialUnit[] {
  return Array.from({ length: 640 }, (_, index) => {
    const workOrder = workOrders[index % workOrders.length] ?? workOrders[0]!
    const status = pick(SERIAL_STATUSES)

    return {
      sn: `SN${String(24_000_000 + index * 37).padStart(9, '0')}`,
      product: workOrder.product,
      workOrderId: workOrder.id,
      line: workOrder.line,
      status,
      producedAt: isoWithin(randomInt(1, 240)),
      operator: pick(OPERATORS),
      lots: [
        { material: 'MAT-8801', lot: `LOT-${randomInt(10000, 99999)}`, quantity: randomInt(1, 40) },
        { material: 'MAT-4412', lot: `LOT-${randomInt(10000, 99999)}`, quantity: randomInt(1, 12) },
      ],
    }
  })
}

const OPERATIONS = [
  { operation: 'PCB Assembly', station: 'SMT-01', machine: 'K&S 3DX' },
  { operation: 'Case Moulding', station: 'PRESS-02', machine: 'Husky 225' },
  { operation: 'Gear Pressing', station: 'CNC-03', machine: 'Mazak HCN' },
  { operation: 'Frame Welding', station: 'WELD-04', machine: 'FANUC ARC' },
  { operation: 'Final Assembly', station: 'ASSY-05', machine: 'Manual' },
  { operation: 'End-of-Line Test', station: 'TEST-06', machine: 'Keysight' },
]

export function buildTraveler(serial: SerialUnit): TravelerStep[] {
  // The routing runs backwards from the moment the unit was produced.
  const producedAt = new Date(serial.producedAt).getTime()
  const stepDuration = 45 * 60_000
  const passed = serial.status !== 'Failed'

  return OPERATIONS.map((operation, index) => {
    const offset = (OPERATIONS.length - index) * stepDuration
    const startedAt = new Date(producedAt - offset).toISOString()
    const endedAt = new Date(producedAt - offset + stepDuration * 0.8).toISOString()

    return {
      seq: (index + 1) * 10,
      operation: operation.operation,
      station: operation.station,
      machine: operation.machine,
      result: passed ? 'Pass' : index === OPERATIONS.length - 1 ? 'Fail' : 'Pass',
      startedAt,
      endedAt,
      operator: pick(OPERATORS),
    }
  })
}

const lines = buildLines()
const workOrders = buildWorkOrders(lines)

const STATION_NAMES = [
  'Soldering',
  'Press',
  'CNC Mill',
  'Weld Cell',
  'Assembly',
  'EOL Test',
  'Paint',
  'Packaging',
]

function buildStations(lines: ProductionLine[]): Station[] {
  return lines.flatMap((line) =>
    STATION_NAMES.slice(0, 4).map((name, index) => ({
      id: `${line.id}-${String(index + 1).padStart(2, '0')}`,
      name: `${name} ${index + 1}`,
      line: line.id,
      type: name,
      state:
        (['Available', 'Busy', 'Maintenance', 'Offline'] as const)[randomInt(0, 3)] ?? 'Available',
    })),
  )
}

const MATERIALS = [
  'Steel sheet 2 mm',
  'Casting blank A12',
  'Bearing 6204-2RS',
  'Seal kit hydraulic',
  'Fastener set M8',
  'Aluminium profile 40x40',
  'Cable harness 12 pin',
  'Paint RAL 7016',
  'Gasket set NBR',
  'Copper busbar 40x4',
] as const

const WAREHOUSES = ['WH-01 Raw material', 'WH-02 Components', 'WH-03 Finished goods'] as const

function buildStock(): StockItem[] {
  return Array.from({ length: 52 }, (_, index) => {
    const onHand = randomInt(0, 4200)
    const minLevel = randomInt(120, 900)

    return {
      id: `MAT-${4400 + index}`,
      description: pick(MATERIALS),
      warehouse: pick(WAREHOUSES),
      location: `A-${randomInt(1, 12)}-${randomInt(1, 9)}`,
      onHand,
      unit: pick(['pcs', 'kg', 'm']),
      minLevel,
      status: onHand === 0 ? 'Blocked' : onHand < minLevel ? 'Low' : 'Available',
    }
  })
}

function buildMovements(stock: StockItem[]): MaterialMovement[] {
  const types: MaterialMovement['type'][] = [
    'Goods receipt',
    'Issue to line',
    'Transfer',
    'Scrap',
    'Return',
  ]

  return Array.from({ length: 90 }, (_, index) => {
    const item = stock[index % stock.length] ?? stock[0]!
    const type = pick(types)
    const quantity =
      type === 'Scrap'
        ? randomInt(1, 12)
        : type === 'Transfer'
          ? randomInt(20, 400)
          : randomInt(50, 900)

    return {
      id: `MOV-${String(70000 + index)}`,
      material: item.id,
      description: item.description,
      type,
      quantity,
      unit: item.unit,
      reference:
        type === 'Goods receipt'
          ? `PO-${randomInt(10000, 99999)}`
          : type === 'Issue to line'
            ? `WO-26${String(400 + randomInt(0, 260)).padStart(3, '0')}`
            : `TRF-${randomInt(1000, 9999)}`,
      warehouse: item.warehouse,
      movedAt: isoWithin(randomInt(1, 240)),
      user: pick(OPERATORS),
    }
  })
}

function buildInspections(serialUnits: SerialUnit[]): Inspection[] {
  const types: Inspection['type'][] = ['Incoming', 'In process', 'Final']

  return Array.from({ length: 74 }, (_, index) => {
    const unit = serialUnits[index % serialUnits.length]!

    return {
      id: `INSP-${String(5000 + index)}`,
      type: pick(types),
      serial: unit.sn,
      station: pick(['QC-01 Incoming', 'LINE-QC In process', 'EOL-TEST Final']),
      result: pick(['Pass', 'Pass', 'Pass', 'Conditional', 'Fail'] as const),
      inspector: pick(OPERATORS),
      measured: `${randomInt(18, 480)}.${randomInt(0, 9)} mm`,
      inspectedAt: isoWithin(randomInt(1, 200)),
    }
  })
}

function buildReports(): ReportDefinition[] {
  const catalogue: { name: string; category: string; description: string }[] = [
    {
      name: 'Daily production summary',
      category: 'Production',
      description: 'Units produced, scrap and downtime per line for one day.',
    },
    {
      name: 'Work order status list',
      category: 'Production',
      description: 'Open work orders with progress, due date and line assignment.',
    },
    {
      name: 'Shift handover summary',
      category: 'Operations',
      description: 'Open alarms, held orders and notes for the incoming shift.',
    },
    {
      name: 'Serial number genealogy',
      category: 'Traceability',
      description: 'Routing history and material lots for produced serial numbers.',
    },
    {
      name: 'Non-conformance analysis',
      category: 'Quality',
      description: 'Defects by category, line, severity and disposition.',
    },
    {
      name: 'Stock on hand',
      category: 'Inventory',
      description: 'Material stock per warehouse including below-minimum items.',
    },
    {
      name: 'OEE by line',
      category: 'Operations',
      description: 'Availability, performance and quality split per line and shift.',
    },
    {
      name: 'Supplier incoming quality',
      category: 'Quality',
      description: 'Incoming inspection results per supplier and material group.',
    },
  ]

  return catalogue.map((entry, index) => ({
    id: `RPT-${String(100 + index)}`,
    name: entry.name,
    category: entry.category,
    description: entry.description,
    format: pick(['XLSX', 'CSV', 'PDF'] as const),
    owner: pick(OPERATORS),
    lastRunAt: isoWithin(randomInt(1, 96)),
  }))
}

const stockItems = buildStock()
const serialUnits = buildSerialUnits(workOrders)

export const mockData = {
  lines,
  workOrders,
  alarms: buildAlarms(lines),
  serialUnits,
  stations: buildStations(lines),
  stock: stockItems,
  movements: buildMovements(stockItems),
  inspections: buildInspections(serialUnits),
  reports: buildReports(),
}
