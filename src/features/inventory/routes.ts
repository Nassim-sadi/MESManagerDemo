import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'inventory',
    name: 'inventory',
    meta: {
      title: 'Inventory', titleKey: 'inventory',
      icon: 'pi pi-box',
      order: 50,
      showInMenu: true,
      permissions: [PERMISSIONS.inventoryView],
    },
    children: [
      {
        path: 'stock',
        name: 'inventory-stock',
        component: () => import('./pages/StockOverviewPage.vue'),
        meta: {
          title: 'Stock Overview', titleKey: 'stockOverview',
          icon: 'pi pi-warehouse',
          order: 1,
          showInMenu: true,
        },
      },
      {
        path: 'movements',
        name: 'inventory-movements',
        component: () => import('./pages/MaterialMovementsPage.vue'),
        meta: {
          title: 'Material Movements', titleKey: 'materialMovements',
          icon: 'pi pi-arrow-right-arrow-left',
          order: 2,
          showInMenu: true,
        },
      },
    ],
  },
]

export default routes
