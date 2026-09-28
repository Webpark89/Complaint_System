import { dashboardValidator } from '#validators/dashboard';
import Complaint from '#models/complaint';
import ComplaintTracking from '#models/complaint_tracking';
import { ComplaintStatus, ComplaintStatusTitle, getEnumByValue } from '#contracts/enum';
import { DateTime } from 'luxon';
import db from '@adonisjs/lucid/services/db';
import { UserService } from '#services/user_service';
import User from '#models/user';
export default class DashboardController {
    async index({ inertia }) {
        return inertia.render('admin/dashboard/index', {});
    }
    async data({ inertia, request, auth }) {
        const { from, to } = await request.validateUsing(dashboardValidator);
        const userGroupIds = await UserService.listUserGroupIds(auth.user?.id ?? 0);
        const permissionUser = await User.query()
            .where('id', auth.user?.id ?? 0)
            .preload('permissions', (permissionQuery) => permissionQuery.preload('userModuleActions').preload('userModules'))
            .first();
        const canViewSensitiveComplaints = Boolean(permissionUser?.permissions.some((permission) => permission.userModuleActions.code === 'view' &&
            permission.userModules.some((module) => module.module === 'complaint_sensitive')));
        const canViewComplaints = Boolean(permissionUser?.permissions.some((permission) => permission.userModuleActions.code === 'view' &&
            permission.userModules.some((module) => module.module === 'complaint')));
        const data = Complaint.query()
            .whereBetween('complaints.created_at', [from.toJSDate(), to.endOf('day').toJSDate()])
            .where((query) => {
            if (canViewComplaints)
                query.where('complaints.is_sensitive', false);
            if (canViewSensitiveComplaints)
                query.orWhere('complaints.is_sensitive', true);
            if (!canViewComplaints && !canViewSensitiveComplaints)
                query.whereRaw('1 = 0');
        })
            .whereHas('complaintTrackings', (qt) => qt.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds)));
        const dataTracking = ComplaintTracking.query()
            .where('count_sla', '=', true)
            .whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds));
        const today = DateTime.now().startOf('day').toSQLDate();
        const tomorrow = DateTime.now().startOf('day').plus({ days: 1 }).toSQLDate();
        const countSla = (sensitive, kind) => dataTracking
            .clone()
            .whereHas('complaint', (query) => query.where('isSensitive', sensitive))
            .if(kind === 'overdue', (query) => query.where((q) => q
            .where((dq) => dq.whereNull('overdue').where('due_date', '<', today))
            .orWhere('overdue', '>', 0)))
            .if(kind === 'soon', (query) => query.whereNull('overdue').whereBetween('due_date', [today, tomorrow]))
            .count('* as total')
            .first();
        const [slaOverdueInsensitive, slaOverdueSensitive, slaSoonInsensitive, slaSoonSensitive] = await Promise.all([
            countSla(false, 'overdue'),
            countSla(true, 'overdue'),
            countSla(false, 'soon'),
            countSla(true, 'soon'),
        ]);
        const dataStatus = await data
            .clone()
            .select('status')
            .count('* as total')
            .groupBy('status')
            .orderBy('status');
        const dataStatusBySensitivity = await data
            .clone()
            .select('status', 'is_sensitive')
            .count('* as total')
            .groupBy('status', 'is_sensitive');
        let groupStatus = [];
        let counts = {};
        let countsBySensitivity = {};
        let countTotal = 0;
        dataStatus.forEach((row) => {
            const total = Number(row.$extras.total);
            groupStatus.push({ label: getEnumByValue(ComplaintStatusTitle, row.status), value: total });
            counts[row.status] = total;
            countTotal += total;
        });
        dataStatusBySensitivity.forEach((row) => {
            countsBySensitivity[`${row.isSensitive ? 'sensitive' : 'insensitive'}_${row.status}`] =
                Number(row.$extras.total);
        });
        const sensitivityCount = (status, sensitive) => status === 'total'
            ? dataStatusBySensitivity
                .filter((row) => Boolean(row.isSensitive) === sensitive)
                .reduce((total, row) => total + Number(row.$extras.total), 0)
            : (countsBySensitivity[`${sensitive ? 'sensitive' : 'insensitive'}_${status}`] ?? 0);
        const dataSlaOverDue = await dataTracking
            .clone()
            .count('* as total')
            .where((query) => query
            .where((q) => q.whereNull('overdue').where('due_date', '<', today))
            .orWhere('overdue', '>', 0))
            .first();
        const dataSlaSoonDue = await dataTracking
            .clone()
            .count('* as total')
            .whereNull('overdue')
            .where('due_date', '=', tomorrow)
            .first();
        const dataSlaOnDue = await dataTracking
            .clone()
            .count('* as total')
            .where('overdue', '<=', 0)
            .first();
        const trackingTotal = await dataTracking.clone().count('* as total').first();
        const dataGroupMonth = await data
            .clone()
            .select(db.raw("date_trunc('month', created_at) as month_title"))
            .count('* as total')
            .groupByRaw("date_trunc('month', created_at)");
        const dataGroupCategory = await data
            .clone()
            .join('form_categories', 'complaints.form_category_id', 'form_categories.id')
            .select('form_categories.title as category_title')
            .count('* as total')
            .groupBy('form_categories.title')
            .orderBy('total', 'desc');
        const dataGroupOrganization = await data
            .clone()
            .join('organizations', 'complaints.organization_id', 'organizations.id')
            .select('organizations.code as organization_title')
            .count('* as total')
            .groupBy('organizations.code')
            .orderBy('total', 'desc');
        const model = {
            from,
            to,
            count_total: countTotal,
            count_new: counts[ComplaintStatus.NEW] ?? 0,
            count_sla_overdue: dataSlaOverDue?.$extras.total ?? 0,
            count_sla_due_soon: dataSlaSoonDue?.$extras.total ?? 0,
            count_screened: counts[ComplaintStatus.SCREENED] ?? 0,
            count_in_progress: counts[ComplaintStatus.IN_PROGRESS] ?? 0,
            count_investigating: counts[ComplaintStatus.INVESTIGATING] ?? 0,
            count_reject: counts[ComplaintStatus.REJECTED] ?? 0,
            count_close: counts[ComplaintStatus.COMPLETED] ?? 0,
            count_total_insensitive: sensitivityCount('total', false),
            count_total_sensitive: sensitivityCount('total', true),
            count_reject_insensitive: sensitivityCount(ComplaintStatus.REJECTED, false),
            count_reject_sensitive: sensitivityCount(ComplaintStatus.REJECTED, true),
            count_sla_overdue_insensitive: slaOverdueInsensitive?.$extras.total ?? 0,
            count_sla_overdue_sensitive: slaOverdueSensitive?.$extras.total ?? 0,
            count_sla_due_soon_insensitive: slaSoonInsensitive?.$extras.total ?? 0,
            count_sla_due_soon_sensitive: slaSoonSensitive?.$extras.total ?? 0,
            count_new_insensitive: sensitivityCount(ComplaintStatus.NEW, false),
            count_new_sensitive: sensitivityCount(ComplaintStatus.NEW, true),
            count_screened_insensitive: sensitivityCount(ComplaintStatus.SCREENED, false),
            count_screened_sensitive: sensitivityCount(ComplaintStatus.SCREENED, true),
            count_in_progress_insensitive: sensitivityCount(ComplaintStatus.IN_PROGRESS, false),
            count_in_progress_sensitive: sensitivityCount(ComplaintStatus.IN_PROGRESS, true),
            count_investigating_insensitive: sensitivityCount(ComplaintStatus.INVESTIGATING, false),
            count_investigating_sensitive: sensitivityCount(ComplaintStatus.INVESTIGATING, true),
            count_close_insensitive: sensitivityCount(ComplaintStatus.COMPLETED, false),
            count_close_sensitive: sensitivityCount(ComplaintStatus.COMPLETED, true),
            can_view_sensitive: canViewSensitiveComplaints,
            group_months: dataGroupMonth.map((e) => ({
                label: `${String((e.$extras.month_title?.getMonth() ?? 0) + 1).padStart(2, '0')}/${e.$extras.month_title?.getFullYear()?.toString() ?? ''}`,
                value: Number(e.$extras.total),
            })),
            group_categories: dataGroupCategory.map((e) => ({
                label: e.$extras.category_title,
                value: Number(e.$extras.total),
            })),
            group_organizations: dataGroupOrganization.map((e) => ({
                label: e.$extras.organization_title,
                value: Number(e.$extras.total),
            })),
            group_status: groupStatus,
            group_sla: [
                {
                    label: 'ตรงเวลา',
                    value: Math.round((Number(dataSlaOnDue?.$extras.total) / trackingTotal?.$extras.total) * 100),
                },
                {
                    label: 'ใกล้ครบกำหนด',
                    value: Math.round((Number(dataSlaSoonDue?.$extras.total) / trackingTotal?.$extras.total) * 100),
                },
                {
                    label: 'เกินกำหนด',
                    value: Math.round((Number(dataSlaOverDue?.$extras.total) / trackingTotal?.$extras.total) * 100),
                },
            ],
            dataTrackingTotal: trackingTotal?.$extras.total,
        };
        return inertia.render('admin/dashboard/index', { model });
    }
}
//# sourceMappingURL=dashboard_controller.js.map