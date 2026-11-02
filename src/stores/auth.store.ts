import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ALL_PERMISSIONS, migratePermissions, PERMISSIONS } from '@/types/permissions'

export type UserRole = string

export interface AuthUser {
  id: string
  userCode: string
  name: string
  role: UserRole
  roleName: string
  permissions: string[]
  plant: string
  factoryCode: string
  shift: string
  warehouseCodes: string[]
  avatarUrl: string
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  operator: [
    PERMISSIONS.dashboardView,
    PERMISSIONS.productionView,
    PERMISSIONS.workOrdersView,
    PERMISSIONS.traceabilityView,
  ],
  supervisor: [
    PERMISSIONS.dashboardView,
    PERMISSIONS.alarmsAcknowledge,
    PERMISSIONS.productionView,
    PERMISSIONS.workOrdersView,
    PERMISSIONS.workOrdersCreate,
    PERMISSIONS.workOrdersStatus,
    PERMISSIONS.traceabilityView,
    PERMISSIONS.qualityView,
    PERMISSIONS.inventoryView,
    PERMISSIONS.reportsView,
    PERMISSIONS.reportsRun,
    PERMISSIONS.lineAssignmentsView,
    PERMISSIONS.lineAssignmentsExport,
    PERMISSIONS.lineAssignmentsPrint,
  ],
  admin: [...ALL_PERMISSIONS],
}

const TOKEN_KEY = 'mes.token'
const USER_KEY = 'mes.user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<AuthUser | null>(readStoredUser())

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const permissions = computed(() => {
    const current = user.value
    if (!current) return []
    const currentPermissions = migratePermissions(current.permissions)
    if (current.role === 'admin') {
      return [...new Set([...currentPermissions, PERMISSIONS.usersManage, PERMISSIONS.rolesManage])]
    }
    return currentPermissions
  })

  function readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      const stored = JSON.parse(raw) as Partial<AuthUser>
      return {
        id: stored.id ?? '',
        userCode: stored.userCode ?? stored.name ?? '',
        name: stored.name ?? '',
        role: stored.role ?? 'operator',
        roleName: stored.roleName ?? stored.role ?? 'Operator',
        permissions: stored.permissions ?? [],
        plant: stored.plant ?? 'Plant 04 - Bratislava',
        factoryCode: stored.factoryCode ?? 'F04',
        shift: stored.shift ?? 'Shift A',
        warehouseCodes: stored.warehouseCodes ?? (stored.role === 'admin' ? ['WH-01', 'WH-02', 'WH-03'] : []),
        avatarUrl: stored.avatarUrl ?? '',
      }
    } catch {
      return null
    }
  }

  function setSession(nextToken: string, nextUser: AuthUser): void {
    token.value = nextToken
    user.value = nextUser
    localStorage.setItem(TOKEN_KEY, nextToken)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
  }

  function logout(): void {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  function hasEveryPermission(required: string[]): boolean {
    if (!required.length) return true
    return required.every((permission) => permissions.value.some((code) => code === permission))
  }

  function hasPermission(permission: string): boolean {
    return permissions.value.some((code) => code === permission)
  }

  return {
    token,
    user,
    isAuthenticated,
    permissions,
    setSession,
    logout,
    hasEveryPermission,
    hasPermission,
  }
})
