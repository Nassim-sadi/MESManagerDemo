import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import('./pages/DashboardPage.vue'),
    meta: {
      title: 'Dashboard',
      icon: 'pi pi-th-large',
      order: 10,
      showInMenu: true,
      permissions: [PERMISSIONS.dashboardView],
    },
  },
]

export default routes
