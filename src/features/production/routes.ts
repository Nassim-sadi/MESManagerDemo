import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'production',
    name: 'production',
    meta: {
      title: 'Production',
      icon: 'pi pi-building',
      order: 20,
      showInMenu: true,
      permissions: [PERMISSIONS.productionView],
    },
    children: [
      {
        path: 'lines',
        name: 'production-lines',
        component: () => import('./pages/ProductionLinesPage.vue'),
        meta: {
          title: 'Production Lines',
          icon: 'pi pi-th-large',
          order: 1,
          showInMenu: true,
        },
      },
      {
        path: 'lines/:id',
        name: 'production-line-detail',
        component: () => import('./pages/ProductionLineDetailPage.vue'),
        meta: {
          title: 'Line detail',
          showInMenu: false,
        },
      },
    ],
  },
]

export default routes
