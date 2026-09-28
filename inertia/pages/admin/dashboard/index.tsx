import {
  TriangleAlert,
  ClipboardList,
  FileSearchIcon,
  RefreshCcw,
  ClipboardCheck,
  Hourglass,
  FilePlusIcon,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'

import {
  format,
  subMonths,
  subWeeks,
  subDays,
  differenceInMonths,
  startOfDay,
  endOfDay,
  isSameDay,
} from 'date-fns'
import { th } from 'date-fns/locale'
import { type DateRange } from 'react-day-picker'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Calendar } from '~/components/ui/calendar'
import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { Link } from '@adonisjs/inertia/react'
import { useForm } from '@inertiajs/react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const EARTH_COLORS = [
  '#EF4444', // แดง (Bright Red)
  '#3B82F6', // น้ำเงิน (Digital Blue)
  '#10B981', // เขียว (Vibrant Emerald)
  '#F97316', // ส้ม (Energetic Orange)
  '#8B5CF6', // ม่วง (Vibrant Violet)
  '#FACC15', // เหลือง (Golden Yellow)
  '#A16207', // น้ำตาล (Warm Brown)
  '#14B8A6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F43F5E',
  '#0EA5E9',
  '#D946EF',
  '#64748B',
]

type DashboardGroup = {
  label: string
  value: number
}

type DashboardModel = {
  count_total?: number
  count_reject?: number
  count_sla_overdue?: number
  count_sla_due_soon?: number
  count_new?: number
  count_screened?: number
  count_in_progress?: number
  count_investigating?: number
  count_close?: number
  group_months?: DashboardGroup[]
  group_categories?: DashboardGroup[]
  group_organizations?: DashboardGroup[]
  group_status?: DashboardGroup[]
  group_sla?: DashboardGroup[]
  [key: string]: any
}

type DashboardProps = {
  model?: DashboardModel
}

