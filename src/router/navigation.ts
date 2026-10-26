import type { RouteRecordRaw } from 'vue-router'
import type { AppRouteMeta } from './types'
import { i18n } from '@/plugins/i18n'

export interface NavItem {
  label: string
  /** i18n key from `route.meta.titleKey` (falls back to the raw `title`). */
  titleKey: string
  icon?: string
  /** Absolute router path, e.g. '/production/lines'. */
  to: string
  order: number
  permissions?: string[]
  children: NavItem[]
}

interface NavEntry {
  item: NavItem
  /** Route name of the navigation group this entry belongs to. */
  group?: string
  /** Route name, used to resolve `group` references. */
  name?: string
}

function joinPath(base: string, path: string): string {
  if (!path) return base || '/'
  if (path.startsWith('/')) return path
  const left = base === '/' ? '' : base.replace(/\/$/, '')
  return `${left}/${path}`.replace(/\/{2,}/g, '/')
}

/**
 * Collects the menu entries of a route record.
 *
 * - a record with children and `showInMenu !== false` becomes a group
 * - a record with children and `showInMenu === false` is a routing container:
 *   its children are promoted so they can carry their own menu metadata
 * - a child with `meta.group` is detached from its parent and nested under
 *   the group with that route name
 */
function navLabel(meta: AppRouteMeta): string {
  return meta.titleKey ? i18n.global.t(meta.titleKey) : (meta.title ?? '')
}

function collect(record: RouteRecordRaw, basePath: string, out: NavEntry[]): void {
  const meta = (record.meta ?? {}) as AppRouteMeta
  const fullPath = joinPath(basePath, record.path)
  const children = record.children ?? []

  if (meta.showInMenu === false) {
    for (const child of children) collect(child, fullPath, out)
    return
  }

  if (children.length > 0) {
    const childEntries: NavEntry[] = []
    for (const child of children) collect(child, fullPath, childEntries)

    const own = childEntries.filter((entry) => !entry.group)
    const detached = childEntries.filter((entry) => entry.group)

    out.push({
      name: typeof record.name === 'string' ? record.name : undefined,
      item: {
        label: meta.title,
        titleKey: meta.titleKey ?? '',
        icon: meta.icon,
        to: fullPath,
        order: meta.order ?? 999,
        permissions: meta.permissions,
        children: own.map((entry) => entry.item),
      },
    })
    out.push(...detached)
    return
  }

  if (typeof record.component === 'undefined') return

  out.push({
    name: typeof record.name === 'string' ? record.name : undefined,
    group: meta.group,
    item: {
      label: meta.title,
      titleKey: meta.titleKey ?? '',
      icon: meta.icon,
      to: fullPath,
      order: meta.order ?? 999,
      permissions: meta.permissions,
      children: [],
    },
  })
}

function sortItems(items: NavItem[]): NavItem[] {
  return [...items]
    .sort((a, b) => a.order - b.order)
    .map((item) => ({ ...item, children: sortItems(item.children) }))
}

/**
 * Builds the navigation tree straight from the route records, so the
 * menu can never drift away from the router.
 */
export function buildNavigation(routes: RouteRecordRaw[], basePath = '/'): NavItem[] {
  const entries: NavEntry[] = []
  for (const record of routes) collect(record, basePath, entries)

  const topLevel = entries.filter((entry) => !entry.group)

  for (const entry of entries.filter((candidate) => candidate.group)) {
    const parent = topLevel.find((candidate) => candidate.name === entry.group)
    if (parent) {
      parent.item.children.push(entry.item)
    } else {
      topLevel.push(entry)
    }
  }

  return sortItems(topLevel.map((entry) => entry.item))
}
