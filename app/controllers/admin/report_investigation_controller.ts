import type { HttpContext } from '@adonisjs/core/http'
import { reportDateValidator } from '#validators/report'
import Complaint from '#models/complaint'
import { ComplaintStatusTitle, getEnumByValue } from '#contracts/enum'
import { PaginationLimits } from '#constants/index'
import ExcelJS from 'exceljs'
import { styleExcelHeader } from '../../utils/excel.js'
import { type DateTime } from 'luxon'

export default class ReportComplaintSummariesController {
  async index({ inertia, request }: HttpContext): Promise<any> {
    const page = request.input('page', 1)
    const { from, to } = await request.validateUsing(reportDateValidator)
    const data = await this.getData(from, to).paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE)

    const props = {
      filters: { search: '', from, to, page },
      data: {
        meta: data.getMeta(),
        model: data.all().map((e) => this.formatData(e)),
      },
    }

    return inertia.render('admin/report_investigation/index', props)
  }

  async export({ request, response }: HttpContext) {
    const { from, to } = await request.validateUsing(reportDateValidator)
    const data = await this.getData(from, to)
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Investigation')

    worksheet.columns = [
      {
        key: 'code',
        header: 'รหัสเรื่อง',
        width: 20,
      },
      {
        key: 'category',
        header: 'หัวข้อ',
        width: 30,
      },
      {
        key: 'subject',
        header: 'ประเด็น',
        width: 30,
      },
      {
        key: 'created_at',
        header: 'วันที่รับแจ้ง',
      },
      {
        key: 'owner',
        header: 'ผู้สืบสวน',
        width: 30,
      },
      {
        key: 'status_title',
        header: 'สถานะ',
        width: 10,
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
    response.header('Content-Disposition', 'attachment; filename=report_investigation.xlsx')

    return response.send(buffer)
  }

  private formatData(e: Complaint) {
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

  private getPreloadedOwnerName(relation: any) {
    if (!relation) return ''

    if (Array.isArray(relation)) {
      return relation[0]?.$attributes?.fullName ?? ''
    }

    return relation.$attributes?.fullName ?? ''
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

  private getData(from: DateTime | undefined, to: DateTime | undefined) {
    return Complaint.query()
      .if(from && to, (query) =>
        query.whereBetween('complaints.created_at', [from!.toJSDate(), to!.endOf('day').toJSDate()])
      )
      .preload('formCategory')
      .preload('formSubject')
      .preload('ownedUser')
    // .preload('complaintTrackingLast', (q) => {
    //   q.preload('ownedUser')
    // })
  }
}
