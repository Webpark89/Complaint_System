import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DateTime } from 'luxon'
import { ComplaintStatus } from '~/../app/contracts/enum'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTimeSecond(val: string): string {
  if (!val) return ''
  return DateTime.fromISO(val).toFormat('dd/MM/yyyy HH:mm:ss')
}

export function formatDateTime(val: string): string {
  if (!val) return ''
  return DateTime.fromISO(val).toFormat('dd/MM/yyyy HH:mm')
}

export function formatDate(val: string): string {
  if (!val) return ''
  return DateTime.fromISO(val).toFormat('dd/MM/yyyy')
}

export function formatTime(val: string): string {
  if (!val) return ''
  return DateTime.fromISO(val).toFormat('HH:mm')
}

export function ComplaintStatusStyles(s: ComplaintStatus): any {
  if (s === ComplaintStatus.NEW)
    return ['bg-[#484D57]', 'text-muted-foreground', 'border-muted-foreground/30', 'bg-card']
  if (s === ComplaintStatus.SCREENED)
    return ['bg-[#484D57]', 'text-muted-foreground', 'border-muted-foreground/30', 'bg-card']
  if (s === ComplaintStatus.IN_PROGRESS)
    return ['bg-[#F9C80E]', 'text-amber-900', 'border-amber-500', 'bg-amber-500']
  if (s === ComplaintStatus.INVESTIGATING)
    return ['bg-[#484D57]', 'text-blue-900', 'border-blue-500', 'bg-blue-500']
  if (s === ComplaintStatus.COMPLETED)
    return ['bg-[#09A129]', 'text-[#00B14F]', 'border-[#00B14F]', 'bg-[#00B14F]']
  if (s === ComplaintStatus.REJECTED)
    return ['bg-[#FF4D00]', 'text-red-500', 'border-red-500', 'bg-red-500']
  // return 'neutral'
}
