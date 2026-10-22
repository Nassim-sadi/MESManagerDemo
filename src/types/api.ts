export interface PageQuery {
  page: number
  size: number
  sortField?: string
  sortOrder?: 1 | -1
}

export interface PageResult<T> {
  items: T[]
  total: number
}
