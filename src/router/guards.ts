import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Demo guard. Swap `useAuthStore` for the real session handling once the
 * API is in place - the route contract stays exactly the same.
 */
export function installGuards(router: Router): void {
  router.beforeEach((to) => {
    const auth = useAuthStore()
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.name === 'login' && auth.isAuthenticated) {
      const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/dashboard'
      return redirect
    }

    const required = to.meta.permissions
    if (required?.length && !auth.hasEveryPermission(required)) {
      return { name: 'dashboard' }
    }

    return true
  })

  router.afterEach((to) => {
    const title = to.meta.title
    document.title = title ? `${title} · MES Manager` : 'MES Manager'
  })
}
