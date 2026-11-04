import type { FeatureRoutes } from '@/router/types'
import { PERMISSIONS } from '@/types/permissions'

const routes: FeatureRoutes = [
  {
    path: 'system',
    name: 'system',
    meta: {
      title: 'System',
      titleKey: 'system',
      icon: 'pi pi-cog',
      order: 90,
      showInMenu: true,
    },
    children: [
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
          permissions: [PERMISSIONS.rolesManage],
        },
      },
      //translations
      {
        path: 'translations',
        name: 'translations',
        component: () => import('./pages/TranslationsPage.vue'),
        meta: {
          title: 'Translations',
          titleKey: 'translations.translations',
          icon: 'pi pi-language',
          order: 3,
          showInMenu: true,
          permissions: [PERMISSIONS.translationsManage],
        },
      },
    ],
  },
]

export default routes
