<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Menu from 'primevue/menu'
import Avatar from 'primevue/avatar'
import Dialog from 'primevue/dialog'
import { useAppStore } from '@/stores/app.store'
import type { AppLocale } from '@/plugins/i18n'
import { useAuthStore } from '@/stores/auth.store'

const props = defineProps<{
  languageOptions: { code: AppLocale; label: string }[]
}>()

const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()
const { t } = useI18n()
const menu = ref<InstanceType<typeof Menu>>()
const languageVisible = ref(false)

function selectLanguage(locale: AppLocale): void {
  app.setLang(locale)
  languageVisible.value = false
}

const items = computed(() => [
  {
    label: t('auth.menu.member'),
    items: [
      {
        label: auth.user?.name ?? 'Operator',
        disabled: true,
      },
      {
        label: t('auth.menu.roleValue', {
          role: auth.user?.roleName ?? t(`auth.roles.${auth.user?.role ?? 'operator'}`),
        }),
        disabled: true,
      },
    ],
  },
  {
    label: t('auth.menu.account'),
    items: [
      {
        label: t('auth.menu.profile'),
        icon: 'pi pi-user',
        command: () => router.push({ name: 'settings' }),
      },
      {
        label: t('auth.menu.preferences'),
        icon: 'pi pi-sliders-h',
        command: () => router.push({ name: 'settings' }),
      },
      {
        label: t('topbar.language'),
        icon: 'pi pi-globe',
        command: () => {
          languageVisible.value = true
        },
      },
      {
        label: t('auth.menu.lock'),
        icon: 'pi pi-lock',
        command: () => {
          auth.logout()
          router.push({ name: 'login' })
        },
      },
    ],
  },
  {
    label: t('auth.menu.session'),
    items: [
      {
        label: t('auth.menu.logout'),
        icon: 'pi pi-sign-out rtl-flip',
        command: () => {
          auth.logout()
          router.push({ name: 'login' })
        },
      },
    ],
  },
])

const initials = (auth.user?.name ?? 'OP')
  .split(' ')
  .map((part) => part.charAt(0))
  .join('')
  .slice(0, 2)
  .toUpperCase()
</script>

<template>
  <button type="button" class="user-menu" @click="menu?.toggle($event)">
    <Avatar
      :image="auth.user?.avatarUrl || undefined"
      :label="initials"
      shape="circle"
      size="normal"
      class="user-menu__avatar"
    />
    <span class="user-menu__meta">
      <span class="user-menu__name">{{ auth.user?.name ?? 'Operator' }}</span>
      <span class="user-menu__role">{{
        auth.user?.roleName ?? auth.user?.role ?? 'operator'
      }}</span>
    </span>
    <i class="pi pi-chevron-down user-menu__caret" />
  </button>

  <Menu ref="menu" :model="items" :popup="true" />

  <Dialog
    v-model:visible="languageVisible"
    :header="t('topbar.language')"
    modal
    :style="{ width: 'min(22rem, 92vw)' }"
  >
    <div class="language-options" role="radiogroup" :aria-label="t('topbar.language')">
      <button
        v-for="language in props.languageOptions"
        :key="language.code"
        type="button"
        class="language-option"
        role="radio"
        :aria-checked="app.lang === language.code"
        :class="{ 'language-option--selected': app.lang === language.code }"
        @click="selectLanguage(language.code)"
      >
        <span>{{ language.label }}</span>
        <i v-if="app.lang === language.code" class="pi pi-check" aria-hidden="true" />
      </button>
    </div>
  </Dialog>
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

.language-options {
  display: grid;
  gap: 0.5rem;
}

.language-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 2.75rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--mes-border);
  border-radius: var(--mes-radius-sm);
  background: var(--mes-surface);
  color: var(--mes-text);
  cursor: pointer;
  text-align: start;
}

.language-option:hover,
.language-option--selected {
  border-color: var(--mes-accent);
  background: var(--mes-accent-soft);
}

.language-option--selected {
  color: var(--mes-accent);
  font-weight: 600;
}
</style>
