import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'production',
    name: 'production',
    meta: {
      title: 'Production',
      titleKey: 'production',
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
          titleKey: 'productionLines',
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
          titleKey: 'lineDetail',
          showInMenu: false,
        },
      },
      {
        path: 'reports/order-production',
        name: 'order-production-report',
        component: () => import('../reports/pages/OrderProductionReportPage.vue'),
        meta: {
          title: 'Order Production Report',
          titleKey: 'orderProductionReport',
          icon: 'pi pi-chart-bar',
          order: 3,
          showInMenu: true,
        },
      },
    ],
  },
]

export default routes
