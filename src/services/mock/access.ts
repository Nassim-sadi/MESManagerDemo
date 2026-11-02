import { useAuthStore } from '@/stores/auth.store'
import type { PageResult } from '@/types/api'
import { DEMO_FACTORY_CODE, WAREHOUSE_OPTIONS } from '@/features/users/types'

/** All seeded operational records currently belong to the demo Bratislava factory. */
export function hasSeededFactoryData(): boolean {
  return useAuthStore().user?.factoryCode === DEMO_FACTORY_CODE
}

export function allowedWarehouseCodes(): string[] {
  const auth = useAuthStore()
  const codes = auth.user?.warehouseCodes ?? []
  if (auth.user?.role === 'admin' && codes.length === 0) {
    return WAREHOUSE_OPTIONS.map(({ code }) => code)
  }
  return codes
}

export function warehouseCode(name: string): string {
  return name.slice(0, 5)
}

export function canAccessWarehouse(name: string): boolean {
  return allowedWarehouseCodes().includes(warehouseCode(name))
}

export function emptyPage<T>(): PageResult<T> {
  return { items: [], total: 0 }
}
