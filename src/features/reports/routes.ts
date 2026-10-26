import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'reports',
    name: 'reports',
    component: () => import('./pages/ReportsPage.vue'),
    meta: {
      title: 'Reports', titleKey: 'reports',
      icon: 'pi pi-chart-bar',
      order: 60,
      showInMenu: true,
      permissions: [PERMISSIONS.reportsView],
    },
  },
]

export default routes
