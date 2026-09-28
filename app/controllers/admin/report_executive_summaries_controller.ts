import type { HttpContext } from '@adonisjs/core/http'
// import { reportDateValidator } from '#validators/report'
import Complaint from '#models/complaint'
import db from '@adonisjs/lucid/services/db'
import { ComplaintStatus, ComplaintStatusTitle, getEnumByValue } from '#contracts/enum'
import { PaginationLimits } from '#constants/index'
import ExcelJS from 'exceljs'
import { styleExcelHeader } from '../../utils/excel.js'
import { type DateTime } from 'luxon'
import { reportDateValidator } from '#validators/report'

export default class ReportExecutiveSummariesController {
  async index({ inertia, request }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const { from, to } = await request.validateUsing(reportDateValidator)
    // const from = DateTime.now()
    // const to = DateTime.now()
    const data = await this.getData(from, to).paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE)
    const props = {
      filters: { search: '', from, to, page },
      data: {
        meta: data.getMeta(),
        model: data.all().map((e) => this.formatData(e)),
      },
    }

    return inertia.render('admin/report_executive_summary/index', props)
  }

  async export({ request, response }: HttpContext) {
    const { from, to } = await request.validateUsing(reportDateValidator)
    // const from = DateTime.now()
    // const to = DateTime.now()
    const data = await this.getDataExport(from, to)
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Executive')

    worksheet.columns = [
      {
        key: 'code',
        header: 'รหัสเรื่อง',
        width: 20,
      },
      {
        key: 'category',
        header: 'หัวข้อ',
        width: 40,
      },
      {
        key: 'subject',
        header: 'ประเด็น',
        width: 30,
      },
      {
        key: 'created_at',
        header: 'วันที่รับแจ้ง',
        width: 18,
      },
      {
        key: 'owner',
        header: 'ผู้สืบสวน',
        width: 30,
      },
      {
        key: 'status_title',
        header: 'สถานะล่าสุด',
        width: 15,
      },
    ]

    styleExcelHeader(worksheet.getRow(1))

    data.forEach((r) => {
      worksheet.addRow(this.formatDataExport(r))
    })
    const buffer = await workbook.xlsx.writeBuffer()

    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response.header('Content-Disposition', 'attachment; filename=report_executive_summary.xlsx')

    return response.send(buffer)
  }

  private formatData(e: Complaint) {
    const quarter = Math.floor(e.$extras.title.getMonth() / 3) + 1
    return {
      quarter: `Q${quarter} ${e.$extras.title.getFullYear()}`,
      count_all: Number(e.$extras.count_all) ?? 0,
      count_close: Number(e.$extras.count_close) ?? 0,
      // count_pending: Number(e.$extras.count_pending) ?? 0,
      avg_days_to_close: Number(e.$extras.avg_days_to_close) ?? 0,
      percent_sla: `${Number(e.$extras.percent_sla)}%`,
    }
  }

  private getData(from: DateTime | undefined, to: DateTime | undefined) {
    return (
      Complaint.query()
        .if(from && to, (query) =>
          query.whereBetween('complaints.created_at', [
            from!.toJSDate(),
            to!.endOf('day').toJSDate(),
          ])
        )
        .joinRaw(
          `LEFT JOIN (select complaint_id, max(created_at)::date as close_date, max(due_date)::date as last_due_date from complaint_trackings where status = ${ComplaintStatus.COMPLETED} group by complaint_id) as closing on closing.complaint_id = complaints.id`
        )
        .select(
          db.raw("date_trunc('quarter', complaints.created_at) as title"),
          db.raw('count(*) as count_all'),
          db.raw(
            `count(*) filter (where complaints.status = ${ComplaintStatus.COMPLETED}) as count_close`
          ),
          db.raw(
            `count(*) filter (where complaints.status <> ${ComplaintStatus.COMPLETED}) as count_pending`
          ),
          db.raw('avg(closing.close_date - closing.last_due_date)  as avg_days_to_close'),
          db.raw(
            `round(100.0 * count(*) filter (where complaints.status = ${ComplaintStatus.COMPLETED} and closing.close_date <= closing.last_due_date) / nullif(count(*) filter (where complaints.status = ${ComplaintStatus.COMPLETED}), 0), 2) as percent_sla`
          )
        )
        //   .count('* as total')
        .groupByRaw("date_trunc('quarter', complaints.created_at)")
        .orderByRaw("date_trunc('quarter', complaints.created_at) desc")
    )
  }

  private getPreloadedTitle(relation: any) {
    if (!relation) {
      return ''
    }

    if (Array.isArray(relation)) {
      return relation[0]?.title ?? ''
    }

    return relation.title ?? ''
  }

  private getPreloadedOwnerName(relation: any) {
    if (!relation) return ''

    if (Array.isArray(relation)) {
      return relation[0]?.$attributes?.fullName ?? ''
    }

    return relation.$attributes?.fullName ?? ''
  }

  private formatDataExport(e: Complaint) {
    // console.log(e.$preloaded.ownedUser?.$attributes.fullName)
    return {
      code: e.$attributes.code,
      category: this.getPreloadedTitle(e.$preloaded.formCategory),
      subject: `${this.getPreloadedTitle(e.$preloaded.formSubject)} ${e.$attributes.formSubjectOther ?? ''}`,
      owner: this.getPreloadedOwnerName(e.$preloaded.ownedUser),
      status: e.$attributes.status,
      status_title: getEnumByValue(ComplaintStatusTitle, e.$attributes.status),
      created_at: e.$attributes.createdAt?.toFormat('dd/MM/yyyy HH:mm'),
    }
  }

  private getDataExport(from: DateTime | undefined, to: DateTime | undefined) {
    return Complaint.query()
      .if(from && to, (query) =>
        query.whereBetween('complaints.created_at', [from!.toJSDate(), to!.endOf('day').toJSDate()])
      )
      .preload('formCategory')
      .preload('formSubject')
      .preload('ownedUser')
  }
}
