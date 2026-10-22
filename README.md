# MES Manager

Manufacturing execution system (MES) front end — Vue 3, TypeScript, Vite and PrimeVue.
Desktop-first, industrial HMI look, built around work orders, live line status,
quality, inventory and serial traceability.

The project runs as a **demo** on generated in-app data. No backend is required; every
feature service mimics the latency and payload shape of a real endpoint, so the mock
layer can be swapped for the API without touching the pages.

## Getting started

```powershell
npm install
npm run dev          # http://localhost:5173
npm run type-check   # vue-tsc
npm run check:icons  # validate every PrimeIcons class against the package
npm run build        # production bundle
npm run preview      # serve the production bundle
```

## Sign in

The login screen is a **workstation profile picker**: the people who signed in on this
machine are listed as tiles, plus three seeded demo accounts so the screen is never
empty. Clicking a tile asks for the password of that profile; "Sign in manually" falls
back to a user name, role and password form.

Only the user name, the role and the last sign in are stored in `localStorage`
(`mes.profiles`) — never a password.

| Role       | Modules                                                        | Extra actions                |
| ---------- | -------------------------------------------------------------- | ---------------------------- |
| operator   | Dashboard, Production, Work Orders, Traceability                | read only                    |
| supervisor | + Quality, Inventory, Reports                                   | create / start work orders   |
| admin      | + Settings                                                      | everything                   |

## Project structure

```
src/
├── app/                     application setup (theme preset, providers)
├── assets/styles/           design tokens, base styles, PrimeVue overrides
├── layouts/                 MainLayout (top bar + workspace) and AuthLayout
├── router/
│   ├── types.ts             AppRouteMeta contract + RouteMeta augmentation
│   ├── feature-routes.ts    collects every features/**/routes.ts (import.meta.glob)
│   ├── navigation.ts        builds the navigation tree from the route records
│   ├── guards.ts            authentication + permission guards
│   └── index.ts             router assembly
├── components/
│   ├── layout/              AppTopBar, AppBreadcrumb, UserMenu
│   └── shared/              PageHeader, StatusTag, EmptyState
├── features/                one folder per MES module
│   ├── auth/                login, profile picker
│   ├── dashboard/           production overview
│   ├── production/          production lines and stations
│   ├── work-orders/         work order table, detail page, create dialog
│   ├── traceability/        serial number search, product history
│   ├── quality/             inspections, defects
│   ├── inventory/           stock overview, material movements
│   ├── reports/             report catalogue
│   ├── settings/            plant defaults and thresholds
│   └── errors/              404 page
├── services/
│   ├── http.ts              axios instance (base URL, bearer token, 401 handling)
│   └── mock/                demo data generator with simulated latency
├── stores/                  auth, app shell and alarms (global state only)
├── composables/             useDataTable (paging/sorting state), useNavigation (nav tree)
├── types/                   shared domain entities, api and permission types
└── utils/                   formatting and status tone helpers
```

Every feature folder follows the same layout:

```
features/<feature>/
├── routes.ts        route definitions + navigation metadata
├── pages/           routed screens
├── components/      components used only by this feature
├── services/        data access (mock today, HTTP later)
└── types/           feature specific types
```

## Navigation

The header has two levels:

* **Level 1** (dark, 56 px): brand and home link, the module navigation, and on the
  right the clock, the alarm badge and the operator menu. Modules with children open a
  light dropdown panel; single pages are direct links. The active module carries the
  blue highlight.
* **Level 2** (38 px, slightly lighter navy): the breadcrumb trail of the current page
  on the left, the plant and shift selectors on the right.

The menu is generated from the route records, never from a second, hand written menu
list (`composables/useNavigation.ts` builds the tree and applies the permission
filter).

