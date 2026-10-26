import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    // routing container: the menu entry lives on the list route below
    path: 'work-orders',
    name: 'work-orders',
    meta: {
      title: 'Work orders', titleKey: 'workOrders',
      showInMenu: false,
    },
    children: [
      {
        path: '',
        name: 'work-orders-list',
        component: () => import('./pages/WorkOrdersPage.vue'),
        meta: {
          title: 'Work Orders', titleKey: 'workOrders',
          icon: 'pi pi-list-check',
          order: 2,
          showInMenu: true,
          group: 'production',
          permissions: [PERMISSIONS.workOrdersView],
        },
      },
      {
        path: ':id',
        name: 'work-order-detail',
        component: () => import('./pages/WorkOrderDetailPage.vue'),
        meta: {
          title: 'Work order detail', titleKey: 'workOrderDetail',
          showInMenu: false,
        },
      },
    ],
  },
]

export default routes
