<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { useAuthStore } from '@/stores/auth.store'
import { setUserPassword, validatePassword } from '@/features/users/services/users.service'
import type { ManagedUser } from '@/features/users/types'

const props = defineProps<{
  visible: boolean
  mode: 'self' | 'set-for-user'
  targetUser?: ManagedUser | null
}>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  passwordChanged: [user: ManagedUser]
}>()

const auth = useAuthStore()
const toast = useToast()
const { t } = useI18n()
const saving = ref(false)
const error = ref('')
const form = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

watch(() => props.visible, (visible) => {
  if (visible) resetForm()
})

function resetForm(): void {
  form.oldPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
  error.value = ''
}

function close(): void {
  emit('update:visible', false)
}

function validateNewPassword(password: string): string {
  if (password.length < 8) return t('auth.password.minLength', { min: 8 })
  if (!/[A-Z]/.test(password)) return t('auth.password.requireUpper')
  if (!/[a-z]/.test(password)) return t('auth.password.requireLower')
  if (!/\d/.test(password)) return t('auth.password.requireDigit')
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return t('auth.password.requireSpecial')
  if (props.mode === 'self' && form.oldPassword && password.toLowerCase().includes(form.oldPassword.toLowerCase())) {
    return t('auth.password.notContainOld')
  }
  return ''
}

async function submit(): Promise<void> {
  error.value = ''
  const currentUser = auth.user
  const target = props.mode === 'self' ? null : props.targetUser
  const userId = props.mode === 'self' ? currentUser?.id : target?.id

  if (!userId) {
    error.value = 'The selected user could not be found.'
    return
  }
  if (props.mode === 'self') {
    if (!form.oldPassword) {
      error.value = t('auth.password.oldRequired')
      return
    }
    if (!currentUser || !(await validatePassword(currentUser.userCode, form.oldPassword, currentUser.id))) {
      error.value = t('auth.password.incorrect')
      return
    }
  }

  const validationMessage = validateNewPassword(form.newPassword)
  if (!form.newPassword) {
    error.value = t('auth.password.newRequired')
    return
  }
  if (validationMessage) {
    error.value = validationMessage
    return
  }
  if (form.newPassword !== form.confirmPassword) {
    error.value = t('auth.password.match')
    return
  }

  saving.value = true
  try {
    const updatedUser = await setUserPassword(userId, form.newPassword)
    emit('passwordChanged', updatedUser)
    if (auth.user?.id === updatedUser.id) auth.updatePasswordHash(updatedUser.passwordHash)
    toast.add({ severity: 'success', summary: t('auth.password'), detail: t('auth.password.changed'), life: 3000 })
    close()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not update the password.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Dialog
    :visible="props.visible"
    :header="props.mode === 'self' ? t('auth.menu.changePassword') : `${t('auth.password.new')} · ${props.targetUser?.name ?? ''}`"
    modal
    :style="{ width: 'min(32rem, 94vw)' }"
    @update:visible="emit('update:visible', $event)"
  >
    <form class="password-form" @submit.prevent="submit">
      <p v-if="props.mode === 'set-for-user' && props.targetUser" class="target-user">{{ props.targetUser.userCode }} · {{ props.targetUser.name }}</p>
      <label v-if="props.mode === 'self'">{{ t('auth.password.old') }}
        <InputText v-model="form.oldPassword" type="password" autocomplete="current-password" fluid />
      </label>
      <label>{{ t('auth.password.new') }}
        <InputText v-model="form.newPassword" type="password" autocomplete="new-password" fluid />
      </label>
      <label>{{ t('auth.password.confirm') }}
        <InputText v-model="form.confirmPassword" type="password" autocomplete="new-password" fluid />
      </label>
      <p class="hint">{{ t('auth.password.hint') }}</p>
      <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
      <div class="actions">
        <Button label="Cancel" severity="secondary" text type="button" @click="close" />
        <Button :label="props.mode === 'self' ? 'Change password' : 'Set password'" icon="pi pi-key" type="submit" :loading="saving" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.password-form { display: grid; gap: .9rem; }
.password-form label { display: grid; gap: .35rem; color: var(--mes-text-muted); font-size: var(--mes-fs-sm); }
.target-user { margin: 0; font-weight: 600; color: var(--mes-text); }
.hint { margin: 0; color: var(--mes-text-muted); font-size: var(--mes-fs-xs); }
.actions { display: flex; justify-content: flex-end; gap: .5rem; padding-top: .35rem; }
</style>
