import type { FeatureRoutes } from '@/router/types'

const routes: FeatureRoutes = [{
  path: 'inventory', name: 'inventory', meta: { title: 'Warehouse', titleKey: 'warehouse', icon: 'pi pi-box', order: 50, showInMenu: true },
  children: [{
    path: 'stock', name: 'inventory-stock', component: () => import('./pages/StockOverviewPage.vue'),
    meta: { title: 'Stock overview', titleKey: 'stockOverview', icon: 'pi pi-warehouse', order: 1, showInMenu: true },
  }],
}]

export default routes
