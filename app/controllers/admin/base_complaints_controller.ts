import type { HttpContext } from '@adonisjs/core/http'
import Complaint from '#models/complaint'
import {
  complaintAdminFileUploadValidator,
  complaintAdminFormValidator,
} from '#validators/complaint'
import { ComplaintService } from '#services/complaint_service'
import UserGroup from '#models/user_group'
import {
  ActiveStatus,
  ApproveStatus,
  ComplaintStatus,
  ComplaintTrackingMode,
} from '#contracts/enum'
import drive from '@adonisjs/drive/services/main'
import FormCategory from '#models/form_category'
import FormSubject from '#models/form_subject'
import { urlFor } from '@adonisjs/core/services/url_builder'
import { errors as vineErrors } from '@vinejs/vine'
import { randomUUID } from 'node:crypto'
import app from '@adonisjs/core/services/app'
import fs from 'node:fs/promises'
import Organization from '#models/organization'

export default class BaseComplaintsController {
  isSensitive: boolean = false

  async index({ inertia, request, auth }: HttpContext): Promise<any> {
    const search = request.input('search', '')
    const statusInput = request.input('status', '')
    const status = Array.isArray(statusInput)
      ? statusInput.filter(Boolean)
      : statusInput
        ? String(statusInput).split(',').filter(Boolean)
        : []
    const page = request.input('page', 1)
    const formCategory = request.input('formCategory', '')
    const formSubject = request.input('formSubject', '')
    const sla = request.input('sla', '')
    const organization = request.input('organization', '')

    const props = {
      filters: { search, status, page, formCategory, formSubject, sla, organization },
      isSensitive: this.isSensitive,
      data: async () => {
        return await ComplaintService.getAdminComplaintList(
          this.isSensitive,
          search,
          status,
          page,
          false,
          auth.user,
          formCategory,
          formSubject,
          sla,
          organization
        )
      },
      formCategories: await this.getFormCategories(),
      formSubjects: await this.getFormSubjects(),
      organizations: await Organization.query().orderBy('id').select('id', 'title'),
    }

    return inertia.render('admin/complaints/index', props)
  }

  async show({ inertia, params, response, auth }: HttpContext) {
    const model = await ComplaintService.getAdminComplaint(
      params.id,
      this.isSensitive,
      false,
      auth.user
    )
    const transform = (model as any).transformerData[0]
    if (transform.isSensitive !== this.isSensitive)
      return response.redirect().toRoute('admin.complaints.index')
    const data = await this.getFormData((model as any).transformerData[0])
    return inertia.render('admin/complaints/form', { data, model, isSensitive: this.isSensitive })
  }

  async edit({ inertia, params, response, auth }: HttpContext) {
    const model = await ComplaintService.getAdminComplaint(
      params.id,
      this.isSensitive,
      false,
      auth.user
    )
    const transform = (model as any).transformerData[0]
    // console.log(transform)
    if (transform.isSensitive !== this.isSensitive || !transform.is_current_user_group)
      return response.redirect().toRoute('admin.complaints.index')
    const data = await this.getFormData((model as any).transformerData[0])
    return inertia.render('admin/complaints/form', { data, model, isSensitive: this.isSensitive })
  }

