import { reportDateValidator } from '#validators/report';
import Audit from '#models/audit';
import UserRole from '#models/user_role';
import { PaginationLimits } from '#constants/index';
import ExcelJS from 'exceljs';
import AuditLogTransformer, { AUDIT_EVENT_TITLES, AUDIT_MODULE_TITLES, } from '#transformers/audit_log_transformer';
import { styleExcelHeader } from '../../utils/excel.js';
export default class ReportAuditController {
    async index({ inertia, request }) {
        const page = request.input('page', 1);
        const filters = {
            user: request.input('user', ''),
            user_role: request.input('user_role', ''),
            event: request.input('event', ''),
            module: request.input('module', ''),
            ip: request.input('ip', ''),
        };
        const { from, to } = await request.validateUsing(reportDateValidator);
        const data = await this.getData(from, to, filters).paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE);
        const [events, modules, roles] = await Promise.all([
            Audit.query().distinct('event').orderBy('event'),
            Audit.query().distinct('auditable_type').orderBy('auditable_type'),
            UserRole.query().select('title').orderBy('title'),
        ]);
        const props = {
            filters: { search: '', from, to, page, ...filters },
            data: {
                meta: data.getMeta(),
                model: AuditLogTransformer.transform(data),
            },
            filterOptions: {
                events: events.map((row) => ({
                    value: row.event,
                    label: AUDIT_EVENT_TITLES[row.event] ?? row.event,
                })),
                modules: modules.map((row) => ({
                    value: row.auditableType,
                    label: AUDIT_MODULE_TITLES[row.auditableType] ?? row.auditableType,
                })),
                roles: roles.map((row) => row.title),
            },
        };
        return inertia.render('admin/audit_logs/index', props);
    }
    async export({ request, response }) {
        const { from, to } = await request.validateUsing(reportDateValidator);
        const data = await this.getData(from, to);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Audit');
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
            {
                key: 'old_values',
                header: 'ข้อมูลเก่า',
                width: 40,
                style: { alignment: { wrapText: true, vertical: 'top' } },
            },
            {
                key: 'new_values',
                header: 'ข้อมูลใหม่',
                width: 40,
                style: { alignment: { wrapText: true, vertical: 'top' } },
            },
        ];
        styleExcelHeader(worksheet.getRow(1));
        data.forEach((r) => {
            worksheet.addRow(this.formatData(r));
        });
        const buffer = await workbook.xlsx.writeBuffer();
        response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.header('Content-Disposition', 'attachment; filename=audit_logs.xlsx');
        return response.send(buffer);
    }
    formatData(e) {
        const transformed = new AuditLogTransformer(e).toObject();
        return {
            ...transformed,
            old_values: this.formatValues(transformed.old_values),
            new_values: this.formatValues(transformed.new_values),
        };
    }
    formatValues(values) {
        return Object.entries(values)
            .map(([field, value]) => `${field}: ${this.formatValue(value)}`)
            .join('\n');
    }
    formatValue(value) {
        if (typeof value === 'string') {
            try {
                return this.formatValue(JSON.parse(value));
            }
            catch {
                return value;
            }
        }
        if (Array.isArray(value)) {
            return value.map((item) => `- ${this.formatValue(item)}`).join('\n');
        }
        if (value && typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }
        return String(value ?? '');
    }
    getData(from, to, filters = {}) {
        return (Audit.query()
            .joinRaw(`LEFT JOIN users ON audits.user_id=users.id::text`)
            .leftJoin('user_roles', 'users.user_role_id', 'user_roles.id')
            .if(from && to, (query) => query.whereBetween('audits.created_at', [from.toJSDate(), to.endOf('day').toJSDate()]))
            .if(filters.user, (query) => query.whereILike('users.full_name', `%${filters.user}%`))
            .if(filters.user_role, (query) => query.whereILike('user_roles.title', `%${filters.user_role}%`))
            .if(filters.ip, (query) => query.whereRaw("audits.metadata->>'ip_address' ILIKE ?", [`%${filters.ip}%`]))
            .if(filters.event, (query) => query.whereIn('audits.event', this.eventValues(filters.event)))
            .if(filters.module, (query) => query.whereIn('audits.auditable_type', this.moduleValues(filters.module)))
            .orderBy('id', 'desc')
            .select('audits.*', 'users.full_name', 'user_roles.title as user_role'));
    }
    eventValues(filter) {
        const values = Object.fromEntries(Object.entries(AUDIT_EVENT_TITLES).map(([value, title]) => [title, value]));
        return Object.entries(values)
            .filter(([title, value]) => title.includes(filter) || value.includes(filter))
            .map(([, value]) => value)
            .concat(filter);
    }
    moduleValues(filter) {
        const values = Object.fromEntries(Object.entries(AUDIT_MODULE_TITLES).map(([value, title]) => [title, value]));
        return Object.entries(values)
            .filter(([title, value]) => title.includes(filter) || value.includes(filter))
            .map(([, value]) => value)
            .concat(filter);
    }
}
//# sourceMappingURL=audit_logs_controller.js.map