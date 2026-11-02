import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'print-barcode',
    name: 'print-barcode',
    component: () => import('./pages/PrintBarcodePage.vue'),
    meta: {
      title: 'Print & Barcode',
      titleKey: 'printBarcode',
      icon: 'pi pi-print',
      order: 70,
      showInMenu: true,
      permissions: [PERMISSIONS.traceabilityView],
    },
  },
]

export default routes