  async update({ params, request, response, auth, session }: HttpContext) {
    const model = await Complaint.findOrFail(params.id)
    if (model.isSensitive !== this.isSensitive) {
      return response.redirect().toRoute('admin.complaints.index')
    }
    const {
      userGroups,
      isSensitive,
      isComplex,
      isExtendDueDate,
      isExtendDueDateApprove,
      approveStatus,
      detail,
      summary,
      file_1: file1,
      file_2: file2,
      file_3: file3,
      file_4: file4,
      file_5: file5,
      mime_1: mime1,
      mime_2: mime2,
      mime_3: mime3,
      mime_4: mime4,
      mime_5: mime5,
      ...data
    } = await request.validateUsing(complaintAdminFormValidator)

    const saveFile = async (filePath: string | undefined, mime: string | undefined) => {
      if (!filePath) return null
      const uploadDirectory = app.tmpPath('uploads')
      if (!filePath.startsWith(`${uploadDirectory}/`)) return null
      const filename = `tracking-${randomUUID()}.${filePath.split('.').pop()}`
      await drive
        .use('fileApi')
        .moveFromFs(filePath, filename, mime ? { contentType: mime } : undefined)
      return filename
    }

    const file1Name = await saveFile(file1, mime1)
    const file2Name = await saveFile(file2, mime2)
    const file3Name = await saveFile(file3, mime3)
    const file4Name = await saveFile(file4, mime4)
    const file5Name = await saveFile(file5, mime5)

    let mode = ComplaintTrackingMode.STATUS_UPDATE
    const statusId = Number(data.status)
    if (model.status === statusId) {
      const hasRemark = Boolean(data.remark && data.remark.trim().length > 0)
      const hasDetail = Boolean(detail && detail.trim().length > 0)
      const hasSummary = Boolean(summary && summary.trim().length > 0)
      const hasExtend = Boolean(isExtendDueDate)
      const hasFiles = Boolean(file1Name || file2Name || file3Name || file4Name || file5Name)
      const hasUserGroups = Boolean(userGroups && userGroups.length > 0)
      const hasSensitiveChange = isSensitive !== undefined && isSensitive !== model.isSensitive
      const hasComplexChange = isComplex !== undefined && isComplex !== model.isComplex

      if (
        !hasRemark &&
        !hasDetail &&
        !hasSummary &&
        !hasExtend &&
        !hasFiles &&
        !hasUserGroups &&
        !hasSensitiveChange &&
        !hasComplexChange
      ) {
        throw new vineErrors.E_VALIDATION_ERROR([
          {
            field: 'remark',
            message: 'กรุณากรอกข้อมูลอย่างน้อย 1 ช่อง หากไม่มีการเปลี่ยนสถานะ',
            rule: 'required',
          },
        ])
      }

      if (isExtendDueDateApprove) {
        mode = ComplaintTrackingMode.EXTEND_APPROVE
      } else if (isExtendDueDate) {
        mode = ComplaintTrackingMode.EXTEND_REQUEST
      }
    } else {
      if (statusId === ComplaintStatus.COMPLETED) {
        mode = ComplaintTrackingMode.STATUS_CLOSE
      } else {
        mode = ComplaintTrackingMode.STATUS_ADVANCE
      }
    }
    await ComplaintService.createTracking(
      params.id,
      mode,
      isComplex ?? model.isComplex,
      isSensitive ?? model.isSensitive,
      isExtendDueDate ?? false,
      isExtendDueDateApprove ?? false,
      data.status,
      0,
      isExtendDueDateApprove
        ? ApproveStatus.APPROVED
        : (approveStatus ?? (isExtendDueDate ? ApproveStatus.PENDING : ApproveStatus.NONE)),
      data.remark ?? '',
      auth.user?.id ?? 0,
      userGroups ?? [],
      detail ?? '',
      summary ?? '',
      file1Name ?? undefined,
      file2Name ?? undefined,
      file3Name ?? undefined,
      file4Name ?? undefined,
      file5Name ?? undefined
    )

    const redirectUrl = isSensitive ? 'admin.complaints_sensitive.index' : 'admin.complaints.index'
    session.flash(
      'success',
      isSensitive ? 'แก้ไขเรื่องร้องเรียนลับเรียบร้อย' : 'แก้ไขเรื่องร้องเรียนเรียบร้อย'
    )
    return response.redirect().toRoute(redirectUrl)
  }

  async uploadFile({ request, response }: HttpContext) {
    const { files } = await request.validateUsing(complaintAdminFileUploadValidator)
    const filename = `${Date.now()}-${randomUUID()}-${files.clientName}`
    const filePath = `${app.tmpPath('uploads')}/${filename}`
    await files.move(app.tmpPath('uploads'), { name: filename })
    return response.json({
      path: filePath,
      name: files.clientName,
      size: files.size,
      mime: files.type && files.subtype ? `${files.type}/${files.subtype}` : '',
    })
  }

  async removeUploadedFile({ request, response }: HttpContext) {
    const filePath = request.input('path')
    const uploadDirectory = app.tmpPath('uploads')
    if (typeof filePath === 'string' && filePath.startsWith(`${uploadDirectory}/`)) {
      await fs.unlink(filePath).catch(() => undefined)
    }
    return response.json({ success: true })
  }

  async stream({ params, request, response }: HttpContext) {
    if (!request.hasValidSignature()) {
      return response.badRequest('ลิงก์ไม่ถูกต้องหรือหมดอายุแล้ว')
    }
    const fileKey = params.filename
    try {
      const exists = await drive.use('fileApi').exists(fileKey)
      if (!exists) {
        return response.notFound('File not found')
      }
      const { contentLength, contentType } = await drive.use('fileApi').getMetaData(fileKey)
      const fileStream = await drive.use('fileApi').getBytes(fileKey)
      response.header('Content-Type', contentType || 'application/octet-stream')
      response.header('Content-Length', contentLength)
      return response.send(fileStream)
    } catch (error) {
      console.error(error)
      return response.status(500).send('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์')
    }
  }

