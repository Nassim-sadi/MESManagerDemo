import type { FeatureRoutes } from './types'

/**
 * Every `features/<feature>/routes.ts` file is picked up automatically.
 * Adding a module to the MES never requires editing the router setup.
 */
const modules = import.meta.glob<FeatureRoutes>('../features/**/routes.ts', {
  eager: true,
  import: 'default',
})

export const featureRoutes: FeatureRoutes = Object.values(modules).flat()

/** Routes rendered inside the authentication shell (login, ...). */
export const authRoutes = featureRoutes.filter((route) => route.meta?.layout === 'auth')

/** Routes rendered inside the main application shell. */
export const mainRoutes = featureRoutes.filter((route) => route.meta?.layout !== 'auth')