export default function Dashboard({ model }: DashboardProps) {
  const today = new Date()
  const minAllowedDate = startOfDay(subMonths(today, 6))
  const defaultFrom = startOfDay(subMonths(today, 3))
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: endOfDay(today),
  })
  const [selectedKpi, setSelectedKpi] = useState<(typeof kpis)[number] | null>(null)

  const { setData, post } = useForm({
    from: '',
    to: '',
  })

  const nowThaiText = useMemo(() => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date())
  }, [])

  useEffect(() => {
    if (dateRange?.from) {
      const fromStr = format(dateRange.from, 'yyyy-MM-dd')
      const toStr = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : fromStr

      setData('from', fromStr)
      setData('to', toStr)
      post('/process/dashboard')
    }
  }, [dateRange, post, setData])

  const handleDateSelect = (range: DateRange | undefined) => {
    if (!range || !range.from) {
      setDateRange({
        from: startOfDay(new Date()),
        to: endOfDay(new Date()),
      })
      return
    }

    if (range.from && range.to) {
      if (differenceInMonths(range.to, range.from) > 6) {
        toast.warning('ไม่สามารถเลือกช่วงวันที่เกิน 6 เดือนได้')
        return
      }
    }
    setDateRange(range)
  }

  const handlePresetClick = (amount: number, unit: 'days' | 'weeks' | 'months') => {
    const toDate = endOfDay(today)
    let fromDate = today

    if (unit === 'days') {
      fromDate = startOfDay(subDays(today, amount))
    } else if (unit === 'weeks') {
      fromDate = startOfDay(subWeeks(today, amount))
    } else if (unit === 'months') {
      fromDate = startOfDay(subMonths(today, amount))
    }

    setDateRange({ from: fromDate, to: toDate })
  }

  const kpis = [
    {
      label: 'เรื่องร้องเรียนทั้งหมด',
      value: model?.count_total ?? 0,
      icon: ClipboardList,
      iconColor: 'bg-blue-100 text-blue-600',
      link: '/process/complaint',
      countKey: 'total',
    },
    {
      label: 'ไม่รับเรื่อง',
      value: model?.count_reject ?? 0,
      icon: X,
      iconColor: 'bg-gray-100 text-gray-600',
      link: '/process/complaint?status[]=96',
      countKey: 'reject',
    },
    {
      label: 'เกิน SLA',
      value: model?.count_sla_overdue ?? 0,
      icon: TriangleAlert,
      iconColor: 'bg-red-100 text-red-600',
      link: '/process/complaint?sla=overdue',
      countKey: 'sla_overdue',
    },
    {
      label: 'ใกล้ครบ SLA',
      value: model?.count_sla_due_soon ?? 0,
      icon: Hourglass,
      iconColor: 'bg-orange-100 text-orange-600',
      link: '/process/complaint?sla=due_soon',
      countKey: 'sla_due_soon',
    },
    {
      label: 'เรื่องร้องเรียนใหม่',
      value: model?.count_new ?? 0,
      icon: FilePlusIcon,
      iconColor: 'bg-cyan-100 text-cyan-600',
      link: '/process/complaint?status[]=0',
      countKey: 'new',
    },
    {
      label: 'รับเรื่อง',
      value: model?.count_screened ?? 0,
      icon: RefreshCcw,
      iconColor: 'bg-indigo-100 text-indigo-600',
      link: '/process/complaint?status[]=5',
      countKey: 'screened',
    },
    {
      label: 'ดำเนินการ/ตรวจสอบ',
      value: (model?.count_in_progress ?? 0) + (model?.count_investigating ?? 0),
      icon: FileSearchIcon,
      iconColor: 'bg-purple-100 text-purple-600',
      link: '/process/complaint?status[]=10&status[]=20',
      countKey: 'in_progress',
    },
    {
      label: 'ปิดเรื่องแล้ว',
      value: model?.count_close ?? 0,
      icon: ClipboardCheck,
      iconColor: 'bg-green-100 text-green-600',
      link: '/process/complaint?status[]=91',
      countKey: 'close',
    },
  ]

  const getSensitiveCount = (kpi: (typeof kpis)[number]) => {
    const key = kpi.countKey
    return key ? Number(model?.[`count_${key}_sensitive`] ?? 0) : 0
  }
  const getInsensitiveCount = (kpi: (typeof kpis)[number]) => {
    const key = kpi.countKey
    return key ? Number(model?.[`count_${key}_insensitive`] ?? 0) : kpi.value
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="space-y-6 pb-10">
          {/* Header */}
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#111827]">แดชบอร์ด</h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                ภาพรวมระบบบริหารเรื่องร้องเรียน — ข้อมูล ณ วันที่ {nowThaiText}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 border-border bg-white text-[#111827] justify-start w-full sm:w-56"
                  >
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold">
                      {dateRange?.from
                        ? dateRange.to && !isSameDay(dateRange.from, dateRange.to)
                          ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
                          : format(dateRange.from, 'dd/MM/yyyy', { locale: th })
                        : 'เลือกวันที่'}
                    </span>
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto p-0 flex flex-col sm:flex-row items-stretch"
                  align="end"
                >
                  {/* แถบด้านซ้าย: ปุ่ม Quick Select */}
                  <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-border p-3 w-full sm:w-40 bg-slate-50">
                    <div className="mb-2 px-2 text-xs font-bold text-slate-500">
                      เลือกช่วงเวลาแบบด่วน
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs font-medium text-slate-700"
                      onClick={() => handlePresetClick(0, 'days')}
                    >
                      วันนี้
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs font-medium text-slate-700"
                      onClick={() => handlePresetClick(3, 'days')}
                    >
                      ย้อนหลัง 3 วัน
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs font-medium text-slate-700"
                      onClick={() => handlePresetClick(5, 'days')}
                    >
                      ย้อนหลัง 5 วัน
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs font-medium text-slate-700"
                      onClick={() => handlePresetClick(1, 'weeks')}
                    >
                      ย้อนหลัง 1 สัปดาห์
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs font-medium text-slate-700"
                      onClick={() => handlePresetClick(2, 'weeks')}
                    >
                      ย้อนหลัง 2 สัปดาห์
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs font-medium text-slate-700"
                      onClick={() => handlePresetClick(1, 'months')}
                    >
                      ย้อนหลัง 1 เดือน
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs font-medium text-slate-700"
                      onClick={() => handlePresetClick(3, 'months')}
                    >
                      ย้อนหลัง 3 เดือน
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs font-medium text-slate-700"
                      onClick={() => handlePresetClick(6, 'months')}
                    >
                      ย้อนหลัง 6 เดือน
                    </Button>
                  </div>

                  <div className="p-2">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                      disabled={(date) => date > today || date < minAllowedDate}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon
              const card = (
                <Card
                  key={kpi.label}
                  onClick={() => setSelectedKpi(kpi)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => event.key === 'Enter' && setSelectedKpi(kpi)}
                  className="h-full border-border bg-white shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-elegant"
                >
                  <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-semibold text-slate-600">
                        {kpi.label}
                      </CardTitle>
                      <div className="text-3xl font-bold tracking-tight text-[#111827]">
                        {kpi.value}
                      </div>
                    </div>
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.iconColor}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  </CardHeader>
                </Card>
              )

              return (
                <div key={kpi.label} className="h-full">
                  {card}
                </div>
              )
            })}
          </div>

          <Dialog
            open={selectedKpi !== null}
            onOpenChange={(open) => !open && setSelectedKpi(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedKpi?.label}</DialogTitle>
              </DialogHeader>
              {selectedKpi && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href={selectedKpi.link ?? '/process/complaint'}
                    className="rounded-xl border p-4 hover:bg-slate-50"
                  >
                    <div className="text-sm text-slate-500">เรื่องร้องเรียนทั่วไป</div>
                    <div className="mt-1 text-2xl font-bold">
                      {getInsensitiveCount(selectedKpi)}
                    </div>
                  </Link>
                  {model?.can_view_sensitive && (
                    <Link
                      href={(selectedKpi.link ?? '/process/complaint').replace(
                        '/process/complaint',
                        '/process/complaint_sensitive'
                      )}
                      className="rounded-xl border p-4 hover:bg-slate-50"
                    >
                      <div className="text-sm text-slate-500">เรื่องร้องเรียนข้อมูลอ่อนไหว</div>
                      <div className="mt-1 text-2xl font-bold">
                        {getSensitiveCount(selectedKpi)}
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border bg-white shadow-soft">
              <CardHeader>
                <CardTitle className="text-base text-[#111827]">
                  จำนวนเรื่องร้องเรียนรายเดือน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-70 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={model?.group_months}
                      margin={{ top: 28, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D29E0E" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#D29E0E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748B' }}
                        dy={10}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748B' }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} เรื่อง`, 'จำนวน']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#D29E0E"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        activeDot={{
                          r: 6,
                          fill: '#D29E0E',
                          stroke: '#fff',
                          strokeWidth: 2,
                        }}
                      >
                        <LabelList
                          dataKey="value"
                          position="top"
                          fill="#475569"
                          fontSize={12}
                          fontWeight={600}
                        />
                      </Area>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-white shadow-soft">
              <CardHeader>
                <CardTitle className="text-base text-[#111827]">
                  จำนวนเรื่องร้องเรียนแยกตามประเภท
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-70 w-full items-center justify-center">
                  {model && (model.group_categories?.length ?? 0) > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={model.group_categories}
                          cx="40%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={105}
                          dataKey="value"
                          nameKey="label"
                          stroke="none"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {model.group_categories?.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={EARTH_COLORS[index % EARTH_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} เรื่อง`, 'จำนวน']}
                          contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '12px',
                          }}
                        />
                        <Legend
                          formatter={(label, value: any) => [
                            `${label} ${JSON.stringify(value?.payload?.value ?? 0)} เรื่อง`,
                          ]}
                          layout="horizontal"
                          position="bottom"
                          align="left"
                          // verticalAlign="middle"
                          // align="right"
                          iconType="circle"
                          iconSize={10}
                          wrapperStyle={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#475569',
                            paddingLeft: '10px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-sm font-semibold text-slate-400">
                      ไม่มีข้อมูลในช่วงเวลานี้
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-border bg-white shadow-soft">
              <CardHeader>
                <CardTitle className="text-base text-[#111827]">แยกตามหน่วยงาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-55 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={model?.group_organizations}
                      margin={{ top: 24, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        dy={10}
                        interval={0}
                        // tickFormatter={(val) => val.substring(0, 10) + '...'}
                        // angle={300}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#64748B' }}
                      />
                      <Tooltip
                        cursor={{ fill: 'transparent' }}
                        formatter={(value) => [`${value} เรื่อง`, 'จำนวน']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="value" fill="#9A8038" radius={[6, 6, 0, 0]} barSize={25}>
                        <LabelList
                          dataKey="value"
                          position="top"
                          fill="#475569"
                          fontSize={12}
                          fontWeight={600}
                        />
                        {model?.group_organizations?.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={EARTH_COLORS[index % EARTH_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-white shadow-soft">
              <CardHeader>
                <CardTitle className="text-base text-[#111827]">สถานะเรื่องร้องเรียน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-55 flex-col justify-center space-y-5 px-2">
                  {model?.group_status?.map((s: any, index: number) => {
                    const pct = (s.value / (model?.count_total ?? 0)) * 100
                    const color = EARTH_COLORS[(index + 2) % EARTH_COLORS.length]
                    return (
                      <div key={s.label} className="flex items-center gap-3">
                        <div className="w-24 truncate text-xs font-semibold text-slate-600">
                          {s.label}
                        </div>
                        <div className="relative flex flex-1 items-center">
                          <div className="absolute h-0.75 w-full rounded-full bg-slate-100" />
                          <div
                            className="absolute h-0.75 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                          />
                          <div
                            className="absolute h-3 w-3 rounded-full shadow-sm transition-all duration-500"
                            style={{
                              left: `calc(${pct}% - 6px)`,
                              backgroundColor: color,
                              border: '2.5px solid white',
                            }}
                          />
                        </div>
                        <div className="w-8 text-right text-xs font-bold text-[#111827]">
                          {s.value}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-white shadow-soft">
              <CardHeader>
                <CardTitle className="text-base text-[#111827]">SLA Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-55 w-full items-center justify-around gap-2 pt-2">
                  {model?.group_sla?.map((s: any, i: number) => {
                    const color = ['#10B981', '#F59E0B', '#EF4444'][i]
                    return (
                      <div key={s.label} className="flex flex-col items-center justify-center">
                        <div className="relative h-21.25 w-21.25">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[{ value: s.value }, { value: 100 - s.value }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={40}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                              >
                                <Cell fill={color} />
                                <Cell fill="#F1F5F9" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm font-bold text-slate-700">{s.value}%</span>
                          </div>
                        </div>
                        <span className="mt-3 text-xs font-semibold text-slate-500">{s.label}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
