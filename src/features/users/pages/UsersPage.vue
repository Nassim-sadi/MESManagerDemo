<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import ToggleSwitch from 'primevue/toggleswitch'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useAuthStore } from '@/stores/auth.store'
import { listDepartments, listRoles, listUsers, saveUsers } from '../services/users.service'
import {
  DEPARTMENT_OPTIONS,
  EMPLOYMENT_OPTIONS,
  FACTORY_OPTIONS,
  SEX_OPTIONS,
  SHIFT_OPTIONS,
  WAREHOUSE_OPTIONS,
  type ManagedRole,
  type ManagedUser,
} from '../types'

const users = ref<ManagedUser[]>([])
const auth = useAuthStore()
const roles = ref<ManagedRole[]>([])
const departments = ref<string[]>(DEPARTMENT_OPTIONS)
const loading = ref(true)
const visible = ref(false)
const error = ref('')
const editingId = ref<string | null>(null)
const form = reactive({
  userCode: '', username: '', name: '', department: DEPARTMENT_OPTIONS[0]!, sex: 'Unspecified',
  address: '', telephone: '', mobile: '', fax: '', email: '', post: '', active: true,
  employmentStatus: 'Employed' as ManagedUser['employmentStatus'], backgroundAuthority: false,
  foregroundAuthority: true, factoryCode: FACTORY_OPTIONS[0]!.code,
  factoryName: FACTORY_OPTIONS[0]!.name, roleId: '', avatarUrl: '', shift: SHIFT_OPTIONS[0]!,
  warehouseCodes: [] as string[],
})
const roleOptions = computed(() => roles.value
  .filter((role) => auth.user?.role === 'admin' || role.id !== 'admin')
  .map(({ id, name }) => ({ label: name, value: id })))
const visibleUsers = computed(() => auth.user?.role === 'admin'
  ? users.value
  : users.value.filter((user) => user.roleId !== 'admin'))
const factoryOptions = FACTORY_OPTIONS.map(({ code, name }) => ({ label: name, value: code }))
const warehouseOptions = WAREHOUSE_OPTIONS.map(({ code, name }) => ({ label: name, value: code }))

onMounted(async () => {
  try {
    const [userData, roleData, departmentData] = await Promise.all([
      listUsers(), listRoles(), listDepartments().catch(() => DEPARTMENT_OPTIONS),
    ])
    users.value = userData
    roles.value = roleData
    departments.value = departmentData
  } catch {
    error.value = 'Could not load user data.'
  } finally {
    loading.value = false
  }
})

function openCreate(): void {
  editingId.value = null
  Object.assign(form, {
    userCode: '', username: '', name: '', department: departments.value[0] ?? '', sex: 'Unspecified',
    address: '', telephone: '', mobile: '', fax: '', email: '', post: '', active: true,
    employmentStatus: 'Employed', backgroundAuthority: false, foregroundAuthority: true,
    factoryCode: FACTORY_OPTIONS[0]!.code, factoryName: FACTORY_OPTIONS[0]!.name,
    roleId: roles.value[0]?.id ?? '', avatarUrl: '', shift: SHIFT_OPTIONS[0]!, warehouseCodes: [],
  })
  error.value = ''
  visible.value = true
}

function openEdit(user: ManagedUser): void {
  editingId.value = user.id
  Object.assign(form, user, { username: user.userCode, warehouseCodes: [...user.warehouseCodes] })
  error.value = ''
  visible.value = true
}

function initials(name: string): string {
  return name.split(/\s+/).map((part) => part.charAt(0)).join('').slice(0, 2).toUpperCase()
}

function isValidImageUrl(value: string): boolean {
  if (!value.trim()) return true
  try {
    return ['http:', 'https:'].includes(new URL(value, window.location.origin).protocol)
  } catch {
    return false
  }
}

