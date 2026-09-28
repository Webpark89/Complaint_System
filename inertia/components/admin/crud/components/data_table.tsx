import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  Trash2,
} from 'lucide-react'
import { Link } from '~/components/ui/link'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => ReactNode
  width?: string
}

export interface RowAction<T> {
  label: string
  icon?: ReactNode
  isLink?: boolean
  url?: string | ((row: T) => string)
  onClick?: (row: T) => void
  variant?: 'default' | 'outline' | 'ghost' | 'danger'
  disabled?: (row: T) => boolean
  hidden?: (row: T) => boolean
}

export const createStandardRowActions = <T,>({
  onView,
  onEdit,
  onDelete,
  isEditDisabled,
  isDeleteDisabled,
  permissions,
}: {
  onView?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  isEditDisabled?: (row: T) => boolean
  isDeleteDisabled?: (row: T) => boolean
  permissions?: string[]
}): RowAction<T>[] => {
  const actions: RowAction<T>[] = []
  const can = (permission: string) => !permissions || permissions.includes(permission)

  if (onView && can('view')) {
    actions.push({
      label: 'เข้าดู',
      icon: <Eye className="h-4 w-4" />,
      onClick: onView,
    })
  }

  if (onEdit && can('edit')) {
    actions.push({
      label: 'แก้ไข',
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
      disabled: isEditDisabled,
    })
  }

  if (onDelete && can('delete')) {
    actions.push({
      label: 'ลบ',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: onDelete,
      variant: 'danger',
      disabled: isDeleteDisabled,
    })
  }

  return actions
}

export const createStandardLinkRowActions = <T,>({
  urlEdit,
  urlDelete,
}: {
  urlEdit?: (row: T) => string
  urlDelete?: (row: T) => string
}): RowAction<T>[] => {
  const actions: RowAction<T>[] = []

  if (urlEdit) {
    actions.push({
      label: 'แก้ไข',
      icon: <Edit className="h-4 w-4" />,
      isLink: true,
      url: urlEdit,
    })
  }

  if (urlDelete) {
    actions.push({
      label: 'ลบ',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'danger',
      isLink: true,
      url: urlDelete,
    })
  }

  return actions
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyAccessor: (row: T) => string
  selectedIds?: Set<string>
  rowActions?: RowAction<T>[]
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  emptyMessage?: string
  emptyIcon?: ReactNode
  isLoading?: boolean
  showRowNumbers?: boolean
  rowClassName?: (row: T) => string | undefined
  pagination?: {
    currentPage?: number
    perPage?: number
    total?: number
    lastPage?: number
    firstPageUrl?: string
    lastPageUrl?: string
    previousPageUrl?: string
    nextPageUrl?: string
    onPageChange?: (page: number) => void
    // page: number
    // pageSize: number
    // total: number
    // totalPages: number
    // onPageChange?: (page: number) => void
    // onPageSizeChange?: (size: number) => void
  }
  paginationBy?: any
  bulkActions?: ReactNode
}

