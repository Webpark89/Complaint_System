import { useState, useCallback } from 'react'

export interface CRUDState<T> {
  items: T[]
  selectedIds: Set<number>
  isLoading: boolean
  error: string | null
  filterSearch: string
  filterStatus: string
  page: number
  pageSize: number
  total: number
}

export interface CRUDActions<T> {
  setItems: (items: T[]) => void
  addItem: (item: T) => void
  updateItem: (id: number, updates: Partial<T>) => void
  deleteItem: (id: number) => void
  deleteItems: (ids: number[]) => void
  toggleSelect: (id: number) => void
  selectAll: (ids: number[]) => void
  clearSelection: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setFilterSearch: (query: string) => void
  setFilterStatus: (status: string) => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setTotal: (total: number) => void
}

export function useCRUD<T extends { id: number }>(
  initialItems: T[] = [],
  initialPageSize = 10
): [CRUDState<T>, CRUDActions<T>] {
  const [items, setItems] = useState<T[]>(initialItems)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterSearch, setFilterSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [total, setTotal] = useState(initialItems.length)

  const addItem = useCallback((item: T) => {
    setItems((prev) => [item, ...prev])
    setTotal((t) => t + 1)
  }, [])

  const updateItem = useCallback((id: number, updates: Partial<T>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }, [])

  const deleteItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setTotal((t) => t - 1)
  }, [])

  const deleteItems = useCallback((ids: number[]) => {
    const idSet = new Set(ids)
    setItems((prev) => prev.filter((item) => !idSet.has(item.id)))
    setSelectedIds(new Set())
    setTotal((t) => Math.max(0, t - ids.length))
  }, [])

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback((ids: number[]) => {
    setSelectedIds(new Set(ids))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const state: CRUDState<T> = {
    items,
    selectedIds,
    isLoading,
    error,
    filterSearch,
    filterStatus,
    page,
    pageSize,
    total,
  }

  const actions: CRUDActions<T> = {
    setItems,
    addItem,
    updateItem,
    deleteItem,
    deleteItems,
    toggleSelect,
    selectAll,
    clearSelection,
    setLoading,
    setError,
    setFilterSearch,
    setFilterStatus,
    setPage,
    setPageSize,
    setTotal,
  }

  return [state, actions]
}
