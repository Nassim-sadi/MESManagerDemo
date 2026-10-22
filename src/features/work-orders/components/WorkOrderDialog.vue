<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import { createWorkOrder } from '../services/work-orders.service'
import type { CreateWorkOrderPayload } from '../types'

const props = defineProps<{
  visible: boolean
  lines: string[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  saved: []
}>()

const toast = useToast()

const products = [
  'AX-200 Drive Housing',
  'AX-210 Drive Housing',
  'BR-410 Brake Rotor',
  'CH-120 Chassis Frame',
  'CV-700 Conveyor Module',
  'DV-900 Drive Unit',
  'GC-500 Gear Carrier',
]

const workstations = ['SMT-01', 'ASSY-02', 'CNC-03', 'WELD-04', 'TEST-05', 'PACK-06']
const priorities = [
  { label: 'Low', value: 'Low' },
  { label: 'Normal', value: 'Normal' },
  { label: 'High', value: 'High' },
  { label: 'Urgent', value: 'Urgent' },
]

const form = ref<Omit<CreateWorkOrderPayload, 'dueAt'>>({
  product: products[0] ?? '',
  line: props.lines[0] ?? '',
  workstation: workstations[0] ?? '',
  plannedQty: 500,
  priority: 'Normal',
})

const dueAt = ref<Date>(new Date())

const submitting = ref(false)
const errorMessage = ref<string | null>(null)

const visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value),
})

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      errorMessage.value = null
      form.value.line = props.lines[0] ?? ''
    }
  },
)

async function onSubmit(): Promise<void> {
  errorMessage.value = null

  if (!form.value.product || !form.value.line || form.value.plannedQty <= 0) {
    errorMessage.value = 'Product, line and a quantity above zero are required.'
    return
  }

  submitting.value = true
  try {
    const order = await createWorkOrder({ ...form.value, dueAt: dueAt.value.toISOString() })
    toast.add({
      severity: 'success',
      summary: 'Work order created',
      detail: `${order.id} · ${order.product}`,
      life: 3000,
    })
    visible.value = false
    emit('saved')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Work order could not be created.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="New work order"
    :style="{ width: '32rem', maxWidth: '95vw' }"
    :breakpoints="{ '640px': '95vw' }"
  >
    <form class="form" @submit.prevent="onSubmit">
      <Message v-if="errorMessage" severity="error" :closable="false" class="form__error">
        {{ errorMessage }}
      </Message>

      <label class="form__field">
        <span class="form__label">Product</span>
        <Select v-model="form.product" :options="products" fluid />
      </label>

      <div class="form__row">
        <label class="form__field">
          <span class="form__label">Line</span>
          <Select v-model="form.line" :options="lines" fluid />
        </label>
        <label class="form__field">
          <span class="form__label">Workstation</span>
          <Select v-model="form.workstation" :options="workstations" fluid />
        </label>
      </div>

      <div class="form__row">
        <label class="form__field">
          <span class="form__label">Planned quantity</span>
          <InputNumber v-model="form.plannedQty" :min="1" :max="100000" fluid />
        </label>
        <label class="form__field">
          <span class="form__label">Priority</span>
          <Select
            v-model="form.priority"
            :options="priorities"
            option-label="label"
            option-value="value"
            fluid
          />
        </label>
      </div>

      <label class="form__field">
        <span class="form__label">Due date</span>
        <DatePicker v-model="dueAt" show-time hour-format="24" fluid />
      </label>

      <div class="form__actions">
        <Button label="Cancel" severity="secondary" text type="button" @click="visible = false" />
        <Button label="Create work order" icon="pi pi-check" type="submit" :loading="submitting" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.form__error {
  margin: 0;
}

.form__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  gap: 0.4rem;
  padding-top: 0.25rem;
}
</style>
