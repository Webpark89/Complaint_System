import type { StatusVariant } from '../Components/modals'

/**
 * Centralized status-to-variant mapper.
 * All pages must consume this utility instead of defining local statusVariant functions.
 * StatusVariant values: "success" | "warning" | "danger" | "neutral" | "gold"
 */

// ===== Complaint Status =====
export function getComplaintStatusVariant(status: string): StatusVariant {
  if (status === 'ใหม่') return 'gold'
  if (status === 'กำลังดำเนินการ') return 'warning'
  if (status === 'รอตรวจสอบ') return 'neutral'
  if (status === 'ปิดเรื่อง') return 'success'
  return 'neutral'
}

// ===== Complaint Priority =====
export function getComplaintPriorityVariant(priority: string): StatusVariant {
  if (priority === 'ด่วนมาก') return 'danger'
  if (priority === 'ด่วน') return 'warning'
  if (priority === 'ปกติ' || priority === 'ไม่ด่วน') return 'neutral'
  return 'neutral'
}

// ===== Intake Status =====
export function getIntakeStatusVariant(status: string): StatusVariant {
  if (status === 'รับเรื่องแล้ว') return 'success'
  if (status === 'กำลังคัดกรอง') return 'gold'
  if (status === 'รอรับเรื่อง' || status === 'ขอข้อมูลเพิ่ม') return 'warning'
  if (status === 'ส่งกลับ' || status === 'ปฏิเสธ') return 'danger'
  return 'neutral'
}

// ===== Assignment Status =====
export function getAssignmentStatusVariant(status: string): StatusVariant {
  if (status === 'มอบหมายแล้ว') return 'success'
  if (status === 'รอมอบหมาย') return 'warning'
  return 'neutral'
}

// ===== Approval Status =====
export function getApprovalStatusVariant(status: string): StatusVariant {
  if (status === 'อนุมัติแล้ว') return 'success'
  if (status === 'รออนุมัติ') return 'warning'
  if (status === 'ปฏิเสธ') return 'danger'
  return 'neutral'
}

// ===== Investigation Status =====
export function getInvestigationStatusVariant(status: string): StatusVariant {
  if (status === 'เสร็จสิ้น') return 'success'
  if (status === 'กำลังสืบสวน') return 'warning'
  if (status === 'รอข้อมูลจาก IT' || status === 'เรียกดูเอกสาร' || status === 'เก็บหลักฐาน')
    return 'gold'
  if (status === 'ระงับเรื่อง') return 'neutral'
  if (status === 'รอดำเนินการ') return 'warning'
  return 'neutral'
}

// ===== Document Status =====
export function getDocumentStatusVariant(status: string): StatusVariant {
  if (status === 'ตรวจแล้ว') return 'success'
  if (status === 'รอตรวจสอบ') return 'warning'
  if (status === 'ขาดหาย') return 'danger'
  if (status === 'ไม่เกี่ยวข้อง') return 'neutral'
  return 'neutral'
}

// ===== Sensitive Case Status =====
export function getSensitiveStatusVariant(status: string): StatusVariant {
  if (status === 'ปิดแล้ว' || status === 'ยุติ') return 'neutral'
  if (status === 'ติดตามพิเศษ') return 'warning'
  if (status === 'เปิด') return 'danger'
  if (status === 'กำลังสืบสวน') return 'warning'
  if (status === 'รอประเมิน') return 'gold'
  return 'neutral'
}

// ===== Audit Log Status =====
export function getAuditLogStatusVariant(status: string): StatusVariant {
  if (status === 'สำเร็จ') return 'success'
  if (status === 'ล้มเหลว') return 'danger'
  if (status === 'กำลังดำเนินการ') return 'warning'
  if (status === 'ระงับ') return 'neutral'
  return 'neutral'
}

// ===== Report Status (general) =====
export function getReportStatusVariant(status: string): StatusVariant {
  if (status === 'พร้อมดาวน์โหลด') return 'success'
  if (status === 'กำลังสร้าง' || status === 'กำลังเพิ่ม' || status === 'กำลังดำเนินการ')
    return 'warning'
  if (status === 'รอดำเนินการ') return 'gold'
  return 'neutral'
}

// ===== Audit Report Status =====
export function getAuditReportStatusVariant(status: string): StatusVariant {
  if (status === 'เสร็จสิ้น' || status === 'ปิดเรื่องแล้ว' || status === 'พร้อมดาวน์โหลด')
    return 'success'
  if (status === 'กำลังดำเนินการ' || status === 'กำลังตรวจสอบ') return 'warning'
  if (status === 'รอดำเนินการแก้ไข') return 'gold'
  if (status === 'รอดำเนินการ') return 'warning'
  return 'neutral'
}

// ===== Executive Report Status =====
export function getExecutiveReportStatusVariant(status: string): StatusVariant {
  if (status === 'พร้อมดาวน์โหลด') return 'success'
  if (status === 'กำลังจัดทำ') return 'warning'
  if (status === 'รออนุมัติ') return 'gold'
  return 'neutral'
}

// ===== SLA Report Status =====
export function getSLAReportStatusVariant(status: string): StatusVariant {
  if (status === 'ผ่าน SLA') return 'success'
  if (status === 'ใกล้เกิน SLA') return 'warning'
  if (status === 'เกิน SLA') return 'danger'
  return 'neutral'
}

// ===== Investigation Report Status =====
export function getInvestigationReportStatusVariant(status: string): StatusVariant {
  if (status === 'ดำเนินการเสร็จสิ้น') return 'success'
  if (status === 'กำลังสืบสวน') return 'warning'
  if (status === 'รอดำเนินการ') return 'gold'
  if (status === 'ระงับเรื่อง') return 'neutral'
  return 'neutral'
}

// ===== Form Status =====
export function getFormStatusVariant(status: string): StatusVariant {
  if (status === 'เปิดใช้งาน') return 'success'
  if (status === 'แบบร่าง') return 'warning'
  if (status === 'ปิดใช้งาน') return 'danger'
  return 'neutral'
}
