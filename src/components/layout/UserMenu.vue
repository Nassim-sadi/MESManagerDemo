<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Menu from 'primevue/menu'
import Avatar from 'primevue/avatar'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const auth = useAuthStore()
const menu = ref<InstanceType<typeof Menu>>()

const items = [
  {
    label: 'Signed in as',
    items: [
      {
        label: auth.user?.name ?? 'Operator',
        disabled: true,
      },
      {
        label: `Role: ${auth.user?.role ?? 'operator'}`,
        disabled: true,
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => router.push({ name: 'settings' }),
      },
      {
        label: 'Preferences',
        icon: 'pi pi-sliders-h',
        command: () => router.push({ name: 'settings' }),
      },
      {
        label: 'Lock workstation',
        icon: 'pi pi-lock',
        command: () => {
          auth.logout()
          router.push({ name: 'login' })
        },
      },
    ],
  },
  {
    label: 'Session',
    items: [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          auth.logout()
          router.push({ name: 'login' })
        },
      },
    ],
  },
]

const initials = (auth.user?.name ?? 'OP')
  .split(' ')
  .map((part) => part.charAt(0))
  .join('')
  .slice(0, 2)
  .toUpperCase()
</script>

<template>
  <button type="button" class="user-menu" @click="menu?.toggle($event)">
    <Avatar :label="initials" shape="circle" size="normal" class="user-menu__avatar" />
    <span class="user-menu__meta">
      <span class="user-menu__name">{{ auth.user?.name ?? 'Operator' }}</span>
      <span class="user-menu__role">{{ auth.user?.role ?? 'operator' }}</span>
    </span>
    <i class="pi pi-chevron-down user-menu__caret" />
  </button>

  <Menu ref="menu" :model="items" :popup="true" />
</template>

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0.45rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--mes-radius);
  cursor: pointer;
  color: inherit;
}

.user-menu:hover {
  background: rgba(255 255 255 / 8%);
}

.user-menu__avatar {
  background: var(--mes-accent);
  color: #fff;
  font-size: 0.7rem;
  width: 28px;
  height: 28px;
}

.user-menu__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.user-menu__name {
  font-size: var(--mes-fs-sm);
  font-weight: 600;
  color: #e7eef4;
}

.user-menu__role {
  font-size: 10px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--mes-nav-text-muted);
}

.user-menu__caret {
  font-size: 0.65rem;
  color: var(--mes-nav-text-muted);
}
</style>
