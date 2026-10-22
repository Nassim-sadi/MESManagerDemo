import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { PERMISSIONS } from '@/types/permissions'

export type UserRole = 'operator' | 'supervisor' | 'admin'

export interface AuthUser {
  id: string
  name: string
  role: UserRole
  permissions: string[]
  plant: string
  shift: string
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
    PERMISSIONS.productionView,
    PERMISSIONS.workOrdersView,
    PERMISSIONS.workOrdersEdit,
    PERMISSIONS.traceabilityView,
    PERMISSIONS.qualityView,
    PERMISSIONS.inventoryView,
    PERMISSIONS.reportsView,
  ],
  admin: [
    PERMISSIONS.dashboardView,
    PERMISSIONS.productionView,
    PERMISSIONS.workOrdersView,
    PERMISSIONS.workOrdersEdit,
    PERMISSIONS.workOrdersDelete,
    PERMISSIONS.traceabilityView,
    PERMISSIONS.qualityView,
    PERMISSIONS.inventoryView,
    PERMISSIONS.reportsView,
    PERMISSIONS.settingsView,
  ],
}

const TOKEN_KEY = 'mes.token'
const USER_KEY = 'mes.user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<AuthUser | null>(readStoredUser())

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const permissions = computed(() => user.value?.permissions ?? [])

  function readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
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
    return required.every((permission) => permissions.value.includes(permission))
  }

  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission)
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
