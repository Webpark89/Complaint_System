import {
  PageHeader,
  ActionToolbar,
  useCRUD,
  SearchInput,
  FilterTabs,
  DeleteDialog,
  StatusBadge,
  type Column,
} from '~/components/admin/crud'
// import { TABLE_LABELS } from '~/components/admin/constants/table_labels'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Mail, Trash2, UserCog } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createStandardRowActions, DataTable } from '~/components/admin/crud/components/data_table'
import { router, usePage } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { type Data } from '~/generated/data'
import { ActiveStatusVariant, FILTER_ACTIVE_STATUS } from '~/components/admin/crud/utils/enum'
import { formatDateTime } from '~/lib/utils'

interface PaginatedUsers {
  meta: {
    currentPage: number
    perPage: number
    total: number
    lastPage: number
    firstPageUrl: string
    lastPageUrl: string
    previousPageUrl: string
    nextPageUrl: string
  }
  model: Data.User[]
}

interface Props {
  filters: { search: string; status: string; page: number }
  data?: PaginatedUsers
  createUrl: string
}

export default function UsersIndex({ filters, data, createUrl }: Props) {
  const { props } = usePage<any>()
  const permissions = props.currentModulePermission as string[] | undefined
  const [filterSearch, setFilterSearch] = useState(filters.search || '')
  const [filterStatus, setFilterStatus] = useState(filters.status || '')
  const [page, setPage] = useState(data?.meta?.currentPage || 1)
  const isInitialRender = useRef(true)
  const reloadDataTable = (search: string, status: string, newPage: number) => {
    router.reload({
      data: { search, status, page: newPage }, // page:1 Reset to page 1 on new search
      only: ['data', 'filters'],
      preserveState: true,
      preserveScroll: true,
    })
  }

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    const delayDebounceFn = setTimeout(() => {
      reloadDataTable(filterSearch, filterStatus, 1)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [filterSearch, filterStatus])

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) {
      return
    }

    setPage(nextPage)
    reloadDataTable(filterSearch, filterStatus, nextPage)
  }

  const handleAddNew = () => {
    return router.visit(createUrl)
  }

  const [state, actions] = useCRUD<any>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Data.User | null>(null)

  const handleDelete = useCallback((row: Data.User) => {
    setSelectedItem(row)
    setDeleteDialogOpen(true)
  }, [])
  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) {
      router.delete(selectedItem.delete_url)
      preserverScroll: true
    }
    setDeleteDialogOpen(false)
    setSelectedItem(null)
  }, [actions, selectedItem])

  const rowActions = createStandardRowActions<Data.User>({
    permissions,
    onView: (row: Data.User) => {
      return router.visit(row.view_url)
    },
    onEdit: (row: Data.User) => {
      return router.visit(row.edit_url)
    },
    onDelete: handleDelete,
  })

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: '#',
      render: (r) => <span className="font-semibold text-slate-700">{r.id}</span>,
    },
    {
      key: 'name',
      header: 'ชื่อ-นามสกุล',
      render: (r: Data.User) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">{r.fullName}</span>
      ),
    },
    {
      key: 'email',
      header: 'อีเมล',
      render: (r: Data.User) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Mail className="h-3 w-3 text-slate-400" />
          {r.email}
        </span>
      ),
    },
    {
      key: 'role',
      header: 'บทบาท',
      render: (r: Data.User) => (
        <span className="flex items-center gap-1 text-slate-600">
          <UserCog className="h-3 w-3 text-slate-400" />
          {r.role?.title}{' '}
        </span>
      ),
    },
    {
      key: 'department',
      header: 'หน่วยงาน',
      render: (r: Data.User) => <span className="text-slate-600">{r.organization?.title} </span>,
    },
    {
      key: 'lastLogin',
      header: 'เข้าใช้ล่าสุด',
      render: (r: Data.User) => (
        <span className="text-slate-600">{formatDateTime(r.loginAt)} </span>
      ),
    },
    {
      key: 'status',
      header: 'สถานะ',
      width: '140px',
      render: (r: Data.User) => (
        <StatusBadge status={String(r.status)} variant={ActiveStatusVariant(r.status_id)} />
      ),
    },
    // createViewColumn<any>(handleView),
  ]

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="ผู้ใช้งาน"
            description="จัดการผู้ใช้งานระบบ"
            breadcrumbs={[{ label: 'ตั้งค่าระบบ' }]}
            actionButtons={
              <ActionToolbar
                onAddNew={handleAddNew}
                showAddNew={permissions?.includes('create')}
                isLoading={state.isLoading}
              />
            }
          />

          <Card className="border-border bg-white shadow-soft">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <SearchInput
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e)}
                  placeholder="ค้นหา..."
                />
                <FilterTabs
                  options={FILTER_ACTIVE_STATUS}
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e)
                  }}
                />
              </div>

              <DataTable
                columns={columns}
                data={data?.model ?? []}
                keyAccessor={(r: any) => r.id}
                // selectedIds={state.selectedIds}
                rowActions={rowActions}
                emptyMessage="ไม่พบรายการ"
                isLoading={!data}
                showRowNumbers={false}
                paginationBy={['page', 'filters', 'data']}
                pagination={{
                  ...data?.meta,
                  onPageChange: handlePageChange,
                }}
                // paginations={{
                //   page: meta.currentPage,
                //   pageSize: meta.perPage,
                //   total: meta.total,
                //   totalPages: meta.lastPage,
                //   // onPageChange: actions.setPage,
                // }}
                bulkActions={
                  permissions?.includes('delete') ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border bg-white"
                        // onClick={() => alert(`ลบ ${state.selectedIds.size} รายการ (จำลอง)`)}
                      >
                        <Trash2 className="mr-1 h-3 w-3" /> ลบที่เลือก
                      </Button>
                    </div>
                  ) : undefined
                }
              />
            </CardContent>
          </Card>

          <DeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="ยืนยันการลบข้อมูล"
            description="ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้"
            itemName={selectedItem?.title}
            onConfirm={handleConfirmDelete}
          />
        </div>
      </AdminLayout>
    </>
  )
}
