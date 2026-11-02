import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'line-assignments',
    name: 'line-assignments',
    component: () => import('./pages/LineAssignmentsPage.vue'),
    meta: {
      title: 'Line Assignments', titleKey: 'lineAssignments',
      icon: 'pi pi-sliders-h',
      order: 12,
      showInMenu: true,
      permissions: [PERMISSIONS.lineAssignmentsView],
    },
  },
]

export default routes
