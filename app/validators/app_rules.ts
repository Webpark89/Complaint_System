import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'
import { type FieldContext } from '@vinejs/vine/types'

export const isExistsOrNullRule = vine.createRule<{ table: string; column: string }>(
  async (value, options, field) => {
    if (value === null) return

    const row = await db
      .from(options.table)
      .where(options.column, value as string | number)
      .first()

    if (!row) {
      field.report('ข้อมูลที่ระบุไม่ถูกต้องหรือไม่มีอยู่ในระบบ', 'is_exists_or_null_rule', field)
    }
  }
)

export const requiredIfAsyncRule = vine.createRule<{
  table: string
  column: string
  columnValue: any
  searchColumn: any
  searchColumnFieldName: string
}>(
  async (value, options, field: FieldContext) => {
    const row = await db
      .from(options.table)
      .where(options.searchColumn, field.parent[options.searchColumnFieldName] ?? null)
      .select(options.column)
      .first()
    if (
      row &&
      row[options.column] === options.columnValue &&
      (!value || String(value).length === 0)
    ) {
      field.report('กรุณาใส่ข้อมูล', 'required_if_rule', field)
    }
  },
  { implicit: true } // Runs even if the field is undefined
)

export const requiredIfMissingRule = vine.createRule<{ fieldName?: string }>(
  (value, options, field: FieldContext) => {
    const parentFieldName = options.fieldName ?? 'isAnonymous'

    if (field.parent?.[parentFieldName] === true) {
      return
    }

    const normalizedValue = typeof value === 'string' ? value.trim() : value

    if (normalizedValue === undefined || normalizedValue === null || normalizedValue === '') {
      field.report('กรุณาใส่ข้อมูล', 'required', field)
    }
  },
  { implicit: true }
)

export const emailIfMissingRule = vine.createRule<{ fieldName?: string }>(
  (value, options, field: FieldContext) => {
    const parentFieldName = options.fieldName ?? 'isAnonymous'
    if (field.parent?.[parentFieldName] === true) {
      return
    }

    const normalizedValue = typeof value === 'string' ? value.trim() : value

    if (normalizedValue === undefined || normalizedValue === null || normalizedValue === '') {
      field.report('กรุณาใส่ข้อมูล', 'email', field)
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(String(normalizedValue))) {
      field.report('กรุณาใส่อีเมลให้ถูกต้อง', 'email', field)
    }
  },
  { implicit: true }
)

export const telephoneIfMissingRule = vine.createRule<{ fieldName?: string }>(
  (value, options, field: FieldContext) => {
    const parentFieldName = options.fieldName ?? 'isAnonymous'

    if (field.parent?.[parentFieldName] === true) {
      return
    }

    const normalizedValue = typeof value === 'string' ? value.trim() : value

    if (normalizedValue === undefined || normalizedValue === null || normalizedValue === '') {
      field.report('กรุณาใส่ข้อมูล', 'phone', field)
      return
    }

    if (!/^0[0-9]{8,9}$/.test(String(normalizedValue))) {
      field.report('กรุณาใส่หมายเลขโทรศัพท์', 'phone', field)
    }
  },
  { implicit: true }
)
