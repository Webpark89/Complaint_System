import {
  PageHeader,
  ActionToolbar,
  useCRUD,
  // SearchInput,
  // FilterTabs,
  type Column,
  // StatusBadge,
} from '~/components/admin/crud'
// import { TABLE_LABELS } from '~/components/admin/constants/table_labels'
import { Card, CardContent } from '~/components/ui/card'
// import { Button } from '~/components/ui/button'
import { Clock, Shield, User } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { DataTable } from '~/components/admin/crud/components/data_table'
import { router } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { type Data } from '~/generated/data'
import { DateRangePicker } from '~/components/admin/ui/form/date_range_picker'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { formatLocalDate } from '~/lib/format_local_date'
// import { ComplaintStatusVariant, FILTER_ACTIVE_STATUS } from '~/components/admin/crud/utils/enum'

interface PaginatedAuditLogs {
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
  model: Data.AuditLogs[]
}

interface Props {
  filters: {
    search?: string
    status?: string
    from: string
    to: string
    page: number
    user?: string
    user_role?: string
    event?: string
    module?: string
    ip?: string
  }
  data?: PaginatedAuditLogs
  filterOptions?: {
    events: { value: string; label: string }[]
    modules: { value: string; label: string }[]
    roles: string[]
  }
}

function normalizeAuditValues(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>
      }
    } catch {
      // Keep non-JSON strings as a single display value.
    }
    return { value }
  }

  return value === null || value === undefined ? {} : { value }
}

function renderAuditValue(value: unknown): ReactNode {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return renderAuditValue(parsed)
    } catch {
      return value
    }
  }

  if (Array.isArray(value)) {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {value.map((item, index) => (
          <li key={index}>{renderAuditValue(item)}</li>
        ))}
      </ul>
    )
  }

  if (value && typeof value === 'object') {
    return <pre className="whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
  }

  return String(value)
}

