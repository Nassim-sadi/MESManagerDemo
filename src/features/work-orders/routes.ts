import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'work-orders',
    name: 'order-management',
    meta: {
      title: 'Order Management', titleKey: 'orderManagement',
      icon: 'pi pi-list-check',
      order: 30,
      showInMenu: true,
    },
    children: [
      {
        path: '',
        name: 'work-orders-list',
        component: () => import('./pages/OrdersPage.vue'),
        meta: {
          title: 'Work Orders', titleKey: 'workOrders',
          icon: 'pi pi-list',
          order: 1,
          showInMenu: true,
          permissions: [PERMISSIONS.workOrdersView],
        },
      },
      {
        path: 'production-report',
        name: 'order-production-report',
        component: () => import('./pages/ProductionReportPage.vue'),
        meta: {
          title: 'Production Report',
          titleKey: 'orderProductionReport',
          icon: 'pi pi-chart-bar',
          order: 2,
          showInMenu: true,
          permissions: [PERMISSIONS.productionReportView],
        },
      },
      {
        path: 'hourly-output',
        name: 'hourly-output',
        component: () => import('./pages/HourlyOutputPage.vue'),
        meta: {
          title: 'Hourly output',
          titleKey: 'hourlyOutput',
          icon: 'pi pi-chart-line',
          order: 3,
          showInMenu: true,
          permissions: [PERMISSIONS.productionReportView],
        },
      },
    ],
  },
]

export default routes
