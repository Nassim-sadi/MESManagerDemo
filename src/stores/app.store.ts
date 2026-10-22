import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const plant = ref('Plant 04 - Bratislava')
  const shift = ref('Shift A')
  const lastSyncAt = ref<Date | null>(null)

  function markSynced(): void {
    lastSyncAt.value = new Date()
  }

  return { plant, shift, lastSyncAt, markSynced }
})
