import { CalendarIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import {
  differenceInMonths,
  endOfDay,
  format,
  isSameDay,
  startOfDay,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns'
import { useEffect, useState } from 'react'
import { th } from 'date-fns/locale'
import { Calendar } from '~/components/ui/calendar'
import { type DateRange } from 'react-day-picker'
import { toast } from 'sonner'

export function DateRangePickerDefaultFrom() {
  return startOfDay(new Date())
}

export function DateRangePickerDefaultTo() {
  return endOfDay(new Date())
}

export function DateRangePicker({ onChange }: { onChange?: (e: any) => void }) {
  const today = new Date()
  const minAllowedDate = startOfDay(subMonths(today, 6))
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined, //startOfDay(today),
    to: undefined, //endOfDay(today),
  })
  const handleChange = (amount: number, unit: 'days' | 'weeks' | 'months') => {
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

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range?.from && range.to) {
      // Validate: ช่วงเวลาต้องไม่เกิน 6 เดือน
      if (differenceInMonths(range.to, range.from) > 6) {
        toast.warning('ไม่สามารถเลือกช่วงวันที่เกิน 6 เดือนได้')
        return
      }
    }
    setDateRange(range)
  }

  useEffect(() => {
    if (onChange) onChange(dateRange)
  }, [dateRange])

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          {/* ปุ่ม Trigger เดิม (ไม่ต้องแก้) */}
          <Button
            variant="outline"
            className="gap-2 border-border bg-white text-[#111827] justify-start w-full sm:w-56"
          >
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">
              {
                dateRange?.from
                  ? dateRange.to && !isSameDay(dateRange.from, dateRange.to)
                    ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
                    : format(dateRange.from, 'dd/MM/yyyy', { locale: th })
                  : 'เลือกวันที่' // ถึงแม้จะมีข้อความนี้ไว้ แต่จริงๆ จะไม่แสดงแล้วเพราะเราดักไม่ให้เป็นค่าว่างได้แล้ว
              }
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 flex flex-col sm:flex-row items-stretch" align="end">
          {/* แถบด้านซ้าย: ปุ่ม Quick Select */}
          <div className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-border p-3 w-full sm:w-40 bg-slate-50">
            <div className="mb-2 px-2 text-xs font-bold text-slate-500">เลือกช่วงเวลาแบบด่วน</div>
            {/* 🌟 3 ปุ่มที่เพิ่มเข้ามาใหม่ แปะไว้บนสุดเลยครับ */}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs font-medium text-slate-700"
              onClick={() => handleChange(0, 'days')}
            >
              วันนี้
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs font-medium text-slate-700"
              onClick={() => handleChange(3, 'days')}
            >
              ย้อนหลัง 3 วัน
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs font-medium text-slate-700"
              onClick={() => handleChange(5, 'days')}
            >
              ย้อนหลัง 5 วัน
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs font-medium text-slate-700"
              onClick={() => handleChange(1, 'weeks')}
            >
              ย้อนหลัง 1 สัปดาห์
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs font-medium text-slate-700"
              onClick={() => handleChange(2, 'weeks')}
            >
              ย้อนหลัง 2 สัปดาห์
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs font-medium text-slate-700"
              onClick={() => handleChange(1, 'months')}
            >
              ย้อนหลัง 1 เดือน
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs font-medium text-slate-700"
              onClick={() => handleChange(3, 'months')}
            >
              ย้อนหลัง 3 เดือน
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start text-xs font-medium text-slate-700"
              onClick={() => handleChange(6, 'months')}
            >
              ย้อนหลัง 6 เดือน
            </Button>
          </div>

          {/* แถบด้านขวา: ปฏิทินเดิม */}
          <div className="p-2">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              disabled={(date) => date > today || date < minAllowedDate}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 w-full text-xs"
              onClick={() => setDateRange(undefined)}
              disabled={!dateRange?.from}
            >
              ล้างวันที่
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
