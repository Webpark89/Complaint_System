import ComplaintTracking from '#models/complaint_tracking'
import auditing from '@filipebraida/adonis-auditing/services/main'
import { MailService } from '#services/mail_service'
import {
  ActiveStatus,
  ApproveStatus,
  ComplaintStatus,
  ComplaintTrackingMode,
} from '#contracts/enum'
import Complaint from '#models/complaint'
import { PaginationLimits } from '#constants/index'
import { urlFor } from '@adonisjs/core/services/url_builder'
import ComplaintTransformer from '#transformers/complaint_transformer'
import type User from '#models/user'
import { UserService } from '#services/user_service'
import Config, { ConfigID } from '#models/config'
import { DateTime } from 'luxon'
import ComplaintTrackingTransformer from '#transformers/complaint_tracking_transformer'
import ComplaintTrackingUserGroup from '../models/complaint_tracking_user_group.ts'

export class ComplaintService {
  static async createTracking(
    complaintId: number,
    mode: number,
    isComplex: boolean,
    isSensitive: boolean,
    isExtendDueDate: boolean,
    isExtendDueDateApprove: boolean,
    status: string | number,
    trackingStatus: string | number,
    approveStatus: string | number,
    remark: string,
    // createdBy: number,
    updatedBy: number,
    userGroupIds: number[],
    detail?: string,
    summary?: string,
    file_1?: string,
    file_2?: string,
    file_3?: string,
    file_4?: string,
    file_5?: string
  ) {
    let tracking: ComplaintTracking | undefined
    let dueDate = await this.getDueDate(DateTime.now(), Number(status), false, false)
    let model: {
      complaintId: number
      mode: number
      dueDate: DateTime | null
      dueDateExtend?: DateTime | null
      ownedBy: number
      status: number
      trackingStatus: number
      approveStatus: number
      remark: string
      detail?: string | null
      summary?: string | null
      file1?: string | null
      file2?: string | null
      file3?: string | null
      file4?: string | null
      file5?: string | null
      countSla: boolean
    } = {
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
    }

    const complaint = await Complaint.findOrFail(complaintId)
    // check for change
    let oldValues: Record<string, any> = {}
    let newValues: Record<string, any> = {}
    // model.countSla = true

    const statusId = Number(status)
    const isChangeStatus = complaint.status !== statusId
    oldValues.status = complaint.status
    newValues.status = statusId
    newValues.trackingStatus = trackingStatus
    if (isChangeStatus) {
      // oldValues.status = complaint.status
      // newValues.status = statusId
      if (statusId === ComplaintStatus.SCREENED) {
        const previousUserGroup = await ComplaintTrackingUserGroup.query()
          .whereHas('complaintTracking', (q) => {
            q.where('complaint_id', complaintId).where('status', complaint.status)
          })
          .distinct('userGroupId')
          .select('userGroupId')

        userGroupIds = previousUserGroup.map((group) => Number(group.userGroupId))
      }
    } else {
      model.dueDate = complaint.dueDate
      if (userGroupIds.length === 0) {
        const previousUserGroup = await ComplaintTrackingUserGroup.query()
          .whereHas('complaintTracking', (q) => {
            q.where('complaint_id', complaintId).where('status', statusId)
          })
          .distinct('userGroupId')
          .select('userGroupId')

        userGroupIds = previousUserGroup.map((group) => Number(group.userGroupId))
      }
    }

    if (complaint.isSensitive !== isSensitive) {
      oldValues.isSensitive = complaint.isSensitive
      newValues.isSensitive = isSensitive
    }

    if (complaint.isComplex !== isComplex) {
      oldValues.isComplex = complaint.isComplex
      newValues.isComplex = isComplex
    }

    if (mode === ComplaintTrackingMode.EXTEND_APPROVE) {
      oldValues.approveStatus = ApproveStatus.PENDING
      newValues.approveStatus = ApproveStatus.APPROVED
    }

    if (isExtendDueDate) {
      const extendDueDate = await this.getDueDate(
        complaint.dueDate ?? DateTime.now(),
        statusId,
        isComplex,
        isExtendDueDate
      )
      model.dueDateExtend = extendDueDate
      if (isExtendDueDateApprove) {
        oldValues.dueDate = dueDate
        newValues.dueDate = extendDueDate
        model.dueDate = extendDueDate
      }
    }
    // console.log(model)

    await auditing.withoutAuditing(async () => {
      tracking = await ComplaintTracking.create({
        ...model,
        oldValues,
        newValues,
        createdBy: updatedBy,
        updatedBy,
      })

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
        .save()

      await tracking.related('userGroups').sync(userGroupIds)

      //cancel existing tracking extend request
      if (mode === ComplaintTrackingMode.EXTEND_REQUEST || isChangeStatus) {
        await ComplaintTracking.query()
          .where('mode', ComplaintTrackingMode.EXTEND_REQUEST)
          .where('approve_status', ApproveStatus.PENDING)
          .where('id', '<>', tracking.id)
          .where('complaint_id', '=', tracking.complaintId)
          .update({ approve_status: ApproveStatus.NONE })
      }

      // Calculate overdue
      if (isChangeStatus) {
        const lastStatus = await ComplaintTracking.query()
          .where('id', '<>', tracking.id)
          .where('complaint_id', '=', tracking.complaintId)
          .orderBy('id', 'desc')
          .first()
        if (lastStatus) {
          await ComplaintTracking.query()
            .where('id', lastStatus.id)
            .update({
              overdue: lastStatus.dueDate
                ? Math.floor(DateTime.now().diff(lastStatus.dueDate, 'days').days)
                : null,
            })

          await ComplaintTracking.query()
            .whereNotIn('id', [tracking.id, lastStatus.id])
            .where('complaint_id', '=', tracking.complaintId)
            .whereNull('overdue')
            .update({ overdue: 0, countSla: false })
        }
      } else {
        await ComplaintTracking.query()
          .whereNotIn('id', [tracking.id])
          .where('complaint_id', '=', tracking.complaintId)
          .whereNull('overdue')
          .update({ overdue: 0, countSla: false })
      }
    })

    if (tracking) {
      await tracking.auditCustom('created', {
        new: {
          ...model,
          id: tracking.id,
          user_groups: JSON.stringify(userGroupIds),
        },
        tags: ['mutation'],
      })

      //fire-and-forget, no need to await
      MailService.sendMailComplaint(model.complaintId, userGroupIds).catch((err) =>
        console.error('Mail error', { err })
      )
    }
  }

