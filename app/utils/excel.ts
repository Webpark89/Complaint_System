import type ExcelJS from 'exceljs'

export function styleExcelHeader(row: ExcelJS.Row) {
  row.font = { color: { argb: 'FFFFFFFF' }, bold: true }
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF00008B' },
  }
  row.alignment = { horizontal: 'center', vertical: 'middle' }
}
