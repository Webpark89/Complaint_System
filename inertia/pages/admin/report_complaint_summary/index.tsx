import {
  PageHeader,
  ActionToolbar,
  useCRUD,
  SearchInput,
  type Column,
  StatusBadge,
} from '~/components/admin/crud'
// import { TABLE_LABELS } from '~/components/admin/constants/table_labels'
import { Card, CardContent } from '~/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
// import { Button } from '~/components/ui/button'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DataTable } from '~/components/admin/crud/components/data_table'
import { router } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { type Data } from '~/generated/data'
import { DateRangePicker } from '~/components/admin/ui/form/date_range_picker'
import { formatLocalDate } from '~/lib/format_local_date'
import {
  ComplaintStatusVariant,
  OPTIONS_COMPLAINT_STATUS,
} from '~/components/admin/crud/utils/enum'

interface PaginatedComplaintSummary {
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
  model: Data.ReportInvestigation[]
}

interface Props {
  filters: {
    search: string
    formCategory: string
    formSubject: string
    owner: string
    status: string
    from: string
    to: string
    page: number
  }
  data?: PaginatedComplaintSummary
  formCategories: Array<{ label: string; value: number }>
  formSubjects: Array<{ label: string; value: number; categoryId: number }>
}

export default function PaginatedComplaintSummaryIndex({
  filters,
  data,
  formCategories,
  formSubjects,
}: Props) {
  const [filterSearch, setFilterSearch] = useState(filters.search || '')
  const [filterStatus, setFilterStatus] = useState(filters.status || '')
  const [filterFormCategory, setFilterFormCategory] = useState(filters.formCategory || '')
  const [filterFormSubject, setFilterFormSubject] = useState(filters.formSubject || '')
  const [filterOwner, setFilterOwner] = useState(filters.owner || '')
  const [filterFrom, setFilterFrom] = useState(filters.from || '')
  const [filterTo, setFilterTo] = useState(filters.to || '')
  // const [dateRange, setDateRange] = useState(filters.from{
  //   from: DateRangePickerDefaultFrom(),
  //   to: DateRangePickerDefaultTo(),
  // })
  const [page, setPage] = useState(data?.meta?.currentPage || 1)
  const isInitialRender = useRef(true)

  const reloadDataTable = (
    search: string,
    status: string,
    from: string,
    to: string,
    newPage: number
  ) => {
    router.reload({
      data: {
        search,
        status,
        formCategory: filterFormCategory,
        formSubject: filterFormSubject,
        owner: filterOwner,
        from,
        to,
        page: newPage,
      },
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
      reloadDataTable(filterSearch, filterStatus, filterFrom, filterTo, 1)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [
    filterSearch,
    filterStatus,
    filterFormCategory,
    filterFormSubject,
    filterOwner,
    filterFrom,
    filterTo,
  ])

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) {
      return
    }

    setPage(nextPage)
    reloadDataTable(filterSearch, filterStatus, filterFrom, filterTo, nextPage)
  }

  const handleDateRangeChange = (val: any) => {
    // console.log('dateRange', val)
    // setDateRange(val)
    setFilterFrom(formatLocalDate(val?.from))
    setFilterTo(formatLocalDate(val?.to))
  }

  const handleExport = () => {
    window.location.href = `/process/report_complaint_summary/export?from=${filterFrom ?? ''}&to=${filterTo ?? ''}&status=${filterStatus}&search=${filterSearch}&formCategory=${filterFormCategory}&formSubject=${filterFormSubject}&owner=${filterOwner}`
  }

  // console.log(dateRange)
  const [state] = useCRUD<any>([])

  const columns: Column<any>[] = [
    {
      key: 'code',
      header: 'รหัสเรื่อง',
      render: (r) => <span className="font-semibold text-slate-700">{r.code}</span>,
    },
    {
      key: 'title',
      header: 'หัวข้อ',
      render: (r) => <span className="text-slate-700">{r.title}</span>,
    },
    {
      key: 'category',
      header: 'หมวดหมู่',
      render: (r: Data.ReportInvestigation) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <Search className="h-4 w-4 text-gold" />
          {r.category} &gt; {r.subject} {r.subject_other}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'วันที่รับแจ้ง',
      render: (r: Data.ReportInvestigation) => (
        <span className="text-slate-600">{r.created_at}</span>
      ),
    },
    {
      key: 'owner',
      header: 'ผู้สืบสวน',
      render: (r: Data.ReportInvestigation) => <span className="text-slate-600">{r.owner}</span>,
    },
    {
      key: 'count_tracking_overdue',
      header: 'เกิน SLA (ครั้ง)',
      render: (r) => <span className="text-slate-600">{r.count_tracking_overdue ?? 0}</span>,
    },
    {
      key: 'status',
      header: 'สถานะ',
      render: (r) => (
        <StatusBadge status={r.status_title} variant={ComplaintStatusVariant(r.status)} />
      ),
    },

    // createViewColumn<any>(handleView),
  ]

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="รายงานสรุปเรื่องร้องเรียน"
            description="รายงานสรุปเรื่องร้องเรียน"
            breadcrumbs={[{ label: 'รายงาน' }]}
            actionButtons={<ActionToolbar onExportCSV={handleExport} isLoading={state.isLoading} />}
          />

          <Card className="border-border bg-white shadow-soft">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap">
                <SearchInput
                  className="w-44"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e)}
                  placeholder="ค้นหารหัสหรือชื่อเรื่อง..."
                />
                <Select
                  value={filterFormCategory}
                  onValueChange={(value) => {
                    setFilterFormCategory(value)
                    setFilterFormSubject('')
                  }}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">ทั้งหมด</SelectItem>
                    {formCategories.map((x) => (
                      <SelectItem key={x.value} value={String(x.value)}>
                        {x.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterFormSubject}
                  onValueChange={setFilterFormSubject}
                  disabled={!filterFormCategory}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue
                      placeholder={filterFormCategory ? 'เลือกประเด็น' : 'เลือกหมวดหมู่ก่อน'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">ทั้งหมด</SelectItem>
                    {formSubjects
                      .filter((x) => x.categoryId === Number(filterFormCategory))
                      .map((x) => (
                        <SelectItem key={x.value} value={String(x.value)}>
                          {x.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <DateRangePicker onChange={handleDateRangeChange} />
                <SearchInput
                  className="w-44"
                  value={filterOwner}
                  onChange={(value) => setFilterOwner(value)}
                  placeholder="ค้นหาผู้สืบสวน..."
                />
                <Select
                  value={filterStatus || ''}
                  onValueChange={(value) => setFilterStatus(value === '' ? '' : value)}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    {OPTIONS_COMPLAINT_STATUS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DataTable
                columns={columns}
                data={data?.model ?? []}
                keyAccessor={(r: any) => r.id}
                // selectedIds={state.selectedIds}
                // rowActions={rowActions}
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
