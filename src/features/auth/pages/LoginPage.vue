<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.store'
import { login } from '../services/auth.service'
import { listProfiles, rememberProfile } from '../services/profile.service'
import LoginProfileList from '../components/LoginProfileList.vue'
import LoginPasswordStep from '../components/LoginPasswordStep.vue'
import type { LoginRole, WorkstationProfile } from '../types'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { t } = useI18n()

type Step = 'profiles' | 'password'

const step = ref<Step>('profiles')
const profiles = ref<WorkstationProfile[]>(listProfiles())
const selected = ref<WorkstationProfile | null>(null)
const manual = ref(false)
const manualName = ref('')
const manualRole = ref<LoginRole>('operator')

const submitting = ref(false)
const errorMessage = ref<string | null>(null)

const identity = computed(() =>
  selected.value
    ? { name: selected.value.name, role: selected.value.role, shift: selected.value.shift }
    : { name: manualName.value || 'Manual sign in', role: manualRole.value, shift: 'Shift A' },
)

function selectProfile(profile: WorkstationProfile): void {
  selected.value = profile
  manual.value = false
  errorMessage.value = null
  step.value = 'password'
}

function selectManual(): void {
  selected.value = null
  manual.value = true
  errorMessage.value = null
  step.value = 'password'
}

function back(): void {
  step.value = 'profiles'
  errorMessage.value = null
}

async function onSubmit(password: string): Promise<void> {
  submitting.value = true
  errorMessage.value = null

  try {
    const result = await login({
      username: manual.value ? manualName.value : (selected.value?.name ?? ''),
      password,
      role: manual.value ? manualRole.value : (selected.value?.role ?? 'operator'),
    })

    auth.setSession(result.token, result.user)
    rememberProfile({
      name: result.user.name,
      role: result.user.role,
      shift: result.user.shift,
    })

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    await router.replace(redirect)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('auth.failed')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="login">
    <header class="login__head">
      <h1 class="login__title">{{ t('auth.title') }}</h1>
      <p class="login__subtitle">
        {{
          step === 'profiles'
            ? t('auth.profilesSubtitle')
            : t('auth.passwordSubtitle')
        }}
      </p>
    </header>

    <LoginProfileList
      v-if="step === 'profiles'"
      :profiles="profiles"
      @select="selectProfile"
      @manual="selectManual"
    />

    <LoginPasswordStep
      v-else
      :name="identity.name"
      :role="identity.role"
      :shift="identity.shift"
      :error="errorMessage"
      :loading="submitting"
      :manual="manual"
      :username="manualName"
      :manual-role="manualRole"
      @update:username="manualName = $event"
      @update:manual-role="manualRole = $event"
      @submit="onSubmit"
      @back="back"
    />
  </div>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login__head {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.login__title {
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.login__subtitle {
  margin: 0;
  font-size: var(--mes-fs-md);
  color: var(--mes-text-muted);
}
</style>
