import type { FeatureRoutes } from '@/router/types'

const routes: FeatureRoutes = [
  {
    path: '',
    name: 'login',
    component: () => import('./pages/LoginPage.vue'),
    meta: {
      title: 'Sign in', titleKey: 'signIn',
      layout: 'auth',
      requiresAuth: false,
      showInMenu: false,
    },
  },
]

export default routes
