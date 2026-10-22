<script setup lang="ts">
import { ref } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import PageHeader from '@/components/shared/PageHeader.vue'
import { ROLE_PERMISSIONS } from '@/stores/auth.store'
import type { UserRole } from '@/stores/auth.store'

const toast = useToast()

const plant = ref('Plant 04 - Bratislava')
const timezone = ref('Europe/Bratislava')
const shiftPolicy = ref('3 x 8 hours')
const oeeWarning = ref(80)
const scrapAlarm = ref(2.5)
const refreshInterval = ref(5)

const shiftOptions = ['3 x 8 hours', '2 x 12 hours', '4 x 6 hours']
const timezoneOptions = ['Europe/Bratislava', 'Europe/Vienna', 'Europe/Budapest', 'UTC']

const demoUsers = [
  { name: 'operator', role: 'operator' as UserRole, shift: 'Shift A' },
  { name: 'shift.lead', role: 'supervisor' as UserRole, shift: 'Shift A' },
  { name: 'maintenance', role: 'supervisor' as UserRole, shift: 'Shift B' },
  { name: 'admin', role: 'admin' as UserRole, shift: 'All' },
]

function save(): void {
  toast.add({
    severity: 'success',
    summary: 'Settings saved',
    detail: 'Configuration stored for this demo session.',
    life: 2500,
  })
}

function permissionCount(role: string): number {
  return ROLE_PERMISSIONS[role as UserRole]?.length ?? 0
}
</script>

<template>
  <div class="settings">
    <PageHeader title="Settings" subtitle="Plant defaults, thresholds and demo user roles" />

    <div class="columns">
      <section class="mes-card">
        <header class="mes-card__header">
          <span class="mes-card__title">Plant defaults</span>
        </header>
        <div class="mes-card__body form">
          <label class="form__field">
            <span class="form__label">Plant</span>
            <InputText v-model="plant" fluid />
          </label>

          <label class="form__field">
            <span class="form__label">Time zone</span>
            <Select v-model="timezone" :options="timezoneOptions" fluid />
          </label>

          <label class="form__field">
            <span class="form__label">Shift policy</span>
            <Select v-model="shiftPolicy" :options="shiftOptions" fluid />
          </label>

          <label class="form__field">
            <span class="form__label">OEE warning threshold (%)</span>
            <InputNumber v-model="oeeWarning" :min="0" :max="100" fluid />
          </label>

          <label class="form__field">
            <span class="form__label">Scrap alarm threshold (%)</span>
            <InputNumber v-model="scrapAlarm" :min="0" :max="100" :min-fraction-digits="1" fluid />
          </label>

          <label class="form__field">
            <span class="form__label">Live refresh interval (s)</span>
            <InputNumber v-model="refreshInterval" :min="1" :max="60" fluid />
          </label>

          <div class="form__actions">
            <Button label="Save settings" icon="pi pi-check" @click="save" />
          </div>
        </div>
      </section>

      <section class="mes-card">
        <header class="mes-card__header">
          <span class="mes-card__title">Demo users</span>
          <span class="mes-eyebrow">role decides menu and actions</span>
        </header>
        <DataTable :value="demoUsers" size="small" striped-rows>
          <Column field="name" header="User">
            <template #body="{ data }">
              <span class="mes-mono">{{ data.name }}</span>
            </template>
          </Column>
          <Column field="role" header="Role" style="width: 9rem">
            <template #body="{ data }">
              <Tag :value="data.role" severity="secondary" />
            </template>
          </Column>
          <Column field="shift" header="Shift" style="width: 8rem" />
          <Column header="Permissions" style="width: 8rem">
            <template #body="{ data }">
              <span class="mes-mono">{{ permissionCount(data.role) }}</span>
            </template>
          </Column>
        </DataTable>
      </section>
    </div>
  </div>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 0.75rem;
  align-items: start;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.form__field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form__label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--mes-text-muted);
}

.form__actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.25rem;
}
</style>