  static async getAdminComplaintList(
    is_sensitive: boolean,
    search: string,
    status: string | string[],
    page: number,
    view_all: boolean,
    user: User | undefined,
    formCategory?: string,
    formSubject?: string,
    sla?: string,
    organization?: string
  ) {
    const statuses = (Array.isArray(status) ? status : [status]).filter(Boolean)
    const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0)
    const data = await Complaint.query()
      .preload('formCategory')
      .preload('formSubject')
      .preload('organization')
      .preload('ownedUser')
      .preload('complaintTrackingLast', (q) =>
        q.preload('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds))
      )
      .preload('updatedUser')
      .withCount('complaintTrackings', (query) => {
        query.where('count_sla', true).where('overdue', '>', 0).as('count_tracking_overdue')
      })
      .if(search, (query) => query.whereILike('code', `%${search}%`))
      .if(statuses.length, (query) => query.whereIn('status', statuses))
      .if(organization, (query) => query.where('organizationId', organization!))
      .where('isSensitive', is_sensitive)
      .if(sla === 'overdue' || sla === 'due_soon', (query) => {
        const today = DateTime.now().startOf('day').toSQLDate()!
        const tomorrow = DateTime.now().startOf('day').plus({ days: 1 }).toSQLDate()!

        query.whereHas('complaintTrackings', (trackingQuery) => {
          if (sla === 'overdue') {
            trackingQuery.where((q) =>
              q
                .where((dueQuery) => dueQuery.whereNull('overdue').where('due_date', '<', today))
                .orWhere('overdue', '>', 0)
            )
          } else {
            trackingQuery.whereNull('overdue').whereBetween('due_date', [today, tomorrow])
          }
        })
      })

      .whereHas('formSubject', (subjectQuery) => {
        subjectQuery.whereHas('formCategory', (categoryQuery) => {
          if (formCategory) categoryQuery.where('id', formCategory)
          if (formSubject) subjectQuery.where('id', formSubject)
        })
      })

      .if(!view_all, (query) =>
        query.whereHas('complaintTrackings', (qt) =>
          qt.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds))
        )
      )
      .orderBy('id', 'desc')
      .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE)
    data.baseUrl(
      urlFor(is_sensitive ? 'admin.complaints_sensitive.index' : 'admin.complaints.index')
    )
    data.queryString({
      search: search || '',
      status: status || '',
      sla: sla || '',
      organization: organization || '',
    })
    const modelData = ComplaintTransformer.transform(data).useVariant('forAdminListObject')
    return { meta: data.getMeta(), model: modelData }
  }

  static async getAdminComplaintExtendList(
    search: string,
    approveStatus: string,
    formCategory: string,
    formSubject: string,
    page: number,
    view_all: boolean,
    user: User | undefined
  ) {
    const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0)
    const data = await ComplaintTracking.query()
      .preload(
        'complaint',
        (q) =>
          q
            .preload('formCategory')
            .preload('formSubject')
            .preload('organization')
            .preload('ownedUser')
        // .preload('updatedUser')
      )
      .preload('ownedUser')
      .where('approveStatus', '<>', ApproveStatus.NONE)
      .if(approveStatus, (query) => query.where('approveStatus', approveStatus))
      .whereHas('complaint', (query) => {
        query
          .if(search, (complaintQuery) => complaintQuery.whereILike('code', `%${search}%`))
          .if(formCategory, (complaintQuery) =>
            complaintQuery.where('formCategoryId', formCategory!)
          )
          .if(formSubject, (complaintQuery) => complaintQuery.where('formSubjectId', formSubject!))
      })
      .if(!view_all, (qug) =>
        qug.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds))
      )
      // .whereHas('complaint', (query) =>
      //   query.whereColumn('complaints.status', 'complaint_trackings.status')
      // )
      .where('mode', ComplaintTrackingMode.EXTEND_REQUEST)
      .orderBy('id', 'desc')
      .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE)

    data.baseUrl(urlFor('admin.complaints_extend.index'))
    data.queryString({
      search: search || '',
      approveStatus: approveStatus || '',
      formCategory: formCategory || '',
      formSubject: formSubject || '',
    })
    const modelData = ComplaintTrackingTransformer.transform(data).useVariant('forAdminListObject')
    return { meta: data.getMeta(), model: modelData }
  }

  static async getAdminComplaintExtendCount(user: User | undefined, view_all: boolean = false) {
    const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0)
    const result = await ComplaintTracking.query()
      .where('approveStatus', '=', ApproveStatus.PENDING)
      .if(!view_all, (qug) =>
        qug.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds))
      )
      .where('mode', ComplaintTrackingMode.EXTEND_REQUEST)
      .count('* as total')
      .first()

    return Number(result?.$extras?.total || 0)
  }

  static async getAdminComplaintCount(
    isSensitive: boolean,
    user: User | undefined,
    view_all: boolean = false
  ) {
    const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0)
    const result = await Complaint.query()
      .where('isSensitive', isSensitive)
      .if(!view_all, (query) =>
        query.whereHas('complaintTrackingLast', (trackingQuery) =>
          trackingQuery.whereHas('userGroups', (groupQuery) =>
            groupQuery.whereIn('user_group_id', userGroupIds)
          )
        )
      )
      .count('* as total')
      .first()

    return Number(result?.$extras?.total || 0)
  }

  static async getAdminComplaint(
    id: number,
    is_sensitive: boolean,
    _view_all: boolean,
    user: User | undefined
  ) {
    const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0)
    const data = await Complaint.query()
      .where('id', id)
      .where('isSensitive', is_sensitive)
      .preload('formCategory')
      .preload('formSubject', (q) =>
        q
          .preload('userGroups1', (u) => u.where('status', ActiveStatus.ACTIVE))
          .preload('userGroups2', (u) => u.where('status', ActiveStatus.ACTIVE))
          .preload('userGroups2S', (u) => u.where('status', ActiveStatus.ACTIVE))
          .preload('userGroups2S', (u) => u.where('status', ActiveStatus.ACTIVE))
          .preload('userGroups3', (u) => u.where('status', ActiveStatus.ACTIVE))
          .preload('userGroups4', (u) => u.where('status', ActiveStatus.ACTIVE))
      )
      .preload('organization')
      .preload('complaintTrackings', (q) =>
        q
          .preload('ownedUser')
          .preload('updatedUser', (uu) => uu.preload('organization'))
          .orderBy('id')
      )
      .preload('complaintWitnesses')
      .preload('complaintFiles')
      .preload('complaintAnswers', (q) => q.preload('question'))
      .preload('ownedUser')
      .preload('updatedUser')
      .preload(
        'complaintTrackingLast',
        (q) => q.preload('userGroups') //, (qu) => qu.whereIn('user_group_id', userGroupIds))
      )
      // .if(!view_all, (query) =>
      //   query.whereHas('complaintTrackings', (qt) =>
      //     qt.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds))
      //   )
      // )
      .firstOrFail()
    const model = ComplaintTransformer.transform(data).useVariant('forAdminObject')
    const adminModel = model as any
    adminModel.transformerData[0].is_current_user_group =
      adminModel.transformerData[0].complaintTrackingLast.userGroups.some((u: any) =>
        userGroupIds.includes(u.id)
      )
    return model
  }

  static async getAdminComplaintExtend(id: number, view_all: boolean, user: User | undefined) {
    const userGroupIds = await UserService.listUserGroupIds(user?.id ?? 0)
    const trackingData = await ComplaintTracking.query()
      .if(!view_all, (qug) =>
        qug.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds))
      )
      .where('id', id)
      .where('mode', ComplaintTrackingMode.EXTEND_REQUEST)
      .firstOrFail()
    const data = await Complaint.query()
      .where('id', trackingData.complaintId)
      .preload('formCategory')
      .preload('formSubject')
      .preload('organization')
      .preload('complaintTrackings', (q) =>
        q
          .preload('ownedUser')
          .preload('updatedUser', (uu) => uu.preload('organization'))
          .orderBy('id')
      )
      .preload('complaintWitnesses')
      .preload('complaintFiles')
      .preload('complaintAnswers', (q) => q.preload('question'))
      .preload('ownedUser')
      // .if(!view_all, (query) =>
      //   query.whereHas('complaintTrackings', (qt) =>
      //     qt.whereHas('userGroups', (qu) => qu.whereIn('user_group_id', userGroupIds))
      //   )
      // )
      .firstOrFail()
    const model = ComplaintTransformer.transform(data).useVariant('forAdminObject')
    const tracking =
      ComplaintTrackingTransformer.transform(trackingData).useVariant('toAdminObject')

    return { model, tracking }
  }

  static async getConfigDays(configId: number) {
    const config = await Config.find(configId)
    const value = Number(config?.value ?? 0)
    return Number.isNaN(value) ? 0 : value
  }

  static async getExtendDays(status: ComplaintStatus, isComplex: boolean) {
    switch (status) {
      case ComplaintStatus.SCREENED:
        return await this.getConfigDays(ConfigID.ID_SLA_NEW)
      case ComplaintStatus.IN_PROGRESS:
        return await this.getConfigDays(ConfigID.ID_SLA_IN_PROGRESS_EXTEND)
      case ComplaintStatus.INVESTIGATING:
        return await this.getConfigDays(
          isComplex
            ? ConfigID.ID_SLA_INVESTIGATING_COMPLEX_EXTEND
            : ConfigID.ID_SLA_INVESTIGATING_NORMAL_EXTEND
        )
    }
    return 0
  }

  static async getDueDate(
    previousDate: DateTime,
    status: ComplaintStatus,
    isComplex: boolean,
    isExtendDueDate: boolean
  ) {
    switch (status) {
      case ComplaintStatus.NEW:
      case ComplaintStatus.SCREENED:
        return previousDate
          .startOf('day')
          .plus({ days: await this.getConfigDays(ConfigID.ID_SLA_NEW) })
      case ComplaintStatus.IN_PROGRESS:
        return previousDate.startOf('day').plus({
          days: await this.getConfigDays(
            isExtendDueDate ? ConfigID.ID_SLA_IN_PROGRESS_EXTEND : ConfigID.ID_SLA_IN_PROGRESS
          ),
        })
      case ComplaintStatus.INVESTIGATING:
        return isComplex
          ? previousDate.startOf('day').plus({
              days: await this.getConfigDays(
                isExtendDueDate
                  ? ConfigID.ID_SLA_INVESTIGATING_COMPLEX_EXTEND
                  : ConfigID.ID_SLA_INVESTIGATING_COMPLEX
              ),
            })
          : previousDate.startOf('day').plus({
              days: await this.getConfigDays(
                isExtendDueDate
                  ? ConfigID.ID_SLA_INVESTIGATING_NORMAL_EXTEND
                  : ConfigID.ID_SLA_INVESTIGATING_NORMAL
              ),
            })
    }
    return null
  }
}
