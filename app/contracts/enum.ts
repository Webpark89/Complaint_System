export enum ComplaintStatus {
  NEW = 0,
  SCREENED = 5,
  IN_PROGRESS = 10,
  INVESTIGATING = 20,
  COMPLETED = 91,
  REJECTED = 96,
}

export enum ComplaintTrackingStatus {
  NEW = 0,
  SCREENED = 2,
  WAITING_ASSIGN = 3,
  // ASSIGNED = 4,
  IN_PROGRESS = 11,
  INVESTIGATING = 21,
  WAITING_SUMMARIZE = 22,
  WAITING_APPROVAL = 23,
  APPROVED = 24,
  RETURN_FOR_REVIEW = 28,
  CLOSED = 91,
  REOPENED = 29,
  REJECTED = 96,
}

export enum ComplaintTrackingMode {
  NEW = 0,
  STATUS_UPDATE = 1,
  STATUS_ADVANCE = 2,
  STATUS_CLOSE = 3,
  STATUS_REOPEN = 4,

  REASSIGN = 51,

  EXTEND_REQUEST = 61,
  EXTEND_APPROVE = 62,
}

export enum ApproveStatus {
  PENDING = 0,
  REJECTED = 1,
  APPROVED = 2,

  NONE = 99,
}

// export enum ComplaintPriority {
//   LOW = 1,
//   MEDIUM = 2,
//   HIGH = 3,
//   CRITICAL = 4,
// }

export enum ActiveStatus {
  ACTIVE = 2,
  INACTIVE = 1,
}

export enum UserModuleMode {
  SINGLE = 'SINGLE',
  CHILD = 'CHILD',
  PARENT = 'PARENT',
}

export enum ActiveStatusTitle {
  เปิดใช้งาน = 2,
  ไม่เปิดใช้งาน = 1,
}

export enum OrganizationType {
  COMPANY = 'COMPANY',
  BRANCH = 'BRANCH',
  DEPARTMENT = 'DEPARTMENT',
}

export enum OrganizationTypeTitle {
  บริษัท = 'COMPANY',
  สาขา = 'BRANCH',
  แผนก = 'DEPARTMENT',
}

export enum ApproveStatusTitle {
  'รออนุมัติ' = 0,
  'ไม่อนุมัติ' = 1,
  'อนุมัติ' = 2,

  '' = 99,
}

export enum ComplaintStatusTitle {
  แจ้งเรื่อง = 0,
  รับแจ้งเรื่อง = 5,
  กำลังดำเนินการ = 10,
  รอตรวจสอบ = 20,
  ปิดเรื่อง = 91,
  ไม่รับเรื่อง = 96,
  // 'ใหม่' = 0,
}

export enum ComplaintTrackingStatusTitle {
  'แจ้งเรื่อง' = 0,
  'รับแจ้งเรื่อง' = 5,
  'ตรวจสอบเบื้องต้นแล้ว' = 2,
  'รอหมอบหมายผู้รับผิดชอบ' = 3,
  // 'มอบหมายผู้รับผิดชอบแล้ว' = 4,
  'อยู่ระหว่างดำเนินการ' = 11,
  'อยู่ระหว่างสอบสวน' = 21,
  'รอสรุปผลสอบสวน' = 22,
  'รออนุมัติผล' = 23,
  'อนุมัติแล้ว' = 24,
  'ส่งกลับให้ทบทวน' = 28,
  'ปิดเรื่อง' = 91,
  'เปิดเรื่องใหม่ (Reopen)' = 29,
  'ไม่รับเรื่อง' = 96,
}

export enum ComplaintTrackingModeTitle {
  แจ้งเรื่อง = 0,
  อัพเดตข้อมูล = 1,
  ส่งต่อ = 2,
  ปิดเรื่อง = 3,
  เปิดใหม่ = 4,

  มอบหมายใหม่ = 51,

  ขอขยายเวลา = 61,
  อนุมัติขยายเวลา = 62,
}

export function IsSensitiveTitle(val: boolean) {
  return val ? 'อ่อนไหว' : 'ปกติ'
}

export function IsComplexTitle(val: boolean) {
  return val ? 'ซับซ้อน' : 'ปกติ'
}

export function getEnumValue<T extends Record<string, any>>(type: T) {
  return Object.entries(type)
    .filter(([key, _value]) => Number.isNaN(Number(key)))
    .map(([_key, value]) => value)
}

export function getEnumValueAsString<T extends Record<string, any>>(type: T) {
  return Object.entries(type)
    .filter(([key, _value]) => Number.isNaN(Number(key)))
    .map(([_key, value]) => String(value))
}

export function getEnumByKey<T extends Record<string, any>>(type: T, val: any) {
  const match = Object.entries(type).find(([key, _value]) => key === val)
  if (match) return match[0]
  return ''
}

export function getEnumByValue<T extends Record<string, any>>(type: T, val: any) {
  const match = Object.entries(type).find(([_key, value]) => value === val)
  if (match) return match[0]
  return ''
}

export function getEnumKeyValue<T extends Record<string, any>>(type: T) {
  return Object.entries(type)
    .filter(([key, _value]) => Number.isNaN(Number(key)))
    .map(([key, value]) => ({
      key,
      value,
    }))
}

export function getEnumKeyValueWithCustomTitle<T extends Record<string, any>>(
  type: T,
  keyTitle: string,
  valueTitle: string
) {
  return Object.entries(type)
    .filter(([key, _value]) => Number.isNaN(Number(key)))
    .map(([key, value]) => ({
      [keyTitle]: key,
      [valueTitle]: String(value),
    }))
}

export function getEnumKeyValueString<T extends Record<string, any>>(type: T) {
  return Object.entries(type).map(([key, value]) => ({
    key,
    value,
  }))
}
