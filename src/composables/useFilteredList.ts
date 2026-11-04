import { onMounted, onScopeDispose, reactive, ref, watch, type Ref } from 'vue'

interface FilteredListOptions<F extends object, T> {
  initialFilters: F
  load: (filters: F) => Promise<T[]>
  debounceMs?: number
}

/**
 * Shared list-screen state: filters, debounced auto-apply, explicit refresh,
 * reset, stale-response protection and a single error message.
 *
 * Forms decide the filter shape; the API call stays in the feature service.
 */
export function useFilteredList<F extends object, T>(options: FilteredListOptions<F, T>) {
  const filters = reactive({ ...options.initialFilters }) as F
  const rows = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const error = ref('')
  const debounceMs = options.debounceMs ?? 300

  let timer: number | undefined
  let requestId = 0

  async function refresh(): Promise<void> {
    if (timer) {
      window.clearTimeout(timer)
      timer = undefined
    }

    const current = ++requestId
    loading.value = true
    error.value = ''

    try {
      const result = await options.load(filters)
      if (current === requestId) rows.value = result
    } catch (cause) {
      if (current !== requestId) return
      rows.value = []
      error.value = cause instanceof Error ? cause.message : 'The list could not be loaded.'
    } finally {
      if (current === requestId) loading.value = false
    }
  }

  function schedule(): void {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(() => void refresh(), debounceMs)
  }

  function reset(): void {
    Object.assign(filters, options.initialFilters)
    void refresh()
  }

  watch(filters, schedule, { deep: true })
  onMounted(() => void refresh())
  onScopeDispose(() => {
    if (timer) window.clearTimeout(timer)
  })

  return { filters, rows, loading, error, refresh, reset }
}
