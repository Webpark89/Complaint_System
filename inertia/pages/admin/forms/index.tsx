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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { FolderOpen, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createStandardRowActions, DataTable } from '~/components/admin/crud/components/data_table'
import { router, usePage } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { type Data } from '~/generated/data'
import { ActiveStatusVariant, FILTER_ACTIVE_STATUS } from '~/components/admin/crud/utils/enum'
import { formatDateTime } from '~/lib/utils'

interface PaginatedForms {
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
  model: Data.Form[]
}

interface Props {
  filters: { search: string; status: string; formCategory: string; page: number }
  data?: PaginatedForms
  createUrl: string
  formCategories: Array<{ label: string; value: number }>
}

export default function FormsIndex({ filters, data, createUrl, formCategories }: Props) {
  const { props } = usePage<any>()
  const permissions = props.currentModulePermission as string[] | undefined
  const [filterSearch, setFilterSearch] = useState(filters.search || '')
  const [filterStatus, setFilterStatus] = useState(filters.status || '')
  const [filterFormCategory, setFilterFormCategory] = useState(filters.formCategory || '')
  const [page, setPage] = useState(data?.meta?.currentPage || 1)
  const isInitialRender = useRef(true)

  const reloadDataTable = (
    search: string,
    status: string,
    formCategory: string,
    newPage: number
  ) => {
    router.reload({
      data: { search, status, form_category: formCategory, page: newPage }, // page:1 Reset to page 1 on new search
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
      reloadDataTable(filterSearch, filterStatus, filterFormCategory, 1)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [filterSearch, filterStatus, filterFormCategory])

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) {
      return
    }

    setPage(nextPage)
    reloadDataTable(filterSearch, filterStatus, filterFormCategory, nextPage)
  }

  const handleAddNew = () => {
    return router.visit(createUrl)
  }

  const [state, actions] = useCRUD<any>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Data.Form | null>(null)

  const handleDelete = useCallback((row: Data.Form) => {
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

  const rowActions = createStandardRowActions<Data.Form>({
    permissions,
    onView: (row: Data.Form) => {
      return router.visit(row.view_url)
    },
    onEdit: (row: Data.Form) => {
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
      header: 'ชื่อฟอร์ม',
      render: (r: Data.Form) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">{r.title}</span>
      ),
    },
    {
      key: 'form_category',
      header: 'หมวดหมู่',
      render: (r: Data.Form) => (
        <span className="flex items-center gap-1 text-slate-600">
          <FolderOpen className="h-3 w-3 text-gold" />
          {r.form_category?.title}
        </span>
      ),
    },
    {
      key: 'version',
      header: 'เวอร์ชัน',
      width: '100px',
      render: (r: Data.Form) => <span className="text-slate-600">{r.version}</span>,
    },
    {
      key: 'updatedAt',
      header: 'อัปเดตล่าสุด',
      width: '180px',
      render: (r: Data.Form) => (
        <span className="text-slate-600">{formatDateTime(r.updatedAt)}</span>
      ),
    },
    {
      key: 'status',
      header: 'สถานะ',
      width: '140px',
      render: (r: Data.Form) => (
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
            title="แบบฟอร์มร้องเรียน"
            description="กำหนดฟอร์มและช่องข้อมูล"
            breadcrumbs={[{ label: 'ตั้งค่าระบบ' }]}
            actionButtons={
              <ActionToolbar
                // onRefresh={handleRefresh}
                // onImport={handleImport}
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
                <Select value={filterFormCategory} onValueChange={setFilterFormCategory}>
                  <SelectTrigger className="w-50">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">ทั้งหมด</SelectItem>
                    {formCategories.map((category) => (
                      <SelectItem key={category.value} value={String(category.value)}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
