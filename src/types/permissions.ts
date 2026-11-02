export const PERMISSIONS = {
  dashboardView: 'dashboard:view',
  alarmsAcknowledge: 'alarms:acknowledge',
  productionView: 'production:view',
  workOrdersView: 'work-orders:view',
  workOrdersEdit: 'work-orders:edit',
  workOrdersCreate: 'work-orders:create',
  workOrdersStatus: 'work-orders:change-status',
  workOrdersDelete: 'work-orders:delete',
  traceabilityView: 'traceability:view',
  qualityView: 'quality:view',
  inventoryView: 'inventory:view',
  reportsView: 'reports:view',
  reportsRun: 'reports:run',
  lineAssignmentsView: 'line-assignments:view',
  lineAssignmentsManage: 'line-assignments:manage',
  lineAssignmentsExport: 'line-assignments:export',
  lineAssignmentsPrint: 'line-assignments:print',
  settingsView: 'settings:view',
  settingsEdit: 'settings:edit',
  usersManage: 'users:manage',
  rolesManage: 'roles:manage',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export interface PermissionGroup {
  key: string
  label: string
  permissions: { code: Permission; label: string }[]
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  { key: 'dashboard', label: 'Dashboard', permissions: [
    { code: PERMISSIONS.dashboardView, label: 'View dashboard' },
    { code: PERMISSIONS.alarmsAcknowledge, label: 'Acknowledge alarms' },
  ] },
  { key: 'production', label: 'Production', permissions: [
    { code: PERMISSIONS.productionView, label: 'View production' },
  ] },
  { key: 'work-orders', label: 'Order Management', permissions: [
    { code: PERMISSIONS.workOrdersView, label: 'View work orders' },
    { code: PERMISSIONS.workOrdersCreate, label: 'Create work orders' },
    { code: PERMISSIONS.workOrdersStatus, label: 'Change work order status' },
    { code: PERMISSIONS.workOrdersDelete, label: 'Delete work orders' },
  ] },
  { key: 'traceability', label: 'Traceability', permissions: [
    { code: PERMISSIONS.traceabilityView, label: 'View traceability' },
  ] },
  { key: 'quality', label: 'Quality / OQC', permissions: [
    { code: PERMISSIONS.qualityView, label: 'View quality records' },
  ] },
  { key: 'inventory', label: 'Warehouse', permissions: [
    { code: PERMISSIONS.inventoryView, label: 'View warehouse data' },
  ] },
  { key: 'reports', label: 'Reports', permissions: [
    { code: PERMISSIONS.reportsView, label: 'View reports' },
    { code: PERMISSIONS.reportsRun, label: 'Run reports' },
  ] },
  { key: 'line-assignments', label: 'Line Assignments', permissions: [
    { code: PERMISSIONS.lineAssignmentsView, label: 'View line assignments' },
    { code: PERMISSIONS.lineAssignmentsManage, label: 'Import assignments' },
    { code: PERMISSIONS.lineAssignmentsExport, label: 'Export assignments' },
    { code: PERMISSIONS.lineAssignmentsPrint, label: 'Print assignments' },
  ] },
  { key: 'settings', label: 'Settings', permissions: [
    { code: PERMISSIONS.settingsView, label: 'View settings' },
    { code: PERMISSIONS.settingsEdit, label: 'Edit settings' },
  ] },
  { key: 'access', label: 'Users & Access', permissions: [
    { code: PERMISSIONS.usersManage, label: 'Manage users' },
    { code: PERMISSIONS.rolesManage, label: 'Manage roles and permissions' },
  ] },
]

export const PERMISSION_CATALOG = PERMISSION_GROUPS.flatMap((group) => group.permissions)

export const ALL_PERMISSIONS = PERMISSION_CATALOG.map(({ code }) => code)

/** Expand the legacy combined work-order edit permission during migration. */
export function migratePermissions(codes: string[]): Permission[] {
  const migrated = new Set(codes.filter((code): code is Permission =>
    ALL_PERMISSIONS.includes(code as Permission),
  ))
  if (codes.includes(PERMISSIONS.workOrdersEdit)) {
    migrated.add(PERMISSIONS.workOrdersCreate)
    migrated.add(PERMISSIONS.workOrdersStatus)
  }
  return [...migrated]
}
