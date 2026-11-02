<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Tag from 'primevue/tag'
import PageHeader from '@/components/shared/PageHeader.vue'
import { PERMISSION_GROUPS, PERMISSIONS } from '@/types/permissions'
import { listRoles, listUsers, saveRoles } from '../services/users.service'
import type { ManagedRole, ManagedUser } from '../types'

const roles = ref<ManagedRole[]>([])
const users = ref<ManagedUser[]>([])
const loading = ref(true)
const visible = ref(false)
const error = ref('')
const editingId = ref<string | null>(null)
const form = reactive<{ name: string; permissions: string[] }>({ name: '', permissions: [] })

onMounted(async () => {
  try {
    const [roleData, userData] = await Promise.all([listRoles(), listUsers()])
    roles.value = roleData
    users.value = userData
  } catch {
    error.value = 'Could not load role data.'
  } finally {
    loading.value = false
  }
})

function openCreate(): void {
  editingId.value = null
  Object.assign(form, { name: '', permissions: [] })
  visible.value = true
}

function openEdit(role: ManagedRole): void {
  editingId.value = role.id
  Object.assign(form, { name: role.name, permissions: [...role.permissions] })
  visible.value = true
}

async function save(): Promise<void> {
  const name = form.name.trim()
  if (!name) return
  if (roles.value.some((role) => role.name.toLowerCase() === name.toLowerCase() && role.id !== editingId.value)) {
    error.value = 'A role with that name already exists.'
    return
  }
  error.value = ''
  if (editingId.value) {
    roles.value = roles.value.map((role) => role.id === editingId.value
      ? {
        ...role,
        name,
        permissions: role.id === 'admin'
          ? [...new Set([...form.permissions, PERMISSIONS.usersManage, PERMISSIONS.rolesManage])] as ManagedRole['permissions']
          : [...form.permissions] as ManagedRole['permissions'],
      }
      : role)
  } else {
    const id = `role-${crypto.randomUUID()}`
    roles.value = [...roles.value, { id, name, permissions: [...form.permissions] as ManagedRole['permissions'] }]
  }
  await saveRoles(roles.value)
  visible.value = false
}

async function remove(role: ManagedRole): Promise<void> {
  if (role.id === 'admin') {
    error.value = 'The Administrator role cannot be deleted.'
    return
  }
  const assigned = users.value.filter((user) => user.roleId === role.id).length
  if (assigned) {
    error.value = `Reassign the ${assigned} user(s) on this role before deleting it.`
    return
  }
  if (!window.confirm(`Delete role ${role.name}?`)) return
  error.value = ''
  roles.value = roles.value.filter((entry) => entry.id !== role.id)
  await saveRoles(roles.value)
}

function permissionCount(role: ManagedRole): number {
  return role.id === 'admin'
    ? new Set([...role.permissions, PERMISSIONS.usersManage, PERMISSIONS.rolesManage]).size
    : role.permissions.length
}
</script>

<template>
  <PageHeader title="Roles & permissions" subtitle="Choose which modules and management actions each role can access">
    <template #actions><Button label="Add role" icon="pi pi-plus" size="small" @click="openCreate" /></template>
  </PageHeader>
  <p v-if="error" class="error-message" role="alert">{{ error }}</p>
  <DataTable :value="roles" :loading="loading" data-key="id" paginator :rows="10" :rows-per-page-options="[10, 20, 50]" striped-rows>
    <Column field="name" header="Role" sortable />
    <Column header="Users">
      <template #body="{ data }">{{ users.filter((user) => user.roleId === data.id).length }}</template>
    </Column>
    <Column header="Permissions">
      <template #body="{ data }">{{ permissionCount(data) }}</template>
    </Column>
    <Column header="Access">
      <template #body="{ data }">
        <Tag v-if="data.id === 'admin'" value="Always has role management" severity="info" />
        <span v-else>{{ data.permissions.includes(PERMISSIONS.rolesManage) ? 'Can manage roles' : 'Standard access' }}</span>
      </template>
    </Column>
    <Column header="Actions" style="width: 9rem">
      <template #body="{ data }">
        <Button icon="pi pi-pencil" text rounded aria-label="Edit role" @click="openEdit(data)" />
        <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Delete role" :disabled="data.id === 'admin'" @click="remove(data)" />
      </template>
    </Column>
    <template #empty>No roles found.</template>
  </DataTable>

  <Dialog v-model:visible="visible" :header="editingId ? 'Edit role' : 'Add role'" modal :style="{ width: 'min(42rem, 95vw)' }">
    <form class="role-form" @submit.prevent="save">
      <label class="role-name">Role name<InputText v-model="form.name" required fluid /></label>
      <h2>Menu and action permissions</h2>
      <p class="hint">Access is grouped by module. Administrators always retain role and permission management access.</p>
      <div class="permission-groups">
        <section v-for="group in PERMISSION_GROUPS" :key="group.key" class="permission-group">
          <h3>{{ group.label }}</h3>
          <label v-for="permission in group.permissions" :key="permission.code" class="permission-option">
            <Checkbox v-model="form.permissions" :input-id="permission.code" :value="permission.code" />
            <span>{{ permission.label }}</span>
          </label>
        </section>
      </div>
      <div class="form-actions"><Button label="Cancel" severity="secondary" text type="button" @click="visible = false" /><Button label="Save role" type="submit" /></div>
    </form>
  </Dialog>
</template>

<style scoped>
.role-form { display: flex; flex-direction: column; gap: 0.65rem; padding-top: 0.5rem; }
.role-name { display: flex; flex-direction: column; gap: 0.3rem; font-size: var(--mes-fs-sm); color: var(--mes-text-muted); }
.role-form h2 { margin: 0.4rem 0 0; font-size: var(--mes-fs-lg); }
.hint { margin: -0.4rem 0 0; font-size: var(--mes-fs-sm); color: var(--mes-text-muted); }
.permission-groups { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; max-height: 50vh; overflow: auto; padding: 0.25rem; }
.permission-group { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.7rem; border: 1px solid var(--mes-border); border-radius: var(--mes-radius); }
.permission-group h3 { margin: 0; font-size: var(--mes-fs-md); color: var(--mes-text-strong); }
.permission-option { display: flex; align-items: flex-start; gap: 0.45rem; font-size: var(--mes-fs-sm); }
.permission-option span { display: flex; flex-direction: column; gap: 0.15rem; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
.error-message { color: var(--mes-danger, #b42318); }
@media (max-width: 620px) { .permission-groups { grid-template-columns: 1fr; } }
</style>