export default function ReportAuditLogIndex({ filters, data, filterOptions }: Props) {
  const [filterSearch, setFilterSearch] = useState(filters.search || '')
  const [filterStatus, setFilterStatus] = useState(filters.status || '')
  const [filterFrom, setFilterFrom] = useState(filters.from || '')
  const [filterTo, setFilterTo] = useState(filters.to || '')
  const [columnFilters, setColumnFilters] = useState({
    user: filters.user || '',
    user_role: filters.user_role || '',
    event: filters.event || '',
    module: filters.module || '',
    ip: filters.ip || '',
  })
  // const [dateRange, setDateRange] = useState(filters.from{
  //   from: DateRangePickerDefaultFrom(),
  //   to: DateRangePickerDefaultTo(),
  // })
  const [page, setPage] = useState(data?.meta?.currentPage || 1)
  const isInitialRender = useRef(true)
  const [selectedAuditLog, setSelectedAuditLog] = useState<Data.AuditLogs | null>(null)

  const reloadDataTable = (
    search: string,
    status: string,
    from: string,
    to: string,
    newPage: number,
    nextFilters = columnFilters
  ) => {
    router.reload({
      data: { search, status, from, to, page: newPage, ...nextFilters },
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
  }, [filterSearch, filterStatus, filterFrom, filterTo, columnFilters])

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page) {
      return
    }

    setPage(nextPage)
    reloadDataTable(filterSearch, filterStatus, filterFrom, filterTo, nextPage)
  }

  const handleDateRangeChange = (val: any) => {
    setFilterFrom(formatLocalDate(val.from))
    setFilterTo(formatLocalDate(val.to))
  }

  const handleExport = () => {
    window.location.href = `/process/audit_logs/export?from=${filterFrom ?? ''}&to=${filterTo ?? ''}&status=${filterStatus}`
  }

  const setColumnFilter = (key: keyof typeof columnFilters, value: string) => {
    const next = { ...columnFilters, [key]: value }
    setColumnFilters(next)
    reloadDataTable(filterSearch, filterStatus, filterFrom, filterTo, 1, next)
  }

  const columnInput = (key: keyof typeof columnFilters, placeholder: string) => (
    <Input
      value={columnFilters[key]}
      onChange={(e) => setColumnFilter(key, e.target.value)}
      placeholder={placeholder}
      className="h-9 w-50 text-xs"
    />
  )

  const columnSelect = (key: keyof typeof columnFilters, field: string, options: string[]) => (
    <Select
      value={columnFilters[key] || '__all__'}
      onValueChange={(value) => setColumnFilter(key, value === '__all__' ? '' : value)}
    >
      <SelectTrigger className="h-9 w-50 text-xs">
        <SelectValue placeholder={`เลือก${field}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">เลือก{field}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  const eventTitles: Record<string, string> = {
    created: 'เพิ่ม',
    updated: 'แก้ไข',
    deleted: 'ลบ',
    login: 'เข้าสู่ระบบ',
    logout: 'ออกจากระบบ',
    permissions: 'แก้ไข',
  }
  const moduleTitles: Record<string, string> = {
    User: 'ผู้ใช้งาน',
    UserRole: 'สิทธิ์ใช้งาน',
    UserGroup: 'กลุ่มผู้ใช้งาน',
    Organization: 'หน่วยงานและโครงสร้างองค์กร',
    Complaint: 'เรื่องร้องเรียน',
    ComplaintTracking: 'ติดตามเรื่องร้องเรียน',
    Form: 'แบบฟอร์มร้องเรียน',
  }
  const roleOptions = filterOptions?.roles ?? []

  // console.log(dateRange)
  const [state, actions] = useCRUD<any>([])

  const columns: Column<any>[] = [
    {
      key: 'created_at',
      header: 'วันที่รับแจ้ง',
      render: (r: Data.AuditLogs) => (
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
      render: (r: Data.AuditLogs) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">{r.event}</span>
      ),
    },
    {
      key: 'module',
      header: 'โมดูล',
      render: (r: Data.AuditLogs) => <span className="text-slate-600">{r.module}</span>,
    },
    {
      key: 'IP',
      header: 'IP',
      render: (r: Data.AuditLogs) => <span className="text-slate-600">{r.ip}</span>,
    },
    {
      key: 'details',
      header: 'รายละเอียด',
      render: (r: Data.AuditLogs) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedAuditLog(r)}>
          ดูรายละเอียด
        </Button>
      ),
    },

    // createViewColumn<any>(handleView),
  ]

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="Audit Log"
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
                {columnInput('user', 'ค้นหาผู้ใช้')}
                {columnSelect('user_role', 'สิทธิ์การใช้งาน', roleOptions)}
                {columnSelect(
                  'event',
                  'การดำเนินการ',
                  (filterOptions?.events ?? []).map((option) => option.label)
                )}
                {columnSelect(
                  'module',
                  'โมดูล',
                  (filterOptions?.modules ?? []).map((option) => option.label)
                )}
                {columnInput('ip', 'ค้นหา IP')}
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

          <Sheet
            open={selectedAuditLog !== null}
            onOpenChange={(open) => !open && setSelectedAuditLog(null)}
          >
            <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-5xl">
              {/* <SheetHeader>
                <SheetTitle>รายละเอียดการเปลี่ยนแปลง</SheetTitle>
                <SheetDescription>เปรียบเทียบข้อมูลเก่าและข้อมูลใหม่ของ Audit Log</SheetDescription>
              </SheetHeader> */}

              {selectedAuditLog && (
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {(['old_values', 'new_values'] as const).map((type) => {
                    const values = normalizeAuditValues(selectedAuditLog[type])
                    const title = type === 'old_values' ? 'ข้อมูลเก่า' : 'ข้อมูลใหม่'

                    return (
                      <section
                        key={type}
                        className={`min-w-0 p-4 ${type === 'old_values' ? 'border-r-2' : ''}`}
                      >
                        <h3 className="mb-4 text-lg font-bold text-slate-800">{title}</h3>
                        <div className="space-y-3 text-sm text-slate-700">
                          {Object.entries(values).length > 0 ? (
                            Object.entries(values).map(([key, value]) => (
                              <div key={`${selectedAuditLog.id}-${type}-${key}`}>
                                <span className="font-semibold text-slate-900">{key}: </span>
                                <span className="wrap-anywhere whitespace-pre-wrap">
                                  {renderAuditValue(value)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-slate-400">ไม่มีข้อมูล</span>
                          )}
                        </div>
                      </section>
                    )
                  })}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </AdminLayout>
    </>
  )
}
