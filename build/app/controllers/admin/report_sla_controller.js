import { reportDateValidator } from '#validators/report';
import Complaint from '#models/complaint';
import db from '@adonisjs/lucid/services/db';
import { ComplaintStatusTitle, getEnumByValue } from '#contracts/enum';
import { PaginationLimits } from '#constants/index';
import ExcelJS from 'exceljs';
import { styleExcelHeader } from '../../utils/excel.js';
export default class ReportComplaintSummariesController {
    async index({ inertia, request }) {
        const page = request.input('page', 1);
        const { from, to } = await request.validateUsing(reportDateValidator);
        const data = await this.getData(from, to).paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE);
        const props = {
            filters: { search: '', from, to, page },
            data: {
                meta: data.getMeta(),
                model: data.all().map((e) => this.formatData(e)),
            },
        };
        return inertia.render('admin/report_sla/index', props);
    }
    async export({ request, response }) {
        const { from, to } = await request.validateUsing(reportDateValidator);
        const data = await this.getDataExport(from, to);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('SLA');
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
                key: 'status_title',
                header: 'สถานะล่าสุด',
                width: 15,
            },
            {
                key: 'created_at',
                header: 'วันที่รับแจ้ง',
                width: 18,
            },
            {
                key: 'count_tracking_overdue',
                header: 'จำนวนที่เกิน SLA ในรายการ',
                width: 20,
            },
        ];
        styleExcelHeader(worksheet.getRow(1));
        data.forEach((r) => {
            worksheet.addRow(this.formatDataExport(r));
        });
        const buffer = await workbook.xlsx.writeBuffer();
        response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.header('Content-Disposition', 'attachment; filename=report_sla.xlsx');
        return response.send(buffer);
    }
    formatData(e) {
        return {
            month: `${e.$extras.title.toLocaleString('th-TH', { month: 'long' })} ${e.$extras.title.getFullYear()}`,
            count_tracking_on_due: Number(e.$extras.total_tracking_on) ?? 0,
            count_tracking_overdue: Number(e.$extras.total_tracking_over) ?? 0,
            count_on_due: Number(e.$extras.count_tracking_on) ?? 0,
            count_overdue: Number(e.$extras.count_tracking_over) ?? 0,
            percent_sla: `${Number(e.$extras.count_percent_sla)}%`,
            percent_tracking_sla: `${Number(e.$extras.total_percent_sla)}%`,
        };
    }
    getData(from, to) {
        return (Complaint.query()
            .if(from && to, (query) => query.whereBetween('complaints.created_at', [
            from.toJSDate(),
            to.endOf('day').toJSDate(),
        ]))
            .joinRaw(`LEFT JOIN (select count(id) filter (where count_sla=true) total_tracking , count(id) filter (where count_sla=true and overdue > 0) as total_tracking_over, count(id) filter (where count_sla=true and overdue <= 0) as total_tracking_on, complaint_id from complaint_trackings  group by complaint_id) as trackings on trackings.complaint_id = complaints.id`)
            .select(db.raw('SUM(trackings.total_tracking) as total_tracking'), db.raw('SUM(trackings.total_tracking_over) as total_tracking_over'), db.raw('SUM(trackings.total_tracking_on) as total_tracking_on'), db.raw("date_trunc('month', complaints.created_at) as title"), db.raw('COUNT(trackings.total_tracking_over) FILTER (WHERE trackings.total_tracking_over > 0) as count_tracking_over'), db.raw('COUNT(trackings.total_tracking_on) FILTER (WHERE trackings.total_tracking_on > 0) as count_tracking_on'), db.raw('COALESCE(ROUND(100.0 * (SUM(trackings.total_tracking_on) / NULLIF(SUM(trackings.total_tracking), 0))), 0) as total_percent_sla'), db.raw('COALESCE(ROUND(100.0 * (COUNT(trackings.total_tracking_on) / NULLIF(COUNT(trackings.total_tracking), 0))), 0) as count_percent_sla'))
            .groupByRaw("date_trunc('month', complaints.created_at)")
            .orderByRaw("date_trunc('month', complaints.created_at)"));
    }
    formatDataExport(e) {
        return {
            code: e.$attributes.code,
            category: this.getPreloadedTitle(e.$preloaded.formCategory),
            subject: `${this.getPreloadedTitle(e.$preloaded.formSubject)} ${e.$attributes.formSubjectOther ?? ''}`,
            owner: this.getPreloadedOwnerName(e.$preloaded.ownedUser),
            status: e.$attributes.status,
            status_title: getEnumByValue(ComplaintStatusTitle, e.$attributes.status),
            created_at: e.$attributes.createdAt?.toFormat('dd/MM/yyyy HH:mm'),
            count_tracking_on_due: Number(e.$extras.total_tracking_on) ?? 0,
            count_tracking_overdue: Number(e.$extras.total_tracking_over) ?? 0,
            count_on_due: Number(e.$extras.count_tracking_on) ?? 0,
            count_overdue: Number(e.$extras.count_tracking_over) ?? 0,
        };
    }
    getPreloadedOwnerName(relation) {
        if (!relation)
            return '';
        if (Array.isArray(relation)) {
            return relation[0]?.$attributes?.fullName ?? '';
        }
        return relation.$attributes?.fullName ?? '';
    }
    getPreloadedTitle(relation) {
        if (!relation) {
            return '';
        }
        if (Array.isArray(relation)) {
            return relation[0]?.title ?? '';
        }
        return relation.title ?? '';
    }
    getDataExport(from, to) {
        return (Complaint.query()
            .if(from && to, (query) => query.whereBetween('complaints.created_at', [
            from.toJSDate(),
            to.endOf('day').toJSDate(),
        ]))
            .preload('formCategory')
            .preload('formSubject')
            .joinRaw(`LEFT JOIN (select count(id) filter (where count_sla=true) total_tracking , count(id) filter (where count_sla=true and overdue > 0) as total_tracking_over, count(id) filter (where count_sla=true and overdue <= 0) as total_tracking_on, complaint_id from complaint_trackings  group by complaint_id) as trackings on trackings.complaint_id = complaints.id`)
            .select('complaints.code', 'complaints.form_category_id', 'complaints.form_subject_id', 'complaints.created_at', 'complaints.owned_by', 'complaints.status', db.raw('SUM(trackings.total_tracking_over) as total_tracking_over'), db.raw("date_trunc('month', complaints.created_at) as title"), db.raw('COUNT(trackings.total_tracking_over) FILTER (WHERE trackings.total_tracking_over > 0) as count_tracking_over'))
            .groupBy('complaints.id')
            .orderBy('complaints.id'));
    }
}
//# sourceMappingURL=report_sla_controller.js.map