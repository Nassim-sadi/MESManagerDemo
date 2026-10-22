import { reactive, ref, watch, type Ref } from 'vue'
import type { PageQuery, PageResult } from '@/types/api'

export interface TableSortEvent {
  sortField?: string | ((item: any) => string) | null
  sortOrder?: number | null
}

export interface DataTableOptions<T> {
  loader: (query: PageQuery) => Promise<PageResult<T>>
  pageSize?: number
  sortField?: string
  sortOrder?: 1 | -1
  immediate?: boolean
  onError?: (error: unknown) => void
}

/**
 * Server side table state: paging, sorting and loading are kept in one
 * place so every feature table behaves the same way.
 */
export function useDataTable<T>(options: DataTableOptions<T>) {
  const items = ref<T[]>([]) as Ref<T[]>
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const query = reactive<Required<PageQuery>>({
    page: 0,
    size: options.pageSize ?? 20,
    sortField: options.sortField ?? '',
    sortOrder: options.sortOrder ?? 1,
  })

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await options.loader({ ...query })
      items.value = result.items
      total.value = result.total
    } catch (cause) {
      error.value = 'Data could not be loaded.'
      options.onError?.(cause)
    } finally {
      loading.value = false
    }
  }

  function gotoPage(page: number): Promise<void> {
    query.page = page
    return load()
  }

  function applySort(event: TableSortEvent): Promise<void> {
    query.sortField = typeof event.sortField === 'string' ? event.sortField : ''
    query.sortOrder = event.sortOrder === -1 ? -1 : 1
    return load()
  }

  function refresh(): Promise<void> {
    return load()
  }

  /** Any filter change resets to the first page. */
  function onFilterChanged(): Promise<void> {
    query.page = 0
    return load()
  }

  watch(
    () => [query.sortField, query.sortOrder],
    () => {
      query.page = 0
      void load()
    },
  )

  if (options.immediate !== false) {
    void load()
  }

  return {
    items,
    total,
    loading,
    error,
    query,
    load,
    gotoPage,
    applySort,
    refresh,
    onFilterChanged,
  }
}
