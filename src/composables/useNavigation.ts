import { computed } from 'vue'
import { mainRoutes } from '@/router/feature-routes'
import { buildNavigation, type NavItem } from '@/router/navigation'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Navigation tree for the top bar. Built from the route records, so the
 * menu can never drift away from the router, and filtered by the
 * permissions of the signed in user.
 */
export function useNavigation() {
  const auth = useAuthStore()

  const items = computed<NavItem[]>(() => {
    const tree = buildNavigation(mainRoutes)

    const isAllowed = (item: NavItem): boolean =>
      !item.permissions?.length || auth.hasEveryPermission(item.permissions)

    return tree
      .filter(isAllowed)
      .map((item) => ({ ...item, children: item.children.filter(isAllowed) }))
  })

  return { items }
}
