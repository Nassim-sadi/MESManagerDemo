<script setup lang="ts">
import { computed, ref } from 'vue'
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useI18n } from 'vue-i18n'
import type { LoginRole } from '../types'

const props = defineProps<{
  name: string
  role: string
  shift: string
  error?: string | null
  loading?: boolean
  manual?: boolean
  username?: string
  manualRole?: LoginRole
}>()

const { t } = useI18n()

const emit = defineEmits<{
  submit: [password: string]
  back: []
  'update:username': [value: string]
  'update:manualRole': [value: LoginRole]
}>()

const password = ref('')

const roles = computed<{ label: string; value: LoginRole }[]>(() => [
  { label: t('auth.roles.operator'), value: 'operator' },
  { label: t('auth.roles.supervisor'), value: 'supervisor' },
  { label: t('auth.roles.admin'), value: 'admin' },
])

function onSubmit(): void {
  if (!password.value) return
  emit('submit', password.value)
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>

<template>
  <form class="step" @submit.prevent="onSubmit">
    <button type="button" class="step__back" @click="emit('back')">
      <i class="pi pi-arrow-left rtl-flip" />
      <span>{{ props.manual ? t('auth.password.backToProfiles') : t('auth.password.chooseAnotherProfile') }}</span>
    </button>

    <template v-if="props.manual">
      <div class="step__row">
        <label class="step__field">
          <span class="step__label">{{ t('auth.password.userName') }}</span>
          <InputText
            :model-value="props.username"
            autocomplete="username"
            :placeholder="t('auth.password.usernamePlaceholder')"
            fluid
            @update:model-value="emit('update:username', $event ?? '')"
          />
        </label>

        <label class="step__field">
          <span class="step__label">{{ t('auth.password.role') }}</span>
          <Select
            :model-value="props.manualRole"
            :options="roles"
            option-label="label"
            option-value="value"
            fluid
            @update:model-value="emit('update:manualRole', $event as LoginRole)"
          />
        </label>
      </div>
    </template>

    <div v-else class="step__identity">
      <span class="step__avatar" :data-role="role">{{ initials(name) }}</span>
      <div>
        <p class="step__name">{{ name }}</p>
        <p class="step__meta">{{ role }} · {{ shift }}</p>
      </div>
    </div>

    <label class="step__field">
      <span class="step__label">{{ t('auth.password.password') }}</span>
      <Password
        v-model="password"
        :feedback="false"
        toggle-mask
        autocomplete="current-password"
        fluid
        input-class="w-full"
        :placeholder="t('auth.password.passwordPlaceholder')"
      />
    </label>

    <Message v-if="error" severity="error" :closable="false" class="step__error">
      {{ error }}
    </Message>

    <Button
      type="submit"
      :label="t('auth.signIn')"
      icon="pi pi-sign-in"
      :loading="loading"
      :disabled="!password || (props.manual && !props.username)"
      fluid
    />

    <p class="step__hint">{{ t('auth.password.hint') }}</p>
  </form>
</template>

<style scoped>
.step {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.step__back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  align-self: flex-start;
  padding: 0.15rem 0;
  background: none;
  border: 0;
  color: var(--mes-text-muted);
  font-size: var(--mes-fs-sm);
  cursor: pointer;
}

.step__back:hover {
  color: var(--mes-accent);
}

.step__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.step__identity {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.75rem;
  background: var(--mes-surface-sunken);
  border: 1px solid var(--mes-border);
  border-radius: var(--mes-radius);
}

.step__avatar {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--mes-accent-soft);
  color: var(--mes-accent);
  font-size: 13px;
  font-weight: 700;
}

.step__avatar[data-role='supervisor'] {
  background: var(--mes-role-supervisor-bg);
  color: var(--mes-role-supervisor-fg);
}

.step__avatar[data-role='admin'] {
  background: var(--mes-role-admin-bg);
  color: var(--mes-role-admin-fg);
}

.step__name {
  margin: 0;
  font-size: var(--mes-fs-lg);
  font-weight: 600;
  color: var(--mes-text-strong);
}

.step__meta {
  margin: 0.1rem 0 0;
  font-size: 11px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--mes-text-muted);
}

.step__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.step__label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--mes-text-muted);
}

.step__error {
  margin: 0;
}

.step__hint {
  margin: 0;
  font-size: 11px;
  color: var(--mes-text-faint);
}

@media (max-width: 480px) {
  .step__row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
