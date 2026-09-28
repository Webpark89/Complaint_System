import {
  PageHeader,
  ActionToolbar,
  useCRUD,
  // SearchInput,
  FilterTabs,
  type Column,
  StatusBadge,
} from '~/components/admin/crud'
// import { TABLE_LABELS } from '~/components/admin/constants/table_labels'
import { Card, CardContent } from '~/components/ui/card'
// import { Button } from '~/components/ui/button'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DataTable } from '~/components/admin/crud/components/data_table'
import { router } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { type Data } from '~/generated/data'
import { DateRangePicker } from '~/components/admin/ui/form/date_range_picker'
import { formatLocalDate } from '~/lib/format_local_date'
import { ComplaintStatusVariant, FILTER_ACTIVE_STATUS } from '~/components/admin/crud/utils/enum'

interface PaginatedReportInvestigation {
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
  filters: { search: string; status: string; from: string; to: string; page: number }
  data?: PaginatedReportInvestigation
}

export default function ReportInvestigationIndex({ filters, data }: Props) {
  const [filterSearch, setFilterSearch] = useState(filters.search || '')
  const [filterStatus, setFilterStatus] = useState(filters.status || '')
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
      data: { search, status, from, to, page: newPage }, // page:1 Reset to page 1 on new search
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
  }, [filterSearch, filterStatus, filterFrom, filterTo])

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
    setFilterFrom(formatLocalDate(val.from))
    setFilterTo(formatLocalDate(val.to))
  }

  const handleExport = () => {
    window.location.href = `/process/report_investigation/export?from=${filterFrom ?? ''}&to=${filterTo ?? ''}&status=${filterStatus}`
  }

  // console.log(dateRange)
  const [state, actions] = useCRUD<any>([])

  const columns: Column<any>[] = [
    {
      key: 'code',
      header: 'รหัสเรื่อง',
      render: (r) => <span className="font-semibold text-slate-700">{r.code}</span>,
    },
    {
      key: 'category',
      header: 'หัวข้อ',
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
            title="รายงานผลการตรวจสอบ"
            description="รายงานผลการตรวจสอบเรื่องร้องเรียน"
            breadcrumbs={[{ label: 'รายงาน' }]}
            actionButtons={<ActionToolbar onExportCSV={handleExport} isLoading={state.isLoading} />}
          />

          <Card className="border-border bg-white shadow-soft">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* <SearchInput
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e)}
                  placeholder="ค้นหา..."
                /> */}
                <DateRangePicker onChange={handleDateRangeChange} />
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
