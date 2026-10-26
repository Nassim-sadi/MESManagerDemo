import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'mes.theme'

export const useAppStore = defineStore('app', () => {
  const plant = ref('Plant 04 - Bratislava')
  const shift = ref('Shift A')
  const lastSyncAt = ref<Date | null>(null)

  const theme = ref<ThemeMode>(
    localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light',
  )

  function applyTheme(mode: ThemeMode): void {
    document.documentElement.classList.toggle('mes-dark', mode === 'dark')
    localStorage.setItem(THEME_KEY, mode)
  }

  function toggleTheme(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(theme.value)
  }

  // Sync the class at store init so the store is the single source of truth
  // (main.ts applies it earlier to avoid a flash on first paint).
  applyTheme(theme.value)

  function markSynced(): void {
    lastSyncAt.value = new Date()
  }

  return { plant, shift, lastSyncAt, theme, toggleTheme, markSynced }
})
