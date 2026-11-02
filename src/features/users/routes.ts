import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'users',
    name: 'users-management',
    component: () => import('./pages/UsersPage.vue'),
    meta: {
      title: 'Users',
      titleKey: 'Users.usersManagement',
      icon: 'pi pi-users',
      order: 1,
      showInMenu: true,
      group: 'settings',
      permissions: [PERMISSIONS.usersManage],
    },
  },
  {
    path: 'roles',
    name: 'roles-management',
    component: () => import('./pages/RolesPage.vue'),
    meta: {
      title: 'Roles & Permissions',
      titleKey: 'Users.rolesPermissions',
      icon: 'pi pi-shield',
      order: 2,
      showInMenu: true,
      group: 'settings',
      permissions: [PERMISSIONS.rolesManage],
    },
  },
]

export default routes
