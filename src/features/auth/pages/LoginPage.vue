<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.store'
import { useAppStore } from '@/stores/app.store'
import { login } from '../services/auth.service'
import { listProfiles, rememberProfile } from '../services/profile.service'
import LoginProfileList from '../components/LoginProfileList.vue'
import LoginPasswordStep from '../components/LoginPasswordStep.vue'
import type { WorkstationProfile } from '../types'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const app = useAppStore()
const { t } = useI18n()

type Step = 'profiles' | 'password'

const step = ref<Step>('profiles')
const profiles = ref<WorkstationProfile[]>([])
const selected = ref<WorkstationProfile | null>(null)
const manual = ref(false)
const manualName = ref('')

const submitting = ref(false)
const errorMessage = ref<string | null>(null)

const identity = computed(() =>
  selected.value
    ? { name: selected.value.name, role: selected.value.roleName, shift: selected.value.shift }
    : { name: manualName.value || 'Manual sign in', role: 'Managed account', shift: 'Select account by user code' },
)

onMounted(async () => {
  try {
    profiles.value = await listProfiles()
  } catch {
    errorMessage.value = t('auth.failed')
  }
})

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
      username: manual.value ? manualName.value : (selected.value?.userCode ?? ''),
      password,
      userId: manual.value ? undefined : selected.value?.id,
    })

    auth.setSession(result.token, result.user)
    app.plant = result.user.plant
    app.shift = result.user.shift
    rememberProfile(result.user.id)

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
      @update:username="manualName = $event"
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