async function save(): Promise<void> {
  const userCode = form.userCode.trim()
  const name = form.name.trim()
  if (!userCode || !name || !form.roleId || !form.factoryCode) return
  if (users.value.some((user) => user.userCode.toLowerCase() === userCode.toLowerCase()
    && user.factoryCode === form.factoryCode && user.id !== editingId.value)) {
    error.value = 'That user code already exists in this factory.'
    return
  }
  if (form.avatarUrl && !isValidImageUrl(form.avatarUrl)) {
    error.value = 'Enter a valid image URL.'
    return
  }
  error.value = ''
  const factory = FACTORY_OPTIONS.find((entry) => entry.code === form.factoryCode)!
  const next: ManagedUser = {
    ...form,
    id: editingId.value ?? `user-${crypto.randomUUID()}`,
    userCode,
    username: userCode,
    name,
    factoryName: factory.name,
    warehouseCodes: [...form.warehouseCodes],
  }
  const updatedUsers = editingId.value
    ? users.value.map((user) => user.id === editingId.value ? next : user)
    : [...users.value, next]
  if (!updatedUsers.some((user) => user.roleId === 'admin' && user.active && user.employmentStatus === 'Employed')) {
    error.value = 'At least one active Administrator account must remain.'
    return
  }
  users.value = updatedUsers
  await saveUsers(users.value)
  visible.value = false
}

async function remove(user: ManagedUser): Promise<void> {
  if (user.roleId === 'admin' && user.active && user.employmentStatus === 'Employed'
    && !users.value.some((entry) => entry.id !== user.id && entry.roleId === 'admin' && entry.active && entry.employmentStatus === 'Employed')) {
    error.value = 'The last active Administrator account cannot be deleted.'
    return
  }
  if (!window.confirm(`Delete user ${user.name}?`)) return
  users.value = users.value.filter((entry) => entry.id !== user.id)
  await saveUsers(users.value)
}
</script>

