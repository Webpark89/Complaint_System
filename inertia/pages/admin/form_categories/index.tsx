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
import { FolderOpen, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createStandardRowActions, DataTable } from '~/components/admin/crud/components/data_table'
import { router, usePage } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { type Data } from '~/generated/data'
import { ActiveStatusVariant, FILTER_ACTIVE_STATUS } from '~/components/admin/crud/utils/enum'

interface PaginatedFormCategories {
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
  model: Data.FormCategory[]
}

interface Props {
  filters: { search: string; status: string; page: number }
  data?: PaginatedFormCategories
  createUrl: string
}

export default function FormCategoriesIndex({ filters, data, createUrl }: Props) {
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
  const [selectedItem, setSelectedItem] = useState<Data.FormCategory | null>(null)

  const handleDelete = useCallback((row: Data.FormCategory) => {
    setSelectedItem(row)
    // console.log(row, selectedItem)
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

  const rowActions = createStandardRowActions<Data.FormCategory>({
    permissions,
    onView: (row: Data.FormCategory) => {
      return router.visit(row.view_url)
    },
    onEdit: (row: Data.FormCategory) => {
      return router.visit(row.edit_url)
    },
    onDelete: handleDelete,
    isDeleteDisabled: (row: Data.FormCategory) => row.form_subjects_count > 0,
  })

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: '#',
      render: (r) => <span className="font-semibold text-slate-700">{r.id}</span>,
    },
    {
      key: 'name',
      header: 'ชื่อหมวดหมู่',
      render: (r: Data.FormCategory) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <FolderOpen className="h-4 w-4 text-gold" />
          {r.title}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'คำอธิบาย',
      render: (r: Data.FormCategory) => <span className="text-slate-600">{r.description}</span>,
    },
    {
      key: 'sequence',
      header: 'ลำดับ',
      render: (r: Data.FormCategory) => <span className="text-slate-600">{r.sequence}</span>,
    },
    {
      key: 'subcategoryCount',
      header: 'หมวดย่อย',
      render: (r: Data.FormCategory) => (
        <span className="text-slate-600"> {r.form_subjects_count} รายการ </span>
      ),
    },
    {
      key: 'status',
      header: 'สถานะ',
      width: '140px',
      render: (r: Data.FormCategory) => (
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
            title="หมวดหมู่เรื่องร้องเรียน"
            description="จัดการหมวดหมู่และประเภทเรื่อง"
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
