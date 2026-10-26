import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'quality',
    name: 'quality',
    meta: {
      title: 'Quality', titleKey: 'quality',
      icon: 'pi pi-shield',
      order: 40,
      showInMenu: true,
      permissions: [PERMISSIONS.qualityView],
    },
    children: [
      {
        path: 'inspections',
        name: 'quality-inspections',
        component: () => import('./pages/InspectionsPage.vue'),
        meta: {
          title: 'Inspections', titleKey: 'inspections',
          icon: 'pi pi-verified',
          order: 1,
          showInMenu: true,
        },
      },
      {
        path: '',
        name: 'quality-defects',
        component: () => import('./pages/QualityPage.vue'),
        meta: {
          title: 'Defects', titleKey: 'defects',
          icon: 'pi pi-exclamation-circle',
          order: 2,
          showInMenu: true,
        },
      },
    ],
  },
]

export default routes
