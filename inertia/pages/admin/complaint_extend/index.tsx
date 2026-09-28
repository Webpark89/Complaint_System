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
import { useEffect, useRef, useState } from 'react'
import { createStandardRowActions, DataTable } from '~/components/admin/crud/components/data_table'
import { router, usePage } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { type Data } from '~/generated/data'
import {
  ComplaintApproveStatusVariant,
  OPTIONS_COMPLAINT_APPROVE_STATUS,
} from '~/components/admin/crud/utils/enum'
// import { Badge } from '~/components/ui/badge'
import { formatDate } from '~/lib/utils'
import { ApproveStatus } from '~/../app/contracts/enum'

interface PaginatedComplaintExtends {
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
  model: Data.ComplaintTracking[]
}

interface Props {
  filters: {
    search: string
    approveStatus: string
    page: number
    formCategory: string
    formSubject: string
  }
  data?: PaginatedComplaintExtends
  createUrl: string
  formCategories: Array<{ label: string; value: number }>
  formSubjects: Array<{ label: string; value: number; categoryId: number }>
}

export default function ComplaintsIndex({ filters, data, formCategories, formSubjects }: Props) {
  const { props } = usePage<any>()
  const permissions = props.currentModulePermission as string[] | undefined
  const [filterSearch, setFilterSearch] = useState(filters.search || '')
  const [filterApproveStatus, setFilterApproveStatus] = useState(filters.approveStatus || '')
  const [filterFormCategory, setFilterFormCategory] = useState(filters.formCategory || '')
  const [filterFormSubject, setFilterFormSubject] = useState(filters.formSubject || '')
  const [page, setPage] = useState(data?.meta?.currentPage || 1)
  const isInitialRender = useRef(true)

  const filteredFormSubjects = filterFormCategory
    ? formSubjects.filter((subject) => subject.categoryId === Number(filterFormCategory))
    : formSubjects

  const handleFormCategoryChange = (value: string) => {
    setFilterFormCategory(value)
    setFilterFormSubject('')
  }

  const reloadDataTable = (
    search: string,
    approveStatus: string,
    formCategory: string,
    formSubject: string,
    newPage: number
  ) => {
    router.reload({
      data: { search, approveStatus, page: newPage, formCategory, formSubject },
      only: ['data', 'filters'],
      // preserveState: true,
      // preserveScroll: true,
    })
  }

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    const delayDebounceFn = setTimeout(() => {
      reloadDataTable(filterSearch, filterApproveStatus, filterFormCategory, filterFormSubject, 1)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [filterSearch, filterApproveStatus, filterFormCategory, filterFormSubject])

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) {
      return
    }

    setPage(nextPage)
    reloadDataTable(
      filterSearch,
      filterApproveStatus,
      filterFormCategory,
      filterFormSubject,
      nextPage
    )
  }

  const [state] = useCRUD<any>([])

  const rowActions = createStandardRowActions<Data.Complaint>({
    permissions,
    onView: (row: Data.Complaint) => {
      return router.visit(`/process/complaint_extend/${row.id}`)
    },
    onEdit: (row: Data.Complaint) => {
      return router.visit(`/process/complaint_extend/${row.id}/edit`)
    },
    // onDelete: handleDelete,
  }).map((action) =>
    action.label === 'แก้ไข'
      ? {
          ...action,
          hidden: (row: Data.Complaint) => row.approve_status !== ApproveStatus.PENDING,
        }
      : action
  )

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
      render: (r) => <span className="font-semibold text-slate-700">{r.Complaint.code}</span>,
    },
    {
      key: 'subject',
      header: 'หัวข้อ/หมวดหมู่',
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          {/* <FileText className="h-4 w-4 text-[var(--gold)]" /> */}
          {r.Complaint.FormCategory?.title} &gt;
          <br />
          {r.Complaint.FormSubject?.title} {r.Complaint.FormSubjectOther}
        </span>
      ),
    },
    {
      key: 'ownedUser',
      header: 'ผู้ขอ',
      // width: '160px',
      render: (r) => <span className="text-slate-600"> {r.Owner ? r.Owner.fullName : '-'} </span>,
    },
    {
      key: 'dueDate',
      header: 'กำหนดส่ง',
      width: '160px',
      render: (r) => (
        <span className="text-slate-600"> {r.dueDate ? formatDate(r.dueDate) : '-'} </span>
      ),
    },
    {
      key: 'dueDateExtend',
      header: 'กำหนดใหม่',
      width: '160px',
      render: (r) => (
        <span className="text-slate-600">
          {' '}
          {r.dueDateExtend ? formatDate(r.dueDateExtend) : '-'}{' '}
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
      key: 'status',
      header: 'สถานะ',
      width: '120px',
      render: (r) => (
        <>
          <StatusBadge
            status={String(r.approve_status_title)}
            variant={ComplaintApproveStatusVariant(r.approve_status)}
          />
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

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="การขยายเวลาดำเนินงาน"
            description="จัดการคำขอขยายเวลาดำเนินงานเรื่องร้องเรียน"
            breadcrumbs={[{ label: 'ขยายเวลาดำเนินงาน' }]}
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
                <FilterTabs
                  options={OPTIONS_COMPLAINT_APPROVE_STATUS}
                  value={filterApproveStatus}
                  onChange={setFilterApproveStatus}
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
              />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  )
}
