import type { HttpContext } from '@adonisjs/core/http'
import { complaintTrackingExtendAdminFormValidator } from '#validators/complaint'
import { ComplaintService } from '#services/complaint_service'
import {
  ApproveStatus,
  ApproveStatusTitle,
  ComplaintTrackingMode,
  getEnumKeyValueWithCustomTitle,
} from '#contracts/enum'
import ComplaintTracking from '#models/complaint_tracking'
import Complaint from '#models/complaint'
import FormCategory from '#models/form_category'
import FormSubject from '#models/form_subject'

export default class ComplaintsExtendController {
  async index({ inertia, request, auth }: HttpContext): Promise<any> {
    const search = request.input('search', '')
    const approveStatus = request.input('approveStatus', '')
    const page = request.input('page', 1)
    const formCategory = request.input('formCategory', '')
    const formSubject = request.input('formSubject', '')

    const props = {
      filters: { search, approveStatus, page, formCategory, formSubject },
      data: async () => {
        return await ComplaintService.getAdminComplaintExtendList(
          search,
          approveStatus,
          formCategory,
          formSubject,
          page,
          false,
          auth.user
        )
      },
      formCategories: await this.getFormCategories(),
      formSubjects: await this.getFormSubjects(),
    }
    return inertia.render('admin/complaint_extend/index', props)
  }

  async show({ inertia, params, auth }: HttpContext) {
    const { model, tracking } = await ComplaintService.getAdminComplaintExtend(
      params.id,
      false,
      auth.user
    )
    // const data = await this.getFormData(null)
    return inertia.render('admin/complaint_extend/form', { model, tracking })
  }

  async edit({ inertia, params, auth }: HttpContext) {
    const { model, tracking } = await ComplaintService.getAdminComplaintExtend(
      params.id,
      false,
      auth.user
    )
    const data = await this.getFormData()
    return inertia.render('admin/complaint_extend/form', { data, model, tracking })
  }

  async update({ params, request, response, auth, session }: HttpContext) {
    const model = await ComplaintTracking.findOrFail(params.id)
    const complaint = await Complaint.findOrFail(model.complaintId)
    const { approveStatus, remark } = await request.validateUsing(
      complaintTrackingExtendAdminFormValidator
    )

    let mode = ComplaintTrackingMode.STATUS_UPDATE
    let dueDate = model.dueDate
    const statusId = Number(approveStatus)
    let isExtendDueDate = true
    let isExtendDueDateApprove = false
    if (statusId === ApproveStatus.APPROVED) {
      mode = ComplaintTrackingMode.EXTEND_APPROVE
      isExtendDueDateApprove = true
      dueDate = model.dueDateExtend
    } else if (statusId === ApproveStatus.REJECTED) {
      mode = ComplaintTrackingMode.STATUS_UPDATE //ComplaintTrackingMode.EXTEND_APPROVE
    }
    model
      .merge({
        approveStatus,
        dueDate,
        updatedBy: auth.user?.id ?? 0,
      })
      .save()
    ComplaintService.createTracking(
      model.complaintId,
      mode,
      complaint.isComplex,
      complaint.isSensitive,
      isExtendDueDate ?? false,
      isExtendDueDateApprove ?? false,
      complaint.status,
      0,
      statusId,
      remark ?? '',
      auth.user?.id ?? 0,
      []
    )
    session.flash('success', 'อัปเดตการขยายเวลาเรื่องร้องเรียนเรียบร้อย')
    return response.redirect().toRoute('admin.complaints_extend.index')
  }

  async getFormData() {
    const approveStatus = getEnumKeyValueWithCustomTitle(ApproveStatusTitle, 'label', 'value')
    return {
      approve_status_list: approveStatus,
    }
  }

  private async getFormCategories() {
    const formCategories = await FormCategory.query()
      .orderBy('sequence')
      .orderBy('title')
      .select('id', 'title')
    return formCategories.map((item) => ({ label: item.title, value: item.id }))
  }

  private async getFormSubjects() {
    const formSubjects = await FormSubject.query()
      .orderBy('sequence')
      .orderBy('title')
      .select('id', 'title', 'formCategoryId')
    return formSubjects.map((item) => ({
      label: item.title,
      value: item.id,
      categoryId: item.formCategoryId,
    }))
  }
}
