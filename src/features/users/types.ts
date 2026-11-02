import type { Permission } from '@/types/permissions'

export interface FactoryOption {
  code: string
  name: string
}

export interface WarehouseOption {
  code: string
  name: string
}

export interface ManagedUser {
  id: string
  userCode: string
  username: string
  name: string
  department: string
  sex: string
  address: string
  telephone: string
  mobile: string
  fax: string
  email: string
  post: string
  active: boolean
  employmentStatus: 'Employed' | 'Not employed'
  backgroundAuthority: boolean
  foregroundAuthority: boolean
  factoryCode: string
  factoryName: string
  roleId: string
  avatarUrl: string
  shift: string
  warehouseCodes: string[]
}

export interface ManagedRole {
  id: string
  name: string
  permissions: Permission[]
}

export const FACTORY_OPTIONS: FactoryOption[] = [
  { code: 'F04', name: 'Plant 04 - Bratislava' },
  { code: 'F07', name: 'Plant 07 - Linz' },
  { code: 'F11', name: 'Plant 11 - Debrecen' },
]

export const DEPARTMENT_OPTIONS = [
  'Production',
  'Quality',
  'Warehouse',
  'Maintenance',
  'Administration',
]

export const SEX_OPTIONS = ['Unspecified', 'Female', 'Male']
export const EMPLOYMENT_OPTIONS: ManagedUser['employmentStatus'][] = ['Employed', 'Not employed']
export const SHIFT_OPTIONS = ['Shift A', 'Shift B', 'Shift C', 'All']

export const WAREHOUSE_OPTIONS: WarehouseOption[] = [
  { code: 'WH-01', name: 'WH-01 Raw material' },
  { code: 'WH-02', name: 'WH-02 Components' },
  { code: 'WH-03', name: 'WH-03 Finished goods' },
]

export const DEMO_FACTORY_CODE = 'F04'