<template>
  <PageHeader title="User management" subtitle="User profile, factory, role, and warehouse access">
    <template #actions><Button label="Add user" icon="pi pi-plus" size="small" @click="openCreate" /></template>
  </PageHeader>
  <p v-if="error" class="error-message" role="alert">{{ error }}</p>
  <DataTable :value="visibleUsers" :loading="loading" data-key="id" paginator :rows="10" :rows-per-page-options="[10, 20, 50]" striped-rows>
    <Column header="User" sort-field="name" sortable>
      <template #body="{ data }"><div class="user-cell"><Avatar :image="data.avatarUrl || undefined" :label="initials(data.name)" shape="circle" /><span>{{ data.name }}<small>{{ data.userCode }}</small></span></div></template>
    </Column>
    <Column field="department" header="Department" sortable />
    <Column field="factoryName" header="Factory" sortable />
    <Column header="Role" sortable sort-field="roleId"><template #body="{ data }">{{ roles.find((role) => role.id === data.roleId)?.name ?? data.roleId }}</template></Column>
    <Column header="Warehouses"><template #body="{ data }">{{ data.warehouseCodes.length }}</template></Column>
    <Column field="active" header="Status" sortable><template #body="{ data }"><Tag :value="data.active ? 'Active' : 'Inactive'" :severity="data.active ? 'success' : 'secondary'" /></template></Column>
    <Column header="Actions" style="width: 9rem"><template #body="{ data }"><Button icon="pi pi-pencil" text rounded aria-label="Edit user" @click="openEdit(data)" /><Button icon="pi pi-trash" text rounded severity="danger" aria-label="Delete user" @click="remove(data)" /></template></Column>
    <template #empty>No users found.</template>
  </DataTable>

  <Dialog v-model:visible="visible" :header="editingId ? 'Edit user' : 'Add user'" modal :style="{ width: 'min(50rem, 95vw)' }">
    <form class="user-form" @submit.prevent="save">
      <section class="form-section">
        <h2>Identity</h2>
        <label>User code<InputText v-model="form.userCode" required fluid autocomplete="off" /></label>
        <label>Full name<InputText v-model="form.name" required fluid /></label>
        <label>Profile image URL<InputText v-model="form.avatarUrl" placeholder="https://… or /images/user.png" fluid /></label>
        <div v-if="form.avatarUrl" class="avatar-preview"><Avatar :image="form.avatarUrl" :label="initials(form.name)" shape="circle" size="large" />Photo preview</div>
        <label>Department<Select v-model="form.department" :options="departments" fluid /></label>
        <label>Sex<Select v-model="form.sex" :options="SEX_OPTIONS" fluid /></label>
        <label>Position<InputText v-model="form.post" fluid /></label>
      </section>

      <section class="form-section">
        <h2>Contact</h2>
        <label>Email<InputText v-model="form.email" type="email" fluid /></label>
        <label>Telephone<InputText v-model="form.telephone" fluid /></label>
        <label>Mobile<InputText v-model="form.mobile" fluid /></label>
        <label>Fax<InputText v-model="form.fax" fluid /></label>
        <label class="wide-field">Address<InputText v-model="form.address" fluid /></label>
      </section>

      <section class="form-section">
        <h2>Access and employment</h2>
        <label>Factory<Select v-model="form.factoryCode" :options="factoryOptions" option-label="label" option-value="value" fluid @update:model-value="form.factoryName = FACTORY_OPTIONS.find((factory) => factory.code === $event)?.name ?? ''" /></label>
        <label>Role<Select v-model="form.roleId" :options="roleOptions" option-label="label" option-value="value" fluid /></label>
        <label>Shift<Select v-model="form.shift" :options="SHIFT_OPTIONS" fluid /></label>
        <label>Employment status<Select v-model="form.employmentStatus" :options="EMPLOYMENT_OPTIONS" fluid /></label>
        <label class="wide-field">Allowed warehouses<MultiSelect v-model="form.warehouseCodes" :options="warehouseOptions" option-label="label" option-value="value" display="chip" fluid /></label>
        <label class="switch-field">Account enabled<ToggleSwitch v-model="form.active" /></label>
        <label class="switch-field">Foreground authority<ToggleSwitch v-model="form.foregroundAuthority" /></label>
        <label class="switch-field">Background authority<ToggleSwitch v-model="form.backgroundAuthority" /></label>
      </section>

      <div class="form-actions"><Button label="Cancel" severity="secondary" text type="button" @click="visible = false" /><Button label="Save user" type="submit" /></div>
    </form>
  </Dialog>
</template>

<style scoped>
.user-form { display: flex; flex-direction: column; gap: 1rem; max-height: 72vh; overflow: auto; padding: 0.25rem; }
.form-section { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; padding: 0.75rem; border: 1px solid var(--mes-border); border-radius: var(--mes-radius); }
.form-section h2 { grid-column: 1 / -1; margin: 0; font-size: var(--mes-fs-lg); color: var(--mes-text-strong); }
.form-section label { display: flex; flex-direction: column; gap: 0.3rem; font-size: var(--mes-fs-sm); color: var(--mes-text-muted); }
.form-section .wide-field { grid-column: 1 / -1; }
.form-section .switch-field { flex-direction: row; align-items: center; justify-content: space-between; min-height: 2.3rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
.user-cell { display: flex; align-items: center; gap: 0.55rem; }
.user-cell span { display: flex; flex-direction: column; }
.user-cell small { color: var(--mes-text-muted); font-size: 0.7rem; }
.avatar-preview { display: flex; align-items: center; gap: 0.5rem; font-size: var(--mes-fs-sm); color: var(--mes-text-muted); }
.error-message { color: var(--mes-danger, #b42318); }
@media (max-width: 620px) { .form-section { grid-template-columns: 1fr; } .form-section h2, .form-section .wide-field { grid-column: auto; } }
</style>
