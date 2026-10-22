import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Alarm } from '@/types/mes'
import { fetchAlarms } from '@/features/dashboard/services/dashboard.service'

/**
 * Open alarms are shown in the header on every screen, so the count lives
 * in a small global store instead of being fetched per page.
 */
export const useAlarmsStore = defineStore('alarms', () => {
  const alarms = ref<Alarm[]>([])
  const loading = ref(false)

  const openCount = computed(() => alarms.value.filter((alarm) => !alarm.acknowledged).length)

  async function refresh(): Promise<void> {
    loading.value = true
    try {
      alarms.value = await fetchAlarms()
    } finally {
      loading.value = false
    }
  }

  return { alarms, loading, openCount, refresh }
})