  async getFormData(complaint: any) {
    const userGroups = await UserGroup.query()
      .where('status', ActiveStatus.ACTIVE)
      .orderBy('title')
      .select('id', 'title')

    let statusLists: any = []
    let nextUserGroup: any = null
    let nextUserGroupSensitive: any = null
    let extendDays = 0
    let extendDaysComplex = 0
    switch (complaint.status) {
      case ComplaintStatus.NEW:
        // nextUserGroup = complaint.isSensitive
        //   ? complaint.formSubject.userGroups2S
        //   : complaint.formSubject.userGroups2
        // extendDays = await ComplaintService.getExtendDays(ComplaintStatus.IN_PROGRESS, false)
        statusLists = [
          {
            label: `รับแจ้งเรื่อง`,
            value: ComplaintStatus.SCREENED,
          },
          {
            label: `ไม่รับเรื่อง`,
            value: ComplaintStatus.REJECTED,
          },
        ]
        break
      case ComplaintStatus.SCREENED:
        nextUserGroup = complaint.formSubject.userGroups2
        nextUserGroupSensitive = complaint.formSubject.userGroups2S
        extendDays = await ComplaintService.getExtendDays(ComplaintStatus.SCREENED, false)
        statusLists = [
          {
            label: `แก้ไขสถานะปัจจุบัน (รับแจ้งเรื่อง)`,
            value: ComplaintStatus.SCREENED,
          },
          {
            label: `ส่งสถานะถัดไป (กำลังดำเนินการ)`,
            value: ComplaintStatus.IN_PROGRESS,
          },
          {
            label: `ไม่รับเรื่อง`,
            value: ComplaintStatus.REJECTED,
          },
        ]
        break
      case ComplaintStatus.IN_PROGRESS:
        nextUserGroup = complaint.formSubject.userGroups3
        extendDays = await ComplaintService.getExtendDays(
          ComplaintStatus.IN_PROGRESS,
          complaint.isComplex
        )
        statusLists = [
          {
            label: `แก้ไขสถานะปัจจุบัน (กำลังดำเนินการ)`,
            value: ComplaintStatus.IN_PROGRESS,
          },
          {
            label: `ส่งสถานะถัดไป (รอตรวจสอบ)`,
            value: ComplaintStatus.INVESTIGATING,
          },
        ]
        break
      case ComplaintStatus.INVESTIGATING:
        nextUserGroup = complaint.formSubject.userGroups4
        extendDays = await ComplaintService.getExtendDays(ComplaintStatus.INVESTIGATING, false)
        extendDaysComplex = await ComplaintService.getExtendDays(
          ComplaintStatus.INVESTIGATING,
          true
        )
        statusLists = [
          {
            label: `แก้ไขสถานะปัจจุบัน (รอตรวจสอบ)`,
            value: ComplaintStatus.INVESTIGATING,
          },
          {
            label: `ส่งสถานะถัดไป (ปิดเรื่อง)`,
            value: ComplaintStatus.COMPLETED,
          },
        ]
        break
      case ComplaintStatus.COMPLETED:
        statusLists = [
          {
            label: `แก้ไขสถานะปัจจุบัน (ปิดเรื่อง)`,
            value: ComplaintStatus.COMPLETED,
          },
          {
            label: `เปิดเรื่องใหม่ (รอตรวจสอบ)`,
            value: ComplaintStatus.IN_PROGRESS,
          },
        ]
    }

    return {
      extend_days: extendDays,
      extend_days_complex: extendDaysComplex,
      status_list: statusLists,
      current_status: complaint.status,
      //complaint.status === ComplaintStatus.NEW ? ComplaintStatus.IN_PROGRESS : complaint.status,
      next_user_groups: nextUserGroup?.map((e: any) => ({ label: e.title, value: e.id })),
      next_user_groups_sensitive: nextUserGroupSensitive?.map((e: any) => ({
        label: e.title,
        value: e.id,
      })),
      user_groups: userGroups.map((e: any) => ({ label: e.title, value: e.id })),
      baseUrl:
        urlFor(this.isSensitive ? 'admin.complaints_sensitive.index' : 'admin.complaints.index') +
        '/',
    }
  }

  protected async getFormCategories() {
    const formCategories = await FormCategory.query()
      .orderBy('sequence')
      .orderBy('title')
      .select('id', 'title')
    return formCategories.map((e: any) => ({ label: e.title, value: e.id }))
  }

  protected async getFormSubjects() {
    const formSubjects = await FormSubject.query()
      .orderBy('sequence')
      .orderBy('title')
      .select('id', 'title', 'formCategoryId')
    return formSubjects.map((e: any) => ({
      label: e.title,
      value: e.id,
      categoryId: e.formCategoryId,
    }))
  }
}
