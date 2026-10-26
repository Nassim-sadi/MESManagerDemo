import type { RouteRecordRaw } from 'vue-router'

/**
 * Contract every feature route has to follow.
 * The navigation, the router guards and the breadcrumbs all read from this.
 */
export interface AppRouteMeta {
  /** Human readable label, also used for the browser title. */
  title: string
  /**
   * Optional i18n key for the title (`nav.*` namespace). When present the
   * navigation, breadcrumbs and the document title use `t(titleKey)`
   * instead of the raw `title`.
   */
  titleKey?: string
  /** PrimeIcons class, e.g. 'pi pi-building'. */
  icon?: string
  /** Sort order inside the navigation. */
  order?: number
  /** Set to false to keep a route out of the navigation (detail pages). */
  showInMenu?: boolean
  /** Defaults to true. Public screens opt out explicitly. */
  requiresAuth?: boolean
  /** Permission codes required to open the route. */
  permissions?: string[]
  /**
   * Route name of the navigation group this entry belongs to.
   * Lets a feature render inside another module's group without
   * importing that module's routes.
   */
  group?: string
  /** Which shell renders the route. */
  layout?: 'main' | 'auth'
}

declare module 'vue-router' {
  interface RouteMeta extends AppRouteMeta {}
}

/** Shape every `features/<name>/routes.ts` file has to export. */
export type FeatureRoutes = RouteRecordRaw[]
