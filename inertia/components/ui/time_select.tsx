import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

import { cn } from '~/lib/utils'

type TimeSelectProps = {
  name: string
  value?: string | null
  onChange: (value: string | null) => void
  error?: boolean
  disabled?: boolean
  className?: string
}

const hours = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0'))

function splitTime(value?: string | null) {
  const [hour = '', minute = ''] = value?.match(/^(\d{2}):(\d{2})$/)?.slice(1) ?? []
  return { hour, minute }
}

export function TimeSelect({
  name,
  value,
  onChange,
  error = false,
  disabled = false,
  className,
}: TimeSelectProps) {
  const [time, setTime] = useState(() => splitTime(value))

  useEffect(() => {
    setTime(splitTime(value))
  }, [value])

  function updateTime(part: 'hour' | 'minute', nextValue: string) {
    const nextTime = { ...time, [part]: nextValue }
    setTime(nextTime)
    onChange(nextTime.hour && nextTime.minute ? `${nextTime.hour}:${nextTime.minute}` : null)
  }

  const selectClassName = cn(
    'h-full min-w-0 flex-1 appearance-none bg-transparent px-3 text-sm outline-none',
    'text-[#002856] hover:bg-[#F9FAFB] focus-visible:bg-[#F9FAFB]',
    'disabled:cursor-not-allowed disabled:text-[#898F98]'
  )

  return (
    <div
      className={cn(
        'flex h-13 w-full items-center rounded-lg border bg-white text-[#002856] transition-all',
        'border-[#D6D7D9] hover:border-[#D29E0E] focus-within:border-[#002856] focus-within:ring-1 focus-within:ring-[#002856]',
        'disabled:cursor-not-allowed disabled:border-[#D6D7D9] disabled:bg-[#F9FAFB]',
        error &&
          'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-within:border-[#FF4D00] focus-within:ring-[#FF4D00]',
        className
      )}
    >
      <label className="sr-only" htmlFor={`${name}Hour`}>
        ชั่วโมง
      </label>
      <select
        id={`${name}Hour`}
        name={`${name}Hour`}
        value={time.hour}
        onChange={(event) => updateTime('hour', event.target.value)}
        disabled={disabled}
        className={cn(selectClassName, 'text-right')}
        aria-invalid={error || undefined}
      >
        <option value="">ชั่วโมง</option>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      <span className="text-sm font-semibold" aria-hidden="true">
        :
      </span>
      <label className="sr-only" htmlFor={`${name}Minute`}>
        นาที
      </label>
      <select
        id={`${name}Minute`}
        name={`${name}Minute`}
        value={time.minute}
        onChange={(event) => updateTime('minute', event.target.value)}
        disabled={disabled}
        className={selectClassName}
        aria-invalid={error || undefined}
      >
        <option value="">นาที</option>
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>
      <Clock className="mr-3 h-4 w-4 shrink-0 text-current" aria-hidden="true" />
    </div>
  )
}
