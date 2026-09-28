import {
  PageHeader,
  ActionToolbar,
  useCRUD,
  SearchInput,
  FilterTabs,
  StatusBadge,
  type Column,
} from '~/components/admin/crud'
import { Card, CardContent } from '~/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createStandardRowActions, DataTable } from '~/components/admin/crud/components/data_table'
import { router, usePage } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { type Data } from '~/generated/data'
import {
  ComplaintStatusVariant,
  // FILTER_ACTIVE_STATUS,
  OPTIONS_COMPLAINT_STATUS,
} from '~/components/admin/crud/utils/enum'
// import { Badge } from '~/components/ui/badge'
import { formatDate, formatDateTime } from '~/lib/utils'
import { ApproveStatus, ComplaintTrackingMode } from '~/../app/contracts/enum'
// import { Select } from 'react-day-picker'

interface PaginatedComplaints {
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
  model: Data.Complaint[]
}

interface Props {
  filters: {
    search: string
    status: string[]
    page: number
    formCategory: string
    formSubject: string
    sla: string
    organization: string
  }
  isSensitive: boolean
  data?: PaginatedComplaints
  createUrl: string
  formCategories: Array<{ label: string; value: number }>
  formSubjects: Array<{ label: string; value: number; categoryId: number }>
  organizations: Array<{ id: number; title: string }>
}

const getLocalDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function ComplaintsIndex({
  filters,
  isSensitive,
  data,
  formCategories,
  formSubjects,
  organizations,
}: Props) {
  const { props } = usePage<any>()
  const permissions = props.currentModulePermission as string[] | undefined
  const [filterSearch, setFilterSearch] = useState(filters.search || '')
  const [filterStatus, setFilterStatus] = useState<string[]>(filters.status || [])
  const [filterFormCategory, setFilterFormCategory] = useState(filters.formCategory || '')
  const [filterFormSubject, setFilterFormSubject] = useState(filters.formSubject || '')
  const [filterSla, setFilterSla] = useState(filters.sla || '')
  const [filterOrganization, setFilterOrganization] = useState(filters.organization || '')
  const [page, setPage] = useState(data?.meta?.currentPage || 1)
  const isInitialRender = useRef(true)

  // Filter form subjects based on selected category
  const filteredFormSubjects = filterFormCategory
    ? formSubjects.filter((subject) => subject.categoryId === Number(filterFormCategory))
    : formSubjects

  // Reset form subject when category changes
  const handleFormCategoryChange = (value: string) => {
    setFilterFormCategory(value)
    setFilterFormSubject('') // Reset form subject filter
  }

  const [state, actions] = useCRUD<any>([])

  const reloadDataTable = (
    search: string,
    status: string[],
    newPage: number,
    formCategory: string,
    formSubject: string,
    sla: string,
    organization: string
  ) => {
    actions.setLoading(true)
    router.reload({
      data: { search, status, page: newPage, formCategory, formSubject, sla, organization },
      only: ['data', 'filters'],
      // preserveScroll: true,
      onSuccess: () => {
        actions.setLoading(false)
      },
      onError: () => {
        actions.setLoading(false)
      },
    })
  }

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    const delayDebounceFn = setTimeout(() => {
      reloadDataTable(
        filterSearch,
        filterStatus,
        1,
        filterFormCategory,
        filterFormSubject,
        filterSla,
        filterOrganization
      )
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [
    filterSearch,
    filterStatus,
    filterFormCategory,
    filterFormSubject,
    filterSla,
    filterOrganization,
  ])

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) {
      return
    }

    setPage(nextPage)
    reloadDataTable(
      filterSearch,
      filterStatus,
      nextPage,
      filterFormCategory,
      filterFormSubject,
      filterSla,
      filterOrganization
    )
  }

  // const [state, actions] = useCRUD<any>([])
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  // const [selectedItem, setSelectedItem] = useState<Data.Complaint | null>(null)

  // const handleDelete = useCallback((row: Data.Complaint) => {
  //   setSelectedItem(row)
  //   // console.log(row, selectedItem)
  //   setDeleteDialogOpen(true)
  // }, [])
  // const handleConfirmDelete = useCallback(() => {
  //   if (selectedItem) {
  //     router.delete(selectedItem.delete_url)
  //     preserverScroll: true
  //   }
  //   setDeleteDialogOpen(false)
  //   setSelectedItem(null)
  // }, [actions, selectedItem])

  const rowActions = createStandardRowActions<Data.Complaint>({
    permissions,
    onView: (row: Data.Complaint) => {
      return router.visit(row.view_url)
    },
    onEdit: (row: Data.Complaint) => {
      return router.visit(row.edit_url)
    },
    isEditDisabled: (row: Data.Complaint) => {
      return row.edit_url === null
    },
    // onDelete: handleDelete,
  })

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: '#',
      render: (r) => <span className="font-semibold text-slate-700">{r.id}</span>,
    },
    {
      key: 'code',
      header: 'รหัสเรื่อง',
      width: '150px',
      render: (r) => <span className="font-semibold text-slate-700">{r.code}</span>,
    },
    {
      key: 'subject',
      header: 'หัวข้อ/หมวดหมู่',
      render: (r: Data.Complaint) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          {/* <FileText className="h-4 w-4 text-[var(--gold)]" /> */}
          {r.FormCategory?.title} &gt;
          <br />
          {r.FormSubject?.title} {r.FormSubjectOther}
        </span>
      ),
    },
    // {
    //   key: 'category',
    //   header: 'หมวดหมู่',
    //   render: (r: Data.Complaint) => (
    //     <Badge className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)] hover:bg-[rgba(193,201,214,0.12)]">
    //       {r.FormCategory?.title}
    //     </Badge>
    //   ),
    // },
    {
      key: 'location',
      header: 'พื่นที่/สาขา',
      render: (r: Data.Complaint) => (
        <span className="flex items-center gap-1 text-slate-600">
          <MapPin className="h-3 w-3 text-slate-400" />
          {r.Organization?.title}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'วันที่ร้องเรียน',
      width: '160px',
      render: (r: Data.Complaint) => (
        <span className="text-slate-600"> {formatDateTime(r.createdAt)} </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'อัพเดต',
      width: '160px',
      render: (r: Data.Complaint) => (
        <span className="text-slate-600">
          {' '}
          {r.updatedAt ? (
            <>
              {formatDateTime(r.updatedAt)} <br /> {r.updated_user ? r.updated_user.fullName : ''}
            </>
          ) : (
            ''
          )}{' '}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'กำหนดส่ง',
      width: '120px',
      render: (r: Data.Complaint) => (
        <span className="text-slate-600"> {r.dueDate ? formatDate(r.dueDate) : '-'} </span>
      ),
    },
    // {
    //   key: 'ownedUser',
    //   header: 'ผู้รับผิดชอบ',
    //   // width: '160px',
    //   render: (r: Data.Complaint) => (
    //     <span className="text-slate-600"> {r.ownedUser ? r.ownedUser.fullName : '-'} </span>
    //   ),
    // },
    {
      key: 'count_tracking_overdue',
      header: 'เกิน SLA (ครั้ง)',
      width: '100px',
      render: (r) => <span className="text-slate-600">{r.count_tracking_overdue ?? 0}</span>,
    },
    {
      key: 'status',
      header: 'สถานะ',
      width: '120px',
      render: (r: Data.Complaint) => (
        <>
          <StatusBadge status={String(r.status)} variant={ComplaintStatusVariant(r.status_id)} />
          {r.TrackingLast.mode_id === ComplaintTrackingMode.EXTEND_REQUEST &&
            r.TrackingLast.approve_status === ApproveStatus.PENDING && (
              <StatusBadge status="รออนุมัติขยายเวลา" variant="warning" />
            )}
        </>
      ),
    },
    // {
    //   key: 'sensitive',
    //   header: 'อ่อนไหว',
    //   width: '80px',
    //   render: (r) => (
    //     <Badge variant="outline" className={SensitiveStatusVariant(r.isSensitive)}>
    //       {r.isSensitiveTitle}
    //     </Badge>
    //   ),
    // },
    // createViewColumn<any>(handleView),
  ]

  const today = getLocalDate(new Date())
  const tomorrowDate = new Date()
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = getLocalDate(tomorrowDate)

  const getDueDateRowClassName = (row: Data.Complaint) => {
    const dueDate = row.dueDate ? String(row.dueDate).slice(0, 10) : null

    if (dueDate && dueDate < today) return 'bg-[#FFF3F5] hover:bg-[#FFF3F5]'
    if (dueDate === today || dueDate === tomorrow) return 'bg-[#FFF9E7] hover:bg-[#FFF9E7]'
    return undefined
  }

  console.log(data)
  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title={`รายการเรื่องร้องเรียน${isSensitive ? 'ข้อมูลอ่อนไหว' : ''}`}
            description={`จัดการรายการเรื่องร้องเรียน${isSensitive ? 'ข้อมูลอ่อนไหว' : ''}`}
            breadcrumbs={[{ label: `เรื่องร้องเรียน${isSensitive ? 'ข้อมูลอ่อนไหว' : ''}` }]}
            actionButtons={<ActionToolbar isLoading={state.isLoading} />}
          />

          <Card className="border-border bg-white shadow-soft">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <SearchInput
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e)}
                  placeholder="ค้นหา..."
                />
                <Select value={filterFormCategory} onValueChange={handleFormCategoryChange}>
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
                <Select
                  value={filterFormSubject}
                  onValueChange={setFilterFormSubject}
                  disabled={!filterFormCategory}
                >
                  <SelectTrigger className="w-50">
                    <SelectValue
                      placeholder={filterFormCategory ? 'เลือกประเด็น' : 'เลือกหมวดหมู่ก่อน'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">ทั้งหมด</SelectItem>
                    {filteredFormSubjects.map((subject) => (
                      <SelectItem key={subject.value} value={String(subject.value)}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterOrganization} onValueChange={setFilterOrganization}>
                  <SelectTrigger className="w-50">
                    <SelectValue placeholder="เลือกองค์กร" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">ทั้งหมด</SelectItem>
                    {organizations.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterSla} onValueChange={setFilterSla}>
                  <SelectTrigger className="w-50">
                    <SelectValue placeholder="เลือก SLA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">ทั้งหมด</SelectItem>
                    <SelectItem value="overdue">เกิน SLA</SelectItem>
                    <SelectItem value="due_soon">ใกล้ครบ SLA</SelectItem>
                  </SelectContent>
                </Select>
                <FilterTabs
                  options={OPTIONS_COMPLAINT_STATUS}
                  value={filterStatus}
                  multiple
                  onChange={setFilterStatus}
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
                rowClassName={getDueDateRowClassName}
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
                // bulkActions={
                //   <div className="flex gap-2">
                //     <Button
                //       size="sm"
                //       variant="outline"
                //       className="border-[var(--border)] bg-white"
                //       // onClick={() => alert(`ลบ ${state.selectedIds.size} รายการ (จำลอง)`)}
                //     >
                //       <Trash2 className="mr-1 h-3 w-3" /> ลบที่เลือก
                //     </Button>
                //   </div>
                // }
              />
            </CardContent>
          </Card>

          {/* <DeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="ยืนยันการลบข้อมูล"
            description="ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้"
            itemName={selectedItem?.title}
            onConfirm={handleConfirmDelete}
          /> */}
        </div>
      </AdminLayout>
    </>
  )
}
