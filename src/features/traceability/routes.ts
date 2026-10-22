import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'traceability',
    name: 'traceability',
    meta: {
      title: 'Traceability',
      icon: 'pi pi-search',
      order: 30,
      showInMenu: true,
      permissions: [PERMISSIONS.traceabilityView],
    },
    children: [
      {
        path: '',
        name: 'traceability-search',
        component: () => import('./pages/TraceabilityPage.vue'),
        meta: {
          title: 'Serial Number Search',
          icon: 'pi pi-barcode',
          order: 1,
          showInMenu: true,
        },
      },
      {
        path: 'product-history',
        name: 'traceability-product-history',
        component: () => import('./pages/ProductHistoryPage.vue'),
        meta: {
          title: 'Product History',
          icon: 'pi pi-history',
          order: 2,
          showInMenu: true,
        },
      },
    ],
  },
]

export default routes
