import type { HttpContext } from '@adonisjs/core/http'
import { reportDateValidator } from '#validators/report'
import Audit from '#models/audit'
import { PaginationLimits } from '#constants/index'
import ExcelJS from 'exceljs'
import { type DateTime } from 'luxon'
import AuditLogTransformer from '#transformers/audit_log_transformer'
import { styleExcelHeader } from '../../utils/excel.js'

export default class ReportAuditController {
  async index({ inertia, request }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const { from, to } = await request.validateUsing(reportDateValidator)
    const data = await this.getData(from, to).paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE)

    const props = {
      filters: { search: '', from, to, page },
      data: {
        meta: data.getMeta(),
        model: AuditLogTransformer.transform(data),
      },
    }

    return inertia.render('admin/report_audit_log/index', props)
  }

  async export({ request, response }: HttpContext) {
    const { from, to } = await request.validateUsing(reportDateValidator)
    const data = await this.getData(from, to)
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Audit')

    worksheet.columns = [
      {
        key: 'created_at',
        header: '	วัน/เวลา',
        width: 20,
      },
      {
        key: 'user',
        header: 'ผู้ใช้',
        width: 20,
      },
      {
        key: 'user_role',
        header: 'สิทธิ์การใช้งาน',
        width: 20,
      },
      {
        key: 'event',
        header: 'การดำเนินการ',
        width: 20,
      },
      {
        key: 'module',
        header: 'โมดูล',
        width: 30,
      },
      {
        key: 'ip',
        header: 'ip',
        width: 15,
      },
    ]

    styleExcelHeader(worksheet.getRow(1))

    data.forEach((r) => {
      worksheet.addRow(this.formatData(r))
    })
    const buffer = await workbook.xlsx.writeBuffer()

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', 'attachment; filename=report_audit.xlsx')

    return response.send(buffer)
  }

  private formatData(e: Audit) {
    const transformed = new AuditLogTransformer(e).toObject()

    return {
      ...transformed,
      old_values: this.formatValues(transformed.old_values),
      new_values: this.formatValues(transformed.new_values),
    }
  }

  private formatValues(values: Record<string, unknown>) {
    return Object.entries(values)
      .map(([field, value]) => `${field}: ${this.formatValue(value)}`)
      .join('\n')
  }

  private formatValue(value: unknown): string {
    if (typeof value === 'string') {
      try {
        return this.formatValue(JSON.parse(value))
      } catch {
        return value
      }
    }

    if (Array.isArray(value)) {
      return value.map((item) => `- ${this.formatValue(item)}`).join('\n')
    }

    if (value && typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }

    return String(value ?? '')
  }

  private getData(from: DateTime | undefined, to: DateTime | undefined) {
    return (
      Audit.query()
        // .leftJoin('users', db.raw('audits.user_id::integer'), 'users.id')
        .joinRaw(`LEFT JOIN users ON audits.user_id=users.id::text`)
        .leftJoin('user_roles', 'users.user_role_id', 'user_roles.id')
        // .preload('createdUser')
        .if(from && to, (query) =>
          query.whereBetween('audits.created_at', [from!.toJSDate(), to!.endOf('day').toJSDate()])
        )
        .orderBy('id', 'desc')
        .select('audits.*', 'users.full_name', 'user_roles.title as user_role')
    )
    // .preload('complaintTrackingLast', (q) => {
    //   q.preload('ownedUser')
    // })
  }
}
