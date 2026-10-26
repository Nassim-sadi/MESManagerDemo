import type { FeatureRoutes } from '@/router/types'

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
    },
  },
]

export default routes
