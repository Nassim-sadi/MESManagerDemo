<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import AppBreadcrumb from './AppBreadcrumb.vue'
import UserMenu from './UserMenu.vue'
import { useAppStore } from '@/stores/app.store'
import { useAlarmsStore } from '@/stores/alarms.store'
import { useNavigation } from '@/composables/useNavigation'
import type { NavItem } from '@/router/navigation'

const router = useRouter()
const route = useRoute()
const app = useAppStore()
const alarmStore = useAlarmsStore()
const { items } = useNavigation()

const menu = ref<InstanceType<typeof Menu>>()
const menuModel = ref<MenuItem[]>([])

const plants = ['Plant 04 - Bratislava', 'Plant 07 - Linz', 'Plant 11 - Debrecen']
const shifts = ['Shift A', 'Shift B', 'Shift C']

const now = ref(new Date())
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
  void alarmStore.refresh()
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

const clock = () =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now.value)

function isActive(item: NavItem): boolean {
  const path = route.path
  if (item.to === path) return true
  return item.children.some((child) => child.to === path)
}

function openGroup(event: Event, item: NavItem): void {
  menuModel.value = item.children.map((child) => ({
    label: child.label,
    icon: child.icon,
    command: () => router.push(child.to),
  }))
  menu.value?.toggle(event)
}
</script>

<template>
  <header class="topbar">
    <!-- Level 1: brand, navigation, session context -->
    <div class="topbar__main">
      <RouterLink to="/dashboard" class="topbar__brand" aria-label="MES Manager home">
        <span class="topbar__logo"><i class="pi pi-box" /></span>
        <span class="topbar__brand-text">
          <span class="topbar__name">MES Manager</span>
          <span class="topbar__tagline">Manufacturing Execution</span>
        </span>
      </RouterLink>

      <nav class="topbar__nav" aria-label="Main navigation">
        <template v-for="item in items" :key="item.to">
          <RouterLink
            v-if="!item.children.length"
            :to="item.to"
            class="topbar__link"
            :class="{ 'topbar__link--active': isActive(item) }"
          >
            <i v-if="item.icon" :class="item.icon" />
            <span>{{ item.label }}</span>
          </RouterLink>

          <button
            v-else
            type="button"
            class="topbar__link topbar__link--group"
            :class="{ 'topbar__link--active': isActive(item) }"
            :aria-haspopup="true"
            @click="openGroup($event, item)"
          >
            <i v-if="item.icon" :class="item.icon" />
            <span>{{ item.label }}</span>
            <i class="pi pi-chevron-down topbar__caret" />
          </button>
        </template>
      </nav>

      <div class="topbar__right">
        <span class="topbar__clock">{{ clock() }}</span>

        <Button
          icon="pi pi-bell"
          text
          severity="secondary"
          size="small"
          aria-label="Open alarms"
          class="topbar__bell-button"
          @click="router.push({ name: 'dashboard' })"
        >
          <template #icon>
            <span class="topbar__bell">
              <i class="pi pi-bell" />
              <Badge v-if="alarmStore.openCount" :value="alarmStore.openCount" severity="danger" />
            </span>
          </template>
        </Button>

        <UserMenu />
      </div>
    </div>

    <!-- Level 2: current page on the left, plant / shift on the right -->
    <div class="topbar__level2">
      <AppBreadcrumb variant="dark" />

      <div class="topbar__context">
        <Select
          v-model="app.plant"
          :options="plants"
          size="small"
          class="topbar__select"
          aria-label="Plant"
        />
        <Select
          v-model="app.shift"
          :options="shifts"
          size="small"
          class="topbar__select topbar__select--shift"
          aria-label="Shift"
        />
      </div>
    </div>

    <Menu ref="menu" :model="menuModel" :popup="true" />
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  background: var(--mes-nav);
  color: var(--mes-nav-text);
  border-bottom: 1px solid #101a26;
}

/* --- Level 1 ----------------------------------------------------------- */

.topbar__main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: var(--mes-header-height);
  padding: 0 0.75rem;
}

.topbar__brand {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding-right: 0.9rem;
  color: inherit;
  text-decoration: none;
}

.topbar__logo {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: var(--mes-radius-sm);
  background: var(--mes-accent);
  color: #fff;
  font-size: 0.8rem;
  flex: 0 0 auto;
}

.topbar__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.topbar__name {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f2f6fa;
  white-space: nowrap;
}

.topbar__tagline {
  font-size: 9px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--mes-nav-text-muted);
  white-space: nowrap;
}

.topbar__nav {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  height: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}

.topbar__nav::-webkit-scrollbar {
  display: none;
}

.topbar__link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.65rem;
  border: 0;
  border-radius: var(--mes-radius-sm);
  background: transparent;
  color: var(--mes-nav-text);
  font-size: var(--mes-fs-sm);
  white-space: nowrap;
  cursor: pointer;
  transition:
    background var(--mes-transition),
    color var(--mes-transition);
}

.topbar__link:hover {
  background: var(--mes-nav-hover);
  color: #f2f6fa;
}

.topbar__link--active {
  background: var(--mes-accent);
  color: #fff;
}

.topbar__link--active:hover {
  background: var(--mes-accent-hover);
  color: #fff;
}

.topbar__caret {
  font-size: 0.6rem;
  opacity: 0.7;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.topbar__clock {
  font-family: var(--mes-font-mono);
  font-size: 12.5px;
  color: #9fb3c6;
  background: rgba(255 255 255 / 5%);
  border: 1px solid rgba(255 255 255 / 12%);
  border-radius: var(--mes-radius-sm);
  padding: 0.25rem 0.5rem;
}

.topbar__bell-button.p-button {
  color: var(--mes-nav-text);
}

.topbar__bell-button.p-button:not(:disabled):hover {
  background: rgba(255 255 255 / 10%);
  color: #f2f6fa;
}

.topbar__bell {
  position: relative;
  display: inline-grid;
  place-items: center;
}

.topbar__bell :deep(.p-badge) {
  position: absolute;
  top: -0.4rem;
  right: -0.55rem;
  font-size: 0.5625rem;
  min-width: 14px;
  height: 14px;
  line-height: 14px;
}

/* --- Level 2 ----------------------------------------------------------- */

.topbar__level2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  height: var(--mes-header-sub-height);
  padding: 0 0.9rem;
  background: var(--mes-nav-sub);
  border-top: 1px solid var(--mes-nav-border);
}

.topbar__context {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.topbar__select {
  min-width: 8rem;
}

.topbar__select--shift {
  min-width: 6rem;
}

/* --- Dark form fields -------------------------------------------------- */

.topbar__select.p-select {
  background: rgba(255 255 255 / 6%);
  border-color: rgba(255 255 255 / 14%);
}

.topbar__select.p-select:not(.p-disabled):hover {
  background: rgba(255 255 255 / 12%);
}

.topbar__select :deep(.p-select-label) {
  color: #dbe4ec;
  font-size: 12px;
}

.topbar__select :deep(.p-select-dropdown) {
  color: #8fa3b6;
}

/* --- Narrow workstations ------------------------------------------------ */

@media (max-width: 1340px) {
  .topbar__link {
    padding: 0.45rem 0.5rem;
    font-size: 12.5px;
  }

  .topbar__link i:not(.topbar__caret) {
    display: none;
  }

  .topbar__select {
    min-width: 7rem;
  }

  .topbar__select--shift {
    min-width: 5.5rem;
  }
}

@media (max-width: 1180px) {
  .topbar__level2 {
    display: none;
  }
}
</style>
