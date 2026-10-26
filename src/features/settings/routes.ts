import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'settings',
    name: 'settings',
    component: () => import('./pages/SettingsPage.vue'),
    meta: {
      title: 'Settings', titleKey: 'settings',
      icon: 'pi pi-cog',
      order: 90,
      showInMenu: true,
      permissions: [PERMISSIONS.settingsView],
    },
  },
]

export default routes
