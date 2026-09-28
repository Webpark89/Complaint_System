import ComplaintTracking from '#models/complaint_tracking';
import auditing from '@filipebraida/adonis-auditing/services/main';
import { MailService } from '#services/mail_service';
import { ActiveStatus, ApproveStatus, ComplaintStatus, ComplaintTrackingMode, } from '#contracts/enum';
import Complaint from '#models/complaint';
import { PaginationLimits } from '#constants/index';
import { urlFor } from '@adonisjs/core/services/url_builder';
import ComplaintTransformer from '#transformers/complaint_transformer';
import { UserService } from '#services/user_service';
import Config, { ConfigID } from '#models/config';
import { DateTime } from 'luxon';
import ComplaintTrackingTransformer from '#transformers/complaint_tracking_transformer';
import ComplaintTrackingUserGroup from "../models/complaint_tracking_user_group.js";
export class ComplaintService {
    static async createTracking(complaintId, mode, isComplex, isSensitive, isExtendDueDate, isExtendDueDateApprove, status, trackingStatus, approveStatus, remark, updatedBy, userGroupIds, detail, summary, file_1, file_2, file_3, file_4, file_5) {
        let tracking;
        let dueDate = await this.getDueDate(DateTime.now(), Number(status), false, false);
        let model = {
            complaintId,
            mode,
            dueDate,
            ownedBy: updatedBy,
            status: Number(status),
            trackingStatus: Number(trackingStatus),
            approveStatus: Number(approveStatus),
            remark: remark ? remark.replace(/\0/g, '') : '',
            detail: detail ? detail.replace(/\0/g, '') : '',
            summary: summary ? summary.replace(/\0/g, '') : '',
            file1: file_1 ?? null,
            file2: file_2 ?? null,
            file3: file_3 ?? null,
            file4: file_4 ?? null,
            file5: file_5 ?? null,
            countSla: true,
        };
        const complaint = await Complaint.findOrFail(complaintId);
        let oldValues = {};
        let newValues = {};
        const statusId = Number(status);
        const isChangeStatus = complaint.status !== statusId;
        oldValues.status = complaint.status;
        newValues.status = statusId;
        newValues.trackingStatus = trackingStatus;
        if (isChangeStatus) {
            if (statusId === ComplaintStatus.SCREENED) {
                const previousUserGroup = await ComplaintTrackingUserGroup.query()
                    .whereHas('complaintTracking', (q) => {
                    q.where('complaint_id', complaintId).where('status', complaint.status);
                })
                    .distinct('userGroupId')
                    .select('userGroupId');
                userGroupIds = previousUserGroup.map((group) => Number(group.userGroupId));
            }
        }
        else {
            model.dueDate = complaint.dueDate;
            if (userGroupIds.length === 0) {
                const previousUserGroup = await ComplaintTrackingUserGroup.query()
                    .whereHas('complaintTracking', (q) => {
                    q.where('complaint_id', complaintId).where('status', statusId);
                })
                    .distinct('userGroupId')
                    .select('userGroupId');
                userGroupIds = previousUserGroup.map((group) => Number(group.userGroupId));
            }
        }
        if (complaint.isSensitive !== isSensitive) {
            oldValues.isSensitive = complaint.isSensitive;
            newValues.isSensitive = isSensitive;
        }
        if (complaint.isComplex !== isComplex) {
            oldValues.isComplex = complaint.isComplex;
            newValues.isComplex = isComplex;
        }
        if (mode === ComplaintTrackingMode.EXTEND_APPROVE) {
            oldValues.approveStatus = ApproveStatus.PENDING;
            newValues.approveStatus = ApproveStatus.APPROVED;
        }
        if (isExtendDueDate) {
            const extendDueDate = await this.getDueDate(complaint.dueDate ?? DateTime.now(), statusId, isComplex, isExtendDueDate);
            model.dueDateExtend = extendDueDate;
            if (isExtendDueDateApprove) {
                oldValues.dueDate = dueDate;
                newValues.dueDate = extendDueDate;
                model.dueDate = extendDueDate;
            }
        }
        await auditing.withoutAuditing(async () => {
            tracking = await ComplaintTracking.create({
                ...model,
                oldValues,
                newValues,
                createdBy: updatedBy,
                updatedBy,
            });
            await complaint
                .merge({
                dueDate: model.dueDate,
                isSensitive,
                isComplex,
                status: statusId,
                ownedBy: updatedBy,
                updatedBy,
                updatedAt: DateTime.now(),
            })
                .save();
            await tracking.related('userGroups').sync(userGroupIds);
            if (mode === ComplaintTrackingMode.EXTEND_REQUEST || isChangeStatus) {
                await ComplaintTracking.query()
                    .where('mode', ComplaintTrackingMode.EXTEND_REQUEST)
                    .where('approve_status', ApproveStatus.PENDING)
                    .where('id', '<>', tracking.id)
                    .where('complaint_id', '=', tracking.complaintId)
                    .update({ approve_status: ApproveStatus.NONE });
            }
            if (isChangeStatus) {
                const lastStatus = await ComplaintTracking.query()
                    .where('id', '<>', tracking.id)
                    .where('complaint_id', '=', tracking.complaintId)
                    .orderBy('id', 'desc')
                    .first();
                if (lastStatus) {
                    await ComplaintTracking.query()
                        .where('id', lastStatus.id)
                        .update({
                        overdue: lastStatus.dueDate
                            ? Math.floor(DateTime.now().diff(lastStatus.dueDate, 'days').days)
                            : null,
                    });
                    await ComplaintTracking.query()
                        .whereNotIn('id', [tracking.id, lastStatus.id])
                        .where('complaint_id', '=', tracking.complaintId)
                        .whereNull('overdue')
                        .update({ overdue: 0, countSla: false });
                }
            }
            else {
                await ComplaintTracking.query()
                    .whereNotIn('id', [tracking.id])
                    .where('complaint_id', '=', tracking.complaintId)
                    .whereNull('overdue')
                    .update({ overdue: 0, countSla: false });
            }
        });
        if (tracking) {
            await tracking.auditCustom('created', {
                new: {
                    ...model,
                    id: tracking.id,
                    user_groups: JSON.stringify(userGroupIds),
                },
                tags: ['mutation'],
            });
            MailService.sendMailComplaint(model.complaintId, userGroupIds).catch((err) => console.error('Mail error', { err }));
        }
    }
    static async getAdminComplaintList(is_sensitive, search, status, page, view_all, user, formCategory, formSubject, sla, organization) {
        const statuses = (Array.isArray(status) ? status : [status]).filter(Boolean);
        const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0);
        const data = await Complaint.query()
            .preload('formCategory')
            .preload('formSubject')
            .preload('organization')
            .preload('ownedUser')
            .preload('complaintTrackingLast', (q) => q.preload('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds)))
            .preload('updatedUser')
            .withCount('complaintTrackings', (query) => {
            query.where('count_sla', true).where('overdue', '>', 0).as('count_tracking_overdue');
        })
            .if(search, (query) => query.whereILike('code', `%${search}%`))
            .if(statuses.length, (query) => query.whereIn('status', statuses))
            .if(organization, (query) => query.where('organizationId', organization))
            .where('isSensitive', is_sensitive)
            .if(sla === 'overdue' || sla === 'due_soon', (query) => {
            const today = DateTime.now().startOf('day').toSQLDate();
            const tomorrow = DateTime.now().startOf('day').plus({ days: 1 }).toSQLDate();
            query.whereHas('complaintTrackings', (trackingQuery) => {
                if (sla === 'overdue') {
                    trackingQuery.where((q) => q
                        .where((dueQuery) => dueQuery.whereNull('overdue').where('due_date', '<', today))
                        .orWhere('overdue', '>', 0));
                }
                else {
                    trackingQuery.whereNull('overdue').whereBetween('due_date', [today, tomorrow]);
                }
            });
        })
            .whereHas('formSubject', (subjectQuery) => {
            subjectQuery.whereHas('formCategory', (categoryQuery) => {
                if (formCategory)
                    categoryQuery.where('id', formCategory);
                if (formSubject)
                    subjectQuery.where('id', formSubject);
            });
        })
            .if(!view_all, (query) => query.whereHas('complaintTrackings', (qt) => qt.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds))))
            .orderBy('id', 'desc')
            .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE);
        data.baseUrl(urlFor(is_sensitive ? 'admin.complaints_sensitive.index' : 'admin.complaints.index'));
        data.queryString({
            search: search || '',
            status: status || '',
            sla: sla || '',
            organization: organization || '',
        });
        const modelData = ComplaintTransformer.transform(data).useVariant('forAdminListObject');
        return { meta: data.getMeta(), model: modelData };
    }
    static async getAdminComplaintExtendList(search, approveStatus, formCategory, formSubject, page, view_all, user) {
        const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0);
        const data = await ComplaintTracking.query()
            .preload('complaint', (q) => q
            .preload('formCategory')
            .preload('formSubject')
            .preload('organization')
            .preload('ownedUser'))
            .preload('ownedUser')
            .where('approveStatus', '<>', ApproveStatus.NONE)
            .if(approveStatus, (query) => query.where('approveStatus', approveStatus))
            .whereHas('complaint', (query) => {
            query
                .if(search, (complaintQuery) => complaintQuery.whereILike('code', `%${search}%`))
                .if(formCategory, (complaintQuery) => complaintQuery.where('formCategoryId', formCategory))
                .if(formSubject, (complaintQuery) => complaintQuery.where('formSubjectId', formSubject));
        })
            .if(!view_all, (qug) => qug.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds)))
            .where('mode', ComplaintTrackingMode.EXTEND_REQUEST)
            .orderBy('id', 'desc')
            .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE);
        data.baseUrl(urlFor('admin.complaints_extend.index'));
        data.queryString({
            search: search || '',
            approveStatus: approveStatus || '',
            formCategory: formCategory || '',
            formSubject: formSubject || '',
        });
        const modelData = ComplaintTrackingTransformer.transform(data).useVariant('forAdminListObject');
        return { meta: data.getMeta(), model: modelData };
    }
    static async getAdminComplaintExtendCount(user, view_all = false) {
        const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0);
        const result = await ComplaintTracking.query()
            .where('approveStatus', '=', ApproveStatus.PENDING)
            .if(!view_all, (qug) => qug.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds)))
            .where('mode', ComplaintTrackingMode.EXTEND_REQUEST)
            .count('* as total')
            .first();
        return Number(result?.$extras?.total || 0);
    }
    static async getAdminComplaintCount(isSensitive, user, view_all = false) {
        const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0);
        const result = await Complaint.query()
            .where('isSensitive', isSensitive)
            .if(!view_all, (query) => query.whereHas('complaintTrackingLast', (trackingQuery) => trackingQuery.whereHas('userGroups', (groupQuery) => groupQuery.whereIn('user_group_id', userGroupIds))))
            .count('* as total')
            .first();
        return Number(result?.$extras?.total || 0);
    }
    static async getAdminComplaint(id, is_sensitive, _view_all, user) {
        const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0);
        const data = await Complaint.query()
            .where('id', id)
            .where('isSensitive', is_sensitive)
            .preload('formCategory')
            .preload('formSubject', (q) => q
            .preload('userGroups1', (u) => u.where('status', ActiveStatus.ACTIVE))
            .preload('userGroups2', (u) => u.where('status', ActiveStatus.ACTIVE))
            .preload('userGroups2S', (u) => u.where('status', ActiveStatus.ACTIVE))
            .preload('userGroups2S', (u) => u.where('status', ActiveStatus.ACTIVE))
            .preload('userGroups3', (u) => u.where('status', ActiveStatus.ACTIVE))
            .preload('userGroups4', (u) => u.where('status', ActiveStatus.ACTIVE)))
            .preload('organization')
            .preload('complaintTrackings', (q) => q
            .preload('ownedUser')
            .preload('updatedUser', (uu) => uu.preload('organization'))
            .orderBy('id'))
            .preload('complaintWitnesses')
            .preload('complaintFiles')
            .preload('complaintAnswers', (q) => q.preload('question'))
            .preload('ownedUser')
            .preload('updatedUser')
            .preload('complaintTrackingLast', (q) => q.preload('userGroups'))
            .firstOrFail();
        const model = ComplaintTransformer.transform(data).useVariant('forAdminObject');
        const adminModel = model;
        adminModel.transformerData[0].is_current_user_group =
            adminModel.transformerData[0].complaintTrackingLast.userGroups.some((u) => userGroupIds.includes(u.id));
        return model;
    }
    static async getAdminComplaintExtend(id, view_all, user) {
        const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0);
        const trackingData = await ComplaintTracking.query()
            .if(!view_all, (qug) => qug.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds)))
            .where('id', id)
            .where('mode', ComplaintTrackingMode.EXTEND_REQUEST)
            .firstOrFail();
        const data = await Complaint.query()
            .where('id', trackingData.complaintId)
            .preload('formCategory')
            .preload('formSubject')
            .preload('organization')
            .preload('complaintTrackings', (q) => q
            .preload('ownedUser')
            .preload('updatedUser', (uu) => uu.preload('organization'))
            .orderBy('id'))
            .preload('complaintWitnesses')
            .preload('complaintFiles')
            .preload('complaintAnswers', (q) => q.preload('question'))
            .preload('ownedUser')
            .firstOrFail();
        const model = ComplaintTransformer.transform(data).useVariant('forAdminObject');
        const tracking = ComplaintTrackingTransformer.transform(trackingData).useVariant('toAdminObject');
        return { model, tracking };
    }
    static async getConfigDays(configId) {
        const config = await Config.find(configId);
        const value = Number(config?.value ?? 0);
        return Number.isNaN(value) ? 0 : value;
    }
    static async getExtendDays(status, isComplex) {
        switch (status) {
            case ComplaintStatus.SCREENED:
                return await this.getConfigDays(ConfigID.ID_SLA_NEW);
            case ComplaintStatus.IN_PROGRESS:
                return await this.getConfigDays(ConfigID.ID_SLA_IN_PROGRESS_EXTEND);
            case ComplaintStatus.INVESTIGATING:
                return await this.getConfigDays(isComplex
                    ? ConfigID.ID_SLA_INVESTIGATING_COMPLEX_EXTEND
                    : ConfigID.ID_SLA_INVESTIGATING_NORMAL_EXTEND);
        }
        return 0;
    }
    static async getDueDate(previousDate, status, isComplex, isExtendDueDate) {
        switch (status) {
            case ComplaintStatus.NEW:
            case ComplaintStatus.SCREENED:
                return previousDate
                    .startOf('day')
                    .plus({ days: await this.getConfigDays(ConfigID.ID_SLA_NEW) });
            case ComplaintStatus.IN_PROGRESS:
                return previousDate.startOf('day').plus({
                    days: await this.getConfigDays(isExtendDueDate ? ConfigID.ID_SLA_IN_PROGRESS_EXTEND : ConfigID.ID_SLA_IN_PROGRESS),
                });
            case ComplaintStatus.INVESTIGATING:
                return isComplex
                    ? previousDate.startOf('day').plus({
                        days: await this.getConfigDays(isExtendDueDate
                            ? ConfigID.ID_SLA_INVESTIGATING_COMPLEX_EXTEND
                            : ConfigID.ID_SLA_INVESTIGATING_COMPLEX),
                    })
                    : previousDate.startOf('day').plus({
                        days: await this.getConfigDays(isExtendDueDate
                            ? ConfigID.ID_SLA_INVESTIGATING_NORMAL_EXTEND
                            : ConfigID.ID_SLA_INVESTIGATING_NORMAL),
                    });
        }
        return null;
    }
}
//# sourceMappingURL=complaint_service.js.map