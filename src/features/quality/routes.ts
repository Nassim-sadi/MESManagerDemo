import type { FeatureRoutes } from '@/router/types'

const routes: FeatureRoutes = [{
  path: 'quality', name: 'quality', meta: { title: 'Quality', titleKey: 'quality', icon: 'pi pi-shield', order: 40, showInMenu: true },
  children: [{
    path: 'bom-import', name: 'quality-bom-import', component: () => import('./pages/BomImportPage.vue'),
    meta: { title: 'BOM import', titleKey: 'bomImport', icon: 'pi pi-file-import', order: 1, showInMenu: true },
  }],
}]

export default routes
