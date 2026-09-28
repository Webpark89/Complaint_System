import { ActiveStatus, ApproveStatus, ComplaintStatus } from '~/../app/contracts/enum'
import { type StatusVariant } from '~/components/admin/crud'

export function ActiveStatusVariant(s: ActiveStatus): StatusVariant {
  return s === ActiveStatus.ACTIVE ? 'success' : 'danger'
}

export function ComplaintStatusVariant(s: ComplaintStatus): StatusVariant {
  if (s === ComplaintStatus.NEW) return 'gold'
  if (s === ComplaintStatus.SCREENED) return 'gold'
  if (s === ComplaintStatus.IN_PROGRESS) return 'warning'
  if (s === ComplaintStatus.INVESTIGATING) return 'neutral'
  if (s === ComplaintStatus.COMPLETED) return 'success'
  if (s === ComplaintStatus.REJECTED) return 'neutral'
  return 'neutral'
}

export function ComplaintApproveStatusVariant(s: ApproveStatus): StatusVariant {
  if (s === ApproveStatus.APPROVED) return 'success'
  if (s === ApproveStatus.REJECTED) return 'warning'
  if (s === ApproveStatus.PENDING) return 'neutral'
  return 'neutral'
}

export function SensitiveStatusVariant(s: boolean): StatusVariant {
  return s === true ? 'success' : 'danger'
}

export const FILTER_ACTIVE_STATUS = [
  { value: '', label: 'ทั้งหมด' },
  { value: '2', label: 'เปิดใช้งาน' },
  { value: '1', label: 'ไม่เปิดใช้งาน' },
]

export const OPTIONS_ACTIVE_STATUS = [
  { value: '2', label: 'เปิดใช้งาน' },
  { value: '1', label: 'ไม่เปิดใช้งาน' },
]

export const OPTIONS_COMPLAINT_QUESTION_TYPE = [
  { value: 'string', label: 'ข้อความ (250 ตัวอักษร)' },
  { value: 'text', label: 'กล่องข้อความ (3000 ตัวอักษร)' },
  { value: 'date', label: 'วันที่ (ไม่มีเวลา)' },
  { value: 'datetime', label: 'วันที่และเวลา' },
]

export const OPTIONS_COMPLAINT_STATUS = [
  { value: '', label: 'ทั้งหมด' },
  { label: 'ใหม่', value: '0' },
  { label: 'รับเรื่อง', value: '5' },
  { label: 'กำลังดำเนินการ', value: '10' },
  { label: 'รอตรวจสอบ', value: '20' },
  { label: 'ปิดเรื่อง', value: '91' },
  { label: 'ไม่รับเรื่อง', value: '96' },
]

export const OPTIONS_COMPLAINT_APPROVE_STATUS = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'รออนุมัติ', value: '0' },
  { label: 'ไม่อนุมัติ', value: '1' },
  { label: 'อนุมัติ', value: '2' },
]

export const OPTIONS_COMPLAINT_TRACKING_STATUS = [
  { label: 'รับแจ้งเรื่อง', value: '0' },
  { label: 'ตรวจสอบเบื้องต้นแล้ว', value: '2' },
  { label: 'รอหมอบหมายผู้รับผิดชอบ', value: '3' },
  { label: 'อยู่ระหว่างดำเนินการ', value: '11' },
  { label: 'อยู่ระหว่างสอบสวน', value: '21' },
  { label: 'รอสรุปผลสอบสวน', value: '22' },
  { label: 'รออนุมัติผล', value: '23' },
  { label: 'อนุมัติแล้ว', value: '23' },
  { label: 'ส่งกลับให้ทบทวน', value: '28' },
  { label: 'ปิดเรื่อง', value: '91' },
  { label: 'เปิดเรื่องใหม่ (Reopen)', value: '29' },
  { label: 'ไม่รับเรื่อง', value: '96' },
]
