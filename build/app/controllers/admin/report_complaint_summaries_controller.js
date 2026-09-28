import { reportDateValidator } from '#validators/report';
import Complaint from '#models/complaint';
import FormCategory from '#models/form_category';
import FormSubject from '#models/form_subject';
import { ComplaintStatusTitle, ComplaintTrackingModeTitle, getEnumByValue, IsComplexTitle, IsSensitiveTitle, } from '#contracts/enum';
import { PaginationLimits } from '#constants/index';
import ExcelJS from 'exceljs';
import { styleExcelHeader } from '../../utils/excel.js';
export default class ReportComplaintSummariesController {
    async index({ inertia, request }) {
        const page = request.input('page', 1);
        const { from, to } = await request.validateUsing(reportDateValidator);
        const search = request.input('search', '');
        const formCategory = request.input('formCategory', '');
        const formSubject = request.input('formSubject', '');
        const owner = request.input('owner', '');
        const status = request.input('status', '');
        const data = await this.getData(from, to, search, formCategory, formSubject, owner, status).paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE);
        const props = {
            filters: { search, formCategory, formSubject, owner, status, from, to, page },
            data: {
                meta: data.getMeta(),
                model: data.all().map((e) => this.formatData(e)),
            },
            formCategories: (await FormCategory.query().orderBy('sequence').orderBy('title').select('id', 'title')).map((e) => ({ label: e.title, value: e.id })),
            formSubjects: (await FormSubject.query()
                .orderBy('sequence')
                .orderBy('title')
                .select('id', 'title', 'formCategoryId')).map((e) => ({ label: e.title, value: e.id, categoryId: e.formCategoryId })),
        };
        return inertia.render('admin/report_complaint_summary/index', props);
    }
    async export({ request, response }) {
        const { from, to } = await request.validateUsing(reportDateValidator);
        const search = request.input('search', '');
        const formCategory = request.input('formCategory', '');
        const formSubject = request.input('formSubject', '');
        const owner = request.input('owner', '');
        const status = request.input('status', '');
        const data = await this.getData(from, to, search, formCategory, formSubject, owner, status);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Complaints');
        console.log(data);
        worksheet.columns = [
            {
                key: 'code',
                header: 'หมายเลขอ้างอิง',
                width: 20,
            },
            {
                key: 'category',
                header: 'หมวดหมู่',
                width: 40,
            },
            {
                key: 'subject',
                header: 'ประเด็น',
                width: 30,
            },
            {
                key: 'is_sensitive',
                header: 'เรื่องอ่อนไหว',
                width: 18,
            },
            {
                key: 'is_complex',
                header: 'เรื่องซับซ้อน',
                width: 18,
            },
            {
                key: 'incident_date',
                header: 'วันเวลาที่เกิดเหตุ',
                width: 22,
            },
            {
                key: 'title',
                header: 'หัวข้อ',
                width: 25,
            },
            {
                key: 'detail',
                header: 'รายละเอียด',
                width: 50,
            },
            {
                key: 'organization_title',
                header: 'หน่วยงาน/สาขา',
                width: 40,
            },
            {
                key: 'complainant',
                header: 'ผู้ร้องเรียน',
                width: 30,
            },
            {
                key: 'witnesses',
                header: 'พยาน',
                width: 40,
            },
            {
                key: 'files',
                header: 'ไฟล์แนบ',
                width: 45,
            },
            {
                key: 'created_at',
                header: 'วันที่รับแจ้ง',
                width: 20,
            },
            {
                key: 'updated_at',
                header: 'อัพเดตล่าสุด',
                width: 20,
            },
            {
                key: 'owner',
                header: 'ผู้สืบสวน',
                width: 30,
            },
            {
                key: 'status_title',
                header: 'สถานะ',
                width: 15,
            },
            {
                key: 'count_tracking_overdue',
                header: 'เกิน SLA (ครั้ง)',
                width: 20,
            },
            {
                key: 'complaint_tracking',
                header: 'การติดตามเรื่องร้องเรียน',
                width: 70,
            },
        ];
        styleExcelHeader(worksheet.getRow(1));
        worksheet.getColumn('detail').alignment = { vertical: 'top', wrapText: true };
        worksheet.getColumn('complainant').alignment = { vertical: 'top', wrapText: true };
        worksheet.getColumn('witnesses').alignment = { vertical: 'top', wrapText: true };
        worksheet.getColumn('files').alignment = { vertical: 'top', wrapText: true };
        worksheet.getColumn('complaint_tracking').alignment = { vertical: 'top', wrapText: true };
        data.forEach((r) => {
            worksheet.addRow(this.formatData(r));
        });
        const buffer = await workbook.xlsx.writeBuffer();
        response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.header('Content-Disposition', 'attachment; filename=report_complaint_summary.xlsx');
        return response.send(buffer);
    }
    formatData(e) {
        return {
            id: e.$attributes.id,
            code: e.$attributes.code,
            title: e.$attributes.title,
            category: this.getPreloadedTitle(e.$preloaded.formCategory),
            subject: `${this.getPreloadedTitle(e.$preloaded.formSubject)} ${e.$attributes.formSubjectOther ?? ''}`,
            detail: e.$attributes.detail,
            incident_date: e.$attributes.incidentAt?.toFormat('dd/MM/yyyy HH:mm'),
            organization_title: this.getPreloadedTitle(e.$preloaded.organization),
            complainant: e.$attributes.complainantFullName
                ? [
                    e.$attributes.complainantFullName,
                    e.$attributes.complainantTelephone
                        ? `เบอร์โทรศัพท์: ${e.$attributes.complainantTelephone}`
                        : '',
                    e.$attributes.complainantEmail ? `อีเมล: ${e.$attributes.complainantEmail}` : '',
                ].join(' | ')
                : '',
            witnesses: e.complaintWitnesses
                .map((witness) => [witness.fullName, witness.telephone].filter(Boolean).join(' | โทร: '))
                .join('\n'),
            files: e.complaintFiles.map((file) => file.file).join('\n'),
            is_sensitive: IsSensitiveTitle(e.$attributes.isSensitive),
            is_complex: IsComplexTitle(e.$attributes.isComplex),
            complaint_tracking: e.complaintTrackings
                .map((tracking) => {
                const parts = [
                    tracking.updatedAt?.toFormat('dd/MM/yyyy HH:mm'),
                    getEnumByValue(ComplaintTrackingModeTitle, tracking.mode),
                    getEnumByValue(ComplaintStatusTitle, tracking.status),
                    tracking.remark,
                    tracking.detail,
                    tracking.summary,
                ].filter(Boolean);
                return parts.join(' | ');
            })
                .join('\n'),
            owner: this.getPreloadedOwnerName(e.$preloaded.ownedUser),
            status: e.$attributes.status,
            status_title: getEnumByValue(ComplaintStatusTitle, e.$attributes.status),
            created_at: e.$attributes.createdAt?.toFormat('dd/MM/yyyy HH:mm'),
            updated_at: e.$attributes.updatedAt?.toFormat('dd/MM/yyyy HH:mm'),
            count_tracking_overdue: Number(e.$extras.count_tracking_overdue ?? 0),
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
    getData(from, to, search = '', formCategory = '', formSubject = '', owner = '', status = '') {
        return Complaint.query()
            .if(search, (query) => query.where((searchQuery) => searchQuery
            .whereILike('complaints.code', `%${search}%`)
            .orWhereILike('complaints.title', `%${search}%`)))
            .if(formCategory, (query) => query.where('form_category_id', formCategory))
            .if(formSubject, (query) => query.where('form_subject_id', formSubject))
            .if(owner, (query) => query.whereHas('ownedUser', (ownerQuery) => ownerQuery.whereILike('full_name', `%${owner}%`)))
            .if(status, (query) => query.where('status', status))
            .if(from && to, (query) => query.whereBetween('complaints.created_at', [from.toJSDate(), to.endOf('day').toJSDate()]))
            .preload('formCategory')
            .preload('formSubject')
            .preload('organization')
            .preload('ownedUser')
            .preload('complaintWitnesses')
            .preload('complaintFiles')
            .preload('complaintTrackings', (query) => query.orderBy('id'))
            .withCount('complaintTrackings', (query) => {
            query.where('count_sla', true).where('overdue', '>', 0).as('count_tracking_overdue');
        })
            .orderBy('id', 'desc');
    }
}
//# sourceMappingURL=report_complaint_summaries_controller.js.map