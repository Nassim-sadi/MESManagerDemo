export const PERMISSIONS = {
  dashboardView: 'dashboard:view',
  productionView: 'production:view',
  workOrdersView: 'work-orders:view',
  workOrdersEdit: 'work-orders:edit',
  workOrdersDelete: 'work-orders:delete',
  traceabilityView: 'traceability:view',
  qualityView: 'quality:view',
  inventoryView: 'inventory:view',
  reportsView: 'reports:view',
  settingsView: 'settings:view',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
