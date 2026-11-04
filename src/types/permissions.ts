export const PERMISSIONS = {
  systemMenuView: 'system-menu:view',
  workOrdersView: 'work-orders:view',
  workOrdersEdit: 'work-orders:edit',
  workOrdersCreate: 'work-orders:create',
  workOrdersStatus: 'work-orders:change-status',
  workOrdersDelete: 'work-orders:delete',
  productionReportView: 'order-management:production-report:view',
  usersManage: 'users:manage',
  rolesManage: 'roles:manage',
  translationsManage: 'translations:manage',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export interface PermissionGroup {
  key: string
  label: string
  permissions: { code: Permission; label: string }[]
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: 'main-menu',
    label: 'Main menu',
    permissions: [{ code: PERMISSIONS.systemMenuView, label: 'View system modules' }],
  },
  {
    key: 'work-orders',
    label: 'Order Management',
    permissions: [
      { code: PERMISSIONS.workOrdersView, label: 'View work orders' },
      { code: PERMISSIONS.workOrdersCreate, label: 'Create work orders' },
      { code: PERMISSIONS.workOrdersStatus, label: 'Change work order status' },
      { code: PERMISSIONS.workOrdersDelete, label: 'Delete work orders' },
      { code: PERMISSIONS.productionReportView, label: 'View production report' },
    ],
  },
  {
    key: 'access',
    label: 'Users & Access',
    permissions: [
      { code: PERMISSIONS.usersManage, label: 'Manage users' },
      { code: PERMISSIONS.rolesManage, label: 'Manage roles and permissions' },
      { code: PERMISSIONS.translationsManage, label: 'Manage translations' },
    ],
  },
]

export const PERMISSION_CATALOG = PERMISSION_GROUPS.flatMap((group) => group.permissions)

export const ALL_PERMISSIONS = PERMISSION_CATALOG.map(({ code }) => code)

/** Expand legacy permission codes while stored demo accounts are migrated. */
export function migratePermissions(codes: string[]): Permission[] {
  const migrated = new Set(
    codes.filter((code): code is Permission => ALL_PERMISSIONS.includes(code as Permission)),
  )
  if (codes.includes(PERMISSIONS.workOrdersEdit)) {
    migrated.add(PERMISSIONS.workOrdersCreate)
    migrated.add(PERMISSIONS.workOrdersStatus)
  }
  if (codes.includes('dashboard:view')) {
    migrated.add(PERMISSIONS.systemMenuView)
  }
  if (codes.includes('reports:view') || codes.includes('reports:run')) {
    migrated.add(PERMISSIONS.productionReportView)
  }
  return [...migrated]
}
