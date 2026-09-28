import { PageHeader, ActionToolbar, useCRUD, type Column } from '~/components/admin/crud'
import { Card, CardContent } from '~/components/ui/card'
import { Clock, Shield, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { DataTable } from '~/components/admin/crud/components/data_table'
import { router } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { type Data } from '~/generated/data'
import { DateRangePicker } from '~/components/admin/ui/form/date_range_picker'
import { formatLocalDate } from '~/lib/format_local_date'

interface PaginatedReportAuditLog {
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
  model: Data.ReportAuditLog[]
}

interface Props {
  filters: { search: string; status: string; from: string; to: string; page: number }
  data?: PaginatedReportAuditLog
}

export default function ReportAuditLogIndex({ filters, data }: Props) {
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
    setFilterFrom(formatLocalDate(val?.from))
    setFilterTo(formatLocalDate(val?.to))
  }

  const handleExport = () => {
    window.location.href = `/process/report_audit_log/export?from=${filterFrom ?? ''}&to=${filterTo ?? ''}&status=${filterStatus}`
  }

  // console.log(dateRange)
  const [state, actions] = useCRUD<any>([])

  const columns: Column<any>[] = [
    {
      key: 'created_at',
      header: 'วันที่รับแจ้ง',
      render: (r: Data.ReportAuditLog) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Clock className="h-3 w-3 text-slate-400" />
          {r.created_at}
        </span>
      ),
    },
    {
      key: 'user',
      header: 'ผู้ใช้',
      render: (r) => (
        <span className="flex items-center gap-1 font-semibold text-slate-600">
          <User className="h-3 w-3 text-slate-400" />
          {r.user}
        </span>
      ),
    },
    {
      key: 'user_role',
      header: 'สิทธิ์การใช้งาน',
      render: (r) => (
        <span className="flex items-center gap-1 font-semibold text-slate-600">
          <Shield className="h-3 w-3 text-slate-400" />
          {r.user_role}
        </span>
      ),
    },
    {
      key: 'event',
      header: 'การดำเนินการ',
      render: (r: Data.ReportAuditLog) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">{r.event}</span>
      ),
    },
    {
      key: 'module',
      header: '	โมดูล',
      render: (r: Data.ReportAuditLog) => <span className="text-slate-600">{r.module}</span>,
    },
    {
      key: 'IP',
      header: 'IP',
      render: (r: Data.AuditLogs) => <span className="text-slate-600">{r.ip}</span>,
    },

    // createViewColumn<any>(handleView),
  ]

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="รายงาน Audit Log"
            description="บันทึกการใช้งานระบบและการเปลี่ยนแปลงต่างๆ"
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
