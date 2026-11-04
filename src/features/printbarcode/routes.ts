import type { FeatureRoutes } from '@/router/types'

const routes: FeatureRoutes = [{
  path: 'print-barcode', name: 'print-barcode', component: () => import('./pages/PrintBarcodePage.vue'),
  meta: { title: 'SN print', titleKey: 'printBarcode', icon: 'pi pi-print', order: 80, showInMenu: true, group: 'order-management' },
}]

export default routes
