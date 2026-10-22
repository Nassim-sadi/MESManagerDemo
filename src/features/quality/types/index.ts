export interface NonConformance {
  id: string
  raisedAt: string
  serial: string
  workOrderId: string
  line: string
  defect: string
  severity: 'Minor' | 'Major' | 'Critical'
  disposition: 'Rework' | 'Scrap' | 'Use as is' | 'Pending'
  status: 'Open' | 'Closed'
}

export interface QualityFilters {
  search: string
  severity: NonConformance['severity'] | null
  status: NonConformance['status'] | null
}

export interface InspectionFilters {
  search: string
  type: 'Incoming' | 'In process' | 'Final' | null
  result: 'Pass' | 'Fail' | 'Conditional' | null
}
