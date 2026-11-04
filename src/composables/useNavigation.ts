import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mainRoutes } from '@/router/feature-routes'
import { buildNavigation, type NavItem } from '@/router/navigation'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Navigation tree for the top bar. Built from the route records, so the
 * menu can never drift away from the router, and filtered by the
 * permissions of the signed in user. Labels resolve through i18n and
 * re-compute when the locale changes.
 */
export function useNavigation() {
  const auth = useAuthStore()
  const { locale } = useI18n()

  const items = computed<NavItem[]>(() => {
    // `buildNavigation` reads the locale while translating labels.
    locale.value
    const tree = buildNavigation(mainRoutes)

    const isAllowed = (item: NavItem): boolean =>
      !item.permissions?.length || auth.hasEveryPermission(item.permissions)

    return tree.flatMap((item) => {
      const children = item.children.filter(isAllowed)

      // A group is only useful when at least one child survived the filter.
      if (item.children.length) {
        return children.length ? [{ ...item, children }] : []
      }

      return isAllowed(item) ? [item] : []
    })
  })

  return { items }
}