export function DataTable<T>({
  columns,
  data,
  keyAccessor,
  selectedIds = new Set(),
  rowActions,
  emptyMessage = 'ไม่พบรายการ',
  emptyIcon,
  isLoading = false,
  showRowNumbers = false,
  rowClassName,
  pagination,
  paginationBy,
  bulkActions,
}: DataTableProps<T>) {
  // const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1
  return (
    <div className="space-y-4">
      {bulkActions && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-(--gold)/30 bg-gold-soft px-4 py-3">
          <span className="text-sm font-semibold text-[#111827]">
            เลือกแล้ว {selectedIds.size} รายการ
          </span>
          {bulkActions}
        </div>
      )}
      <div className="rounded-xl border border-border bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-(--surface-muted)">
                {showRowNumbers && <TableHead className="w-12 text-center">#</TableHead>}
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    // className={col.width ? `w-[${col.width}]` : undefined}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    <span className="font-semibold">{col.header}</span>
                  </TableHead>
                ))}
                {rowActions && rowActions.length > 0 && (
                  <TableHead className="w-30 text-center">จัดการ</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {showRowNumbers && (
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        <Skeleton />
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow key="0">
                  <TableCell
                    colSpan={columns.length + (showRowNumbers ? 1 : 0) + (rowActions ? 1 : 0)}
                    className="py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {emptyIcon && <span className="text-slate-400">{emptyIcon}</span>}
                      <span className="text-sm font-semibold text-slate-500">{emptyMessage}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.length > 0 &&
                data.map((row, index) => {
                  const id = keyAccessor(row)
                  return (
                    <TableRow key={id} className={rowClassName?.(row)}>
                      {showRowNumbers && (
                        <TableCell className="text-center text-sm text-slate-500">
                          {index + 1}
                        </TableCell>
                      )}
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          {col.render
                            ? col.render(row)
                            : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                        </TableCell>
                      ))}
                      {rowActions && rowActions.length > 0 && (
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {rowActions
                              .filter((action) => !action.hidden?.(row))
                              .map((action, i) =>
                                action.isLink ? (
                                  <Link
                                    key={i}
                                    href={
                                      typeof action.url === 'function'
                                        ? action.url(row)
                                        : action.url
                                    }
                                    variant={
                                      (action.variant as
                                        'default' | 'outline' | 'ghost' | 'destructive') || 'ghost'
                                    }
                                    className={
                                      action.variant === 'danger'
                                        ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                                        : 'text-slate-600 hover:text-[#111827]'
                                    }
                                  >
                                    {action.icon || action.label}
                                  </Link>
                                ) : (
                                  <Button
                                    key={i}
                                    type="button"
                                    variant={
                                      (action.variant as
                                        'default' | 'outline' | 'ghost' | 'destructive') || 'ghost'
                                    }
                                    size="sm"
                                    className={[
                                      action.variant === 'danger'
                                        ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
                                        : 'text-slate-600 hover:text-[#111827]',

                                      action.disabled && action.disabled(row) ? 'text-white' : '',
                                    ].join(' ')}
                                    disabled={action.disabled?.(row)}
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                      e.stopPropagation()
                                      action.onClick?.(row)
                                    }}
                                  >
                                    {action.icon || action.label}
                                  </Button>
                                )
                              )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {pagination && (pagination!.lastPage ?? 1) > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm font-medium text-slate-500">
            แสดง {((pagination.currentPage ?? 1) - 1) * (pagination.perPage ?? 10) + 1}–
            {Math.min(
              (pagination.currentPage ?? 1) * (pagination.perPage ?? 10),
              pagination.total ?? 0
            )}{' '}
            จาก {pagination.total} รายการ
          </div>
          <div className="flex items-center gap-1">
            {pagination.previousPageUrl ? (
              pagination.onPageChange ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border bg-white"
                  onClick={() => pagination.onPageChange?.(1)}
                  disabled={pagination.currentPage === undefined || pagination.currentPage! <= 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              ) : (
                <Link
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border bg-white"
                  href={pagination.firstPageUrl}
                  only={paginationBy}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Link>
              )
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border bg-white"
                disabled={true}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            )}
            {pagination.previousPageUrl ? (
              pagination.onPageChange ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border bg-white"
                  onClick={() => pagination.onPageChange?.((pagination.currentPage ?? 1) - 1)}
                  disabled={(pagination.currentPage ?? 1) <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              ) : (
                <Link
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border bg-white"
                  href={pagination.previousPageUrl}
                  only={paginationBy}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              )
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border bg-white"
                disabled={true}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <span className="px-3 text-sm font-semibold text-[#111827]">
              {pagination.currentPage ?? 1} / {pagination.lastPage}
            </span>
            {pagination.nextPageUrl ? (
              pagination.onPageChange ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border bg-white"
                  onClick={() => pagination.onPageChange?.((pagination.currentPage ?? 1) + 1)}
                  disabled={(pagination.currentPage ?? 1) >= (pagination.lastPage ?? 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Link
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border bg-white"
                  href={pagination.nextPageUrl}
                  only={paginationBy}
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border bg-white"
                disabled={true}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            {pagination.nextPageUrl ? (
              pagination.onPageChange ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border bg-white"
                  onClick={() => pagination.onPageChange?.(pagination.lastPage ?? 1)}
                  disabled={(pagination.currentPage ?? 1) >= (pagination.lastPage ?? 1)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              ) : (
                <Link
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border bg-white"
                  href={pagination.lastPageUrl}
                  only={paginationBy}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Link>
              )
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border bg-white"
                disabled={true}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Skeleton() {
  return <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
}
