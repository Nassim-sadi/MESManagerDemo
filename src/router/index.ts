import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { installGuards } from './guards'
import { authRoutes, mainRoutes } from './feature-routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: AuthLayout,
    meta: { title: 'Sign in', requiresAuth: false },
    children: authRoutes,
  },
  {
    path: '/',
    component: MainLayout,
    meta: { title: 'MES Manager', requiresAuth: true },
    children: [...mainRoutes, { path: '', redirect: { name: 'dashboard' } }],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/features/errors/pages/NotFoundPage.vue'),
    meta: { title: 'Page not found', requiresAuth: false, showInMenu: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

installGuards(router)

export default router
