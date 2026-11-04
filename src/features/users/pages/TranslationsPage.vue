<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Tag from 'primevue/tag'
import PageHeader from '@/components/shared/PageHeader.vue'

import arBase from '@/locales/ar.json'
import enBase from '@/locales/en.json'

type Locale = 'ar' | 'en'
type Flat = Record<string, string>

interface TranslationRow {
  id: string
  key: string
  en: string
  ar: string
  category: string
}

const STORAGE_PREFIX = 'mes_demo_locale_'

const { setLocaleMessage } = useI18n({ useScope: 'global' })

const currentLocale = ref<Locale>('ar')
const searchFilter = ref('')
const visible = ref(false)
const editingKey = ref<string | null>(null)
const error = ref('')

const form = reactive({ key: '', value: '' })

/**
 * vue-i18n compiles messages in place, so a plain string like "MES Manager"
 * can become an AST node ({ type, start, end, loc: { source } }) or a
 * compiled function with a `.source` property. Read those back as text.
 */
function isMessageNode(v: any): boolean {
  return (
    v &&
    typeof v === 'object' &&
    typeof v.type === 'number' &&
    v.loc &&
    typeof v.loc.source === 'string'
  )
}

function flatten(obj: unknown, parent = '', out: Flat = {}): Flat {
  if (!obj || typeof obj !== 'object') return out
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const path = parent ? `${parent}.${k}` : k
    if (typeof v === 'function') {
      const src = (v as any).source ?? (v as any).loc?.source
      if (typeof src === 'string') out[path] = src
    } else if (isMessageNode(v)) {
      out[path] = (v as any).loc.source
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, path, out)
    } else {
      out[path] = String(v ?? '')
    }
  }
  return out
}

function unflatten(flat: Flat) {
  const result: Record<string, any> = {}
  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split('.')
    let cur = result
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur[parts[i]] ??= {}
    }
    cur[parts[parts.length - 1]] = value
  }
  return result
}

// Base file first, saved overrides on top (so new keys in the JSON still show up)
function load(locale: Locale, base: unknown): Flat {
  const flatBase = flatten(base)
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + locale)
    if (saved) return { ...flatBase, ...flatten(JSON.parse(saved)) }
  } catch {
    // corrupted localStorage -> fall back to base
  }
  return flatBase
}

const flat = reactive<Record<Locale, Flat>>({
  ar: load('ar', arBase),
  en: load('en', enBase),
})

// Union of keys from BOTH locales
const translations = computed<TranslationRow[]>(() => {
  const keys = new Set([...Object.keys(flat.en), ...Object.keys(flat.ar)])
  return [...keys].map((key) => ({
    id: key,
    key,
    en: flat.en[key] ?? '',
    ar: flat.ar[key] ?? '',
    category: key.includes('.') ? key.split('.')[0] : 'general',
  }))
})

const filteredTranslations = computed(() => {
  const q = searchFilter.value.trim().toLowerCase()
  if (!q) return translations.value
  return translations.value.filter(
    (t) =>
      t.key.toLowerCase().includes(q) ||
      t.ar.toLowerCase().includes(q) ||
      t.en.toLowerCase().includes(q),
  )
})

const localeOptions = [
  { label: 'Arabic (ar.json)', value: 'ar' },
  { label: 'English (en.json)', value: 'en' },
]

const textDir = computed(() => (currentLocale.value === 'ar' ? 'rtl' : 'ltr'))

function openEdit(row: TranslationRow) {
  editingKey.value = row.key
  form.key = row.key
  form.value = currentLocale.value === 'ar' ? row.ar : row.en
  error.value = ''
  visible.value = true
}

function save() {
  if (!editingKey.value) return
  if (!form.value.trim()) {
    error.value = 'Value cannot be empty.'
    return
  }

  const locale = currentLocale.value
  flat[locale][editingKey.value] = form.value

  // Plain strings only, so localStorage never receives compiled nodes
  const nested = unflatten(flat[locale])

  try {
    localStorage.setItem(STORAGE_PREFIX + locale, JSON.stringify(nested))
  } catch {
    error.value = 'Could not save to localStorage.'
    return
  }

  // Give vue-i18n its own copy so it can compile it without touching our data
  setLocaleMessage(locale, structuredClone(nested))

  visible.value = false
}
</script>

<template>
  <PageHeader title="Translation Management" subtitle="Edit localized values securely in browser LocalStorage for your demo">
    <template #actions>
      <Select v-model="currentLocale" :options="localeOptions" option-label="label" option-value="value" style="width: 14rem;" />
    </template>
  </PageHeader>

  <div class="filter-bar">
    <InputText v-model="searchFilter" placeholder="Search translation keys or values..." fluid />
  </div>

  <DataTable :value="filteredTranslations" data-key="id" paginator :rows="10" :rows-per-page-options="[10, 20, 50]" striped-rows>
    <Column field="key" header="Translation Key" sortable style="width: 30%">
      <template #body="{ data }">
        <code class="key-tag">{{ data.key }}</code>
      </template>
    </Column>
    <Column :header="currentLocale === 'ar' ? 'Arabic Value (ar.json)' : 'English Value (en.json)'" sortable :sort-field="currentLocale">
      <template #body="{ data }">
        <span class="value-text" :dir="textDir">{{ currentLocale === 'ar' ? data.ar : data.en }}</span>
      </template>
    </Column>
    <Column field="category" header="Category" sortable style="width: 15%">
      <template #body="{ data }">
        <Tag :value="data.category" severity="secondary" />
      </template>
    </Column>
    <Column header="Actions" style="width: 8rem">
      <template #body="{ data }">
        <Button icon="pi pi-pencil" text rounded aria-label="Edit translation" @click="openEdit(data)" />
      </template>
    </Column>
    <template #empty>No translations found.</template>
  </DataTable>

  <Dialog v-model:visible="visible" header="Edit Translation Value" modal :style="{ width: 'min(35rem, 95vw)' }">
    <form class="user-form" @submit.prevent="save">
      <section class="form-section">
        <h2>Translation Details</h2>
        <label>Key (Locked)
          <InputText :model-value="form.key" disabled fluid />
        </label>
        <label>Value ({{ currentLocale.toUpperCase() }})
          <InputText v-model="form.value" :dir="textDir" required fluid autofocus />
        </label>
        <small v-if="error" class="error-message" role="alert">{{ error }}</small>
      </section>

      <div class="form-actions">
        <Button label="Cancel" severity="secondary" text type="button" @click="visible = false" />
        <Button label="Save Changes" type="submit" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.filter-bar {
  margin-bottom: 1rem;
}

.key-tag {
  font-family: monospace;
  background: var(--mes-surface-muted, #f1f5f9);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.value-text {
  font-weight: 500;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.25rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--mes-border);
  border-radius: var(--mes-radius);
}

.form-section h2 {
  margin: 0;
  font-size: var(--mes-fs-lg);
  color: var(--mes-text-strong);
}

.form-section label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: var(--mes-fs-sm);
  color: var(--mes-text-muted);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.error-message {
  color: var(--mes-danger, #b42318);
}
</style>