```
Dashboard                    /dashboard
PRODUCTION
  Production Lines           /production/lines
  Work Orders                /work-orders
TRACEABILITY
  Serial Number Search       /traceability
  Product History            /traceability/product-history
QUALITY
  Inspections                /quality/inspections
  Defects                    /quality
INVENTORY
  Stock Overview             /inventory/stock
  Material Movements         /inventory/movements
REPORTS                      /reports
SETTINGS                     /settings
```

Breadcrumbs live in the second header level, so the current page is always visible
while the content scrolls.

## Adding a module

1. Create `features/<feature>/` with `pages/`, `services/`, `types/` and `routes.ts`.
2. Describe the routes:

```ts
import type { FeatureRoutes } from '@/router/types'

const routes: FeatureRoutes = [
  {
    path: 'my-module',
    name: 'my-module',
    meta: { title: 'My module', icon: 'pi pi-box', order: 60, showInMenu: true },
    children: [
      {
        path: '',
        name: 'my-module-list',
        component: () => import('./pages/MyModulePage.vue'),
        meta: { title: 'Overview', icon: 'pi pi-list', order: 1, showInMenu: true },
      },
      {
        path: ':id',
        name: 'my-module-detail',
        component: () => import('./pages/MyModuleDetailPage.vue'),
        meta: { title: 'Detail', showInMenu: false },
      },
    ],
  },
]

export default routes
```

3. Nothing else. `router/feature-routes.ts` picks the file up at build time via
   `import.meta.glob`, the top bar menu is generated from the same metadata and the
   guard protects the route automatically.

### Route metadata

| Key              | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| `title`          | label in the navigation, breadcrumb and browser title          |
| `icon`           | PrimeIcons class                                                |
| `order`          | position in the navigation                                      |
| `showInMenu`     | `false` keeps detail pages out of the navigation                |
| `requiresAuth`   | defaults to `true`; public screens opt out explicitly          |
| `permissions`    | permission codes required to open the route (UX level)          |
| `group`          | route name of the group this entry is nested into               |
| `layout`         | `auth` renders the route inside `AuthLayout` (login, ...)       |

A group route without a component is a pass-through: its children render directly in
the `MainLayout` router view, so no extra layout files are needed. `meta.group` lets an
independent feature appear inside another module's group (Work Orders under Production)
without importing that module's routes.

## Design system

* Tokens live in `src/assets/styles/variables.css` (palette, type scale, layout metrics).
* The PrimeVue theme is a customised Aura preset in `src/app/theme.ts`; only structural
  tweaks PrimeVue does not expose as tokens live in `primevue-overrides.css`.
* Palette: canvas `#EEF2F5`, navigation `#172433`, accent `#2563A6`, text `#182635`,
  borders `#D7DEE5`. Green `#238457`, amber `#C28122` and red `#C43D3D` are reserved for
  operational status and never used decoratively.
* Panels are always neutral (white surface, 1px border). Status is carried by the tag
  chip, by a small status lamp on line cards and - for alarms - by the value itself,
  never by a coloured edge or a tinted block.
* Type scale: 12 / 13 / 14 / 15 / 23 px. Tables use 13 px with 11 px uppercase headers.
* Layout: two level header (56 px dark bar + 38 px context strip), content gutter 22 px.
  The whole navigation stays on one row down to 1366 px (module icons drop out below
  1340 px, the context strip below 1180 px).

## Connecting the real API

* `src/services/http.ts` already holds the axios instance, the bearer token and the
  global 401 handling.
* Replace the bodies of the functions in `features/*/services/*.service.ts` with HTTP
  calls — the pages only depend on the service signatures.
* Server side paging, filtering and sorting are already modelled (`PageQuery`,
  `PageResult`, `useDataTable`), which keeps large tables fast.

## Notes

* Frontend permission checks are only a usability feature — the API has to enforce them.
* Live status is polled every 5 s on the dashboard and only while the tab is visible.
* The demo runs on PrimeVue 4.5 (MIT). PrimeVue 5 is commercially licensed and needs a
  licence key, so the upgrade is a dependency bump rather than a rewrite.
