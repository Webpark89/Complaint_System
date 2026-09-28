import {
  PageHeader,
  ActionToolbar,
  useCRUD,
  // SearchInput,
  // FilterTabs,
  type Column,
} from '~/components/admin/crud'
// import { TABLE_LABELS } from '~/components/admin/constants/table_labels'
import { Card, CardContent } from '~/components/ui/card'
// import { Button } from '~/components/ui/button'
import { Calendar } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DataTable } from '~/components/admin/crud/components/data_table'
import { router } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { type Data } from '~/generated/data'
import { Badge } from '~/components/ui/badge'
import { DateRangePicker } from '~/components/admin/ui/form/date_range_picker'
import { formatLocalDate } from '~/lib/format_local_date'

interface PaginatedReportSLA {
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
  model: Data.ReportSLA[]
}

interface Props {
  filters: { search: string; status: string; from: string; to: string; page: number }
  data?: PaginatedReportSLA
}

export default function ReportSLAIndex({ filters, data }: Props) {
  const [filterSearch, setFilterSearch] = useState(filters.search || '')
  const [filterFrom, setFilterFrom] = useState(filters.from || '')
  const [filterTo, setFilterTo] = useState(filters.to || '')
  // const [dateRange, setDateRange] = useState(filters.from{
  //   from: DateRangePickerDefaultFrom(),
  //   to: DateRangePickerDefaultTo(),
  // })
  // const [filterStatus, setFilterStatus] = useState(filters.status || '')
  const [page, setPage] = useState(data?.meta?.currentPage || 1)
  const isInitialRender = useRef(true)

  const reloadDataTable = (search: string, from: string, to: string, newPage: number) => {
    router.reload({
      data: { search, from, to, page: newPage }, // page:1 Reset to page 1 on new search
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
      reloadDataTable(filterSearch, filterFrom, filterTo, 1)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [filterSearch, filterFrom, filterTo])

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) {
      return
    }

    setPage(nextPage)
    reloadDataTable(filterSearch, filterFrom, filterTo, nextPage)
  }

  const handleDateRangeChange = (val: any) => {
    // console.log('dateRange', val)
    // setDateRange(val)
    setFilterFrom(formatLocalDate(val.from))
    setFilterTo(formatLocalDate(val.to))
  }

  const handleExport = () => {
    window.location.href = `/process/report_sla/export?from=${filterFrom ?? ''}&to=${filterTo ?? ''}`
  }

  // console.log(dateRange)
  const [state, actions] = useCRUD<any>([])

  const columns: Column<any>[] = [
    // {
    //   key: 'id',
    //   header: '#',
    //   render: (r) => <span className="font-semibold text-slate-700">{r.id}</span>,
    // },
    {
      key: 'month',
      header: 'เดือน',
      render: (r: Data.ReportSLA) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <Calendar className="h-3 w-3 text-gold" />
          {r.month}
        </span>
      ),
    },
    {
      key: 'percent_sla',
      header: 'SLA %',
      render: (r: Data.ReportSLA) => <span className="text-slate-600">{r.percent_sla}</span>,
    },
    {
      key: 'count_on_due',
      header: 'ภายใน SLA',
      render: (r: Data.ReportSLA) => (
        <Badge variant="default" className="bg-green-100 text-green-700">
          {r.count_on_due ?? 0}
        </Badge>
      ),
    },
    {
      key: 'count_overdue',
      header: 'เกิน SLA',
      render: (r: Data.ReportSLA) => (
        <Badge variant="default" className="bg-amber-100 text-amber-700">
          {r.count_overdue ?? 0}
        </Badge>
      ),
    },
    {
      key: 'percent_tracking_sla',
      header: 'SLA % (ครั้ง)',
      render: (r: Data.ReportSLA) => (
        <span className="text-slate-600">{r.percent_tracking_sla}</span>
      ),
    },
    {
      key: 'count_tracking_on_due',
      header: 'ภายใน SLA (ครั้ง)',
      render: (r: Data.ReportSLA) => (
        <Badge variant="default" className="bg-green-100 text-green-700">
          {r.count_tracking_on_due ?? 0}
        </Badge>
      ),
    },
    {
      key: 'count_tracking_overdue',
      header: 'เกิน SLA (ครั้ง)',
      render: (r: Data.ReportSLA) => (
        <Badge variant="default" className="bg-amber-100 text-amber-700">
          {r.count_tracking_overdue ?? 0}
        </Badge>
      ),
    },
    // createViewColumn<any>(handleView),
  ]

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="รายงาน SLA"
            description="รายงานการปฏิบัติตาม SLA"
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
                {/* <FilterTabs
                  options={FILTER_ACTIVE_STATUS}
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e)
                  }}
                /> */}
              </div>

              <DataTable
                columns={columns}
                data={data?.model ?? []}
                keyAccessor={(r: any) => r.month}
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
