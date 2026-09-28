import type { HttpContext, HttpResponse } from '@adonisjs/core/http'
import {
  complaintConsentValidator,
  complaintCategoryValidator,
  complaintFileUploadValidator,
  complaintFormComplainantValidator,
  complaintFormConfirmValidator,
  complaintFormIncidentValidator,
  complaintFormIncidentValidatorSchema,
} from '#validators/complaint'
import Complaint from '#models/complaint'
import { ConfigService } from '#services/config_service'
import Form from '#models/form'
import FormCategory from '#models/form_category'
import FormCategoryTransformer from '#transformers/form_category_transformer'
import { type Session } from '@adonisjs/session'
import FormSubject from '#models/form_subject'
import ComplaintTransformer from '#transformers/complaint_transformer'
import {
  ActiveStatus,
  ApproveStatus,
  ComplaintStatus,
  ComplaintTrackingMode,
  ComplaintTrackingStatus,
  OrganizationType,
} from '#contracts/enum'
import FormTransformer from '#transformers/form_transformer'
import Organization from '#models/organization'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'
import ComplaintWitness from '#models/complaint_witness'
import ComplaintFile from '#models/complaint_file'
import drive from '@adonisjs/drive/services/main'
import fs from 'node:fs/promises'
import { ComplaintService } from '#services/complaint_service'
import { randomUUID } from 'node:crypto'
import vine from '@vinejs/vine'
import ComplaintAnswer from '#models/complaint_answer'
import encryption from '@adonisjs/core/services/encryption'

export default class ComplaintController {
  SESSION_KEY_CONSENT = 'COMPLAINT_CONSENT'
  SESSION_KEY = 'COMPLAINT'
  SESSION_KEY_ID = 'COMPLAINT_ID'

  async index({ inertia }: HttpContext) {
    const data = await ConfigService.getConfigTerm()

    return inertia.render('complaint/index', data)
  }

  async indexConsent({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(complaintConsentValidator)
    if (!payload.consent) {
      response.redirect().back()
    }

    session.put(this.SESSION_KEY_CONSENT, true)

    return response.redirect('/complaint/category')
  }

  async category({ inertia, response, session }: HttpContext) {
    this.checkConsent(response, session)
    const categoryListData = await FormCategory.query()
      .preload('formSubjects', (q) => {
        q.where('status', '=', ActiveStatus.ACTIVE)
        q.orderBy('sequence')
      })
      .where('status', '=', ActiveStatus.ACTIVE)
      .whereHas('forms', (q) => {
        q.where('status', '=', ActiveStatus.ACTIVE)
      })
      .orderBy('sequence')
    const categoryList = FormCategoryTransformer.transform(categoryListData)
    const model = new Complaint()
    return inertia.render('complaint/category', { categoryList, model })
  }

  async formCategory({ request, response, session }: HttpContext) {
    this.checkConsent(response, session)
    session.forget(this.SESSION_KEY_ID)
    const payload = await request.validateUsing(complaintCategoryValidator)
    this.saveNewComplaint(session)
    this.saveComplaint(session, payload, null, null, null, 2)

    return response.redirect('/complaint/form')
  }

  async form({ inertia, response, session }: HttpContext) {
    this.checkConsent(response, session)
    const data = this.getComplaint(session) // this.saveComplaint(session, payload)
    // console.log(data)
    if (data.currentStep === undefined || data.currentStep === 1)
      return response.redirect('/complaint/category')
    const model = data.model
    const formSubjectData = await FormSubject.query()
      .where('id', model.formSubjectId)
      .where('status', '=', ActiveStatus.ACTIVE)
      .preload('formCategory')
      .orderBy('id', 'desc')
      .firstOrFail()

    const form = await this.getForm(model.formCategoryId)
    model.formId = form.id
    model.formSubject = formSubjectData
    model.formCategory = formSubjectData.$preloaded.formCategory

    const organizations = await Organization.query()
      .whereIn('type', [OrganizationType.COMPANY, OrganizationType.BRANCH])
      .where('status', ActiveStatus.ACTIVE)
      .where((query) => {
        query.whereNull('parent_organization_id').orWhereHas('parent', (parentQuery) => {
          parentQuery.where('status', ActiveStatus.ACTIVE)
        })
      })
      .orderBy('title')
      .select('id', 'title')

    return inertia.render('complaint/form', {
      organizationList: organizations.map((e: any) => ({ label: e.title, value: e.id })),
      form: FormTransformer.transform(form),
      model: ComplaintTransformer.transform(model),
      currentStep: data.currentStep ?? 1,
      maxStep: data.nextStep ?? 1,
    })
  }

  async uploadFiles({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(complaintFileUploadValidator)
    const files: string[] = []
    const mimes: string[] = []

    const file = payload.files
    const tmpFile = `${Date.now()}-${file.clientName}`
    const filePath = `${app.tmpPath('uploads')}/${tmpFile}`
    try {
      await file.move(app.tmpPath('uploads'), { name: tmpFile })
      files.push(filePath)
      mimes.push(file.type && file.subtype ? `${file.type}/${file.subtype}` : '')
    } catch (ex) {
      console.error('err', ex)
    }
    const sess = this.getComplaint(session)
    const step2 = sess.step2 ? { ...sess.step2 } : {}
    const existingFiles = Array.isArray(step2.files) ? step2.files : []
    const existingMime = Array.isArray(step2.mimes) ? step2.mimes : []
    step2.files = [...existingFiles, ...files] //.slice(0, 5)
    step2.mimes = [...existingMime, ...mimes] //.slice(0, 5)

    this.saveComplaint(session, null, step2, null, null, sess.currentStep ?? 3)

    return response.json({ files: step2.files, mimes: step2.mimes })
  }

  async removeUploadedFile({ request, response, session }: HttpContext) {
    const { path: filePath } = request.body()
    const sess = this.getComplaint(session)
    const step2 = sess.step2 ? { ...sess.step2 } : {}
    const existingFiles = Array.isArray(step2.files) ? step2.files : []

    const indexToRemove = existingFiles.findIndex((file: string) => file === filePath)
    // step2.files = existingFiles.filter((file: string) => file !== filePath)
    if (indexToRemove !== -1) {
      step2.files.splice(indexToRemove, 1)
      step2.mimes.splice(indexToRemove, 1)
    }

    if (filePath) {
      try {
        await fs.unlink(filePath)
      } catch (error) {
        console.warn('Unable to delete uploaded temp file:', filePath, error)
      }
    }

    this.saveComplaint(session, null, step2, null, null, sess.currentStep ?? 3)
    return response.json({ files: step2.files, mimes: step2.mimes })
  }

  async formIncident({ request, response, session }: HttpContext) {
    const data = this.getComplaint(session)
    const form = await this.getForm(data.model.formCategoryId)
    let payload = null

    //validate additional question
    // console.log(form.$preloaded.formQuestions)
    if (Array.isArray(form.$preloaded.formQuestions) && form.$preloaded.formQuestions.length > 0) {
      const dynamicShape: Record<string, any> = {}
      const formQuestions = form.$preloaded.formQuestions as unknown as Array<{
        id: string | number
        type: string
      }>
      for (const field of formQuestions) {
        let rule
        if (field.type === 'string') {
          rule = vine.string().maxLength(200).optional()
        } else if (field.type === 'text') {
          rule = vine.string().maxLength(3000).optional()
        } else if (field.type === 'date') {
          rule = vine.date({ formats: ['DD/MM/YYYY', 'iso8601'] }).optional()
        } else if (field.type === 'datetime') {
          rule = vine.date({ formats: ['DD/MM/YYYY', 'iso8601'] }).optional()
        }

        if (rule) dynamicShape[`answers_${field.id}`] = rule
      }
      // console.log(
      //   request.input('answers.1'),
      //   complaintFormIncidentValidatorSchema.getProperties(),
      //   dynamicShape
      // )
      const dynamicSchema = vine.create(
        vine.object({
          ...complaintFormIncidentValidatorSchema.getProperties(),
          ...dynamicShape,
        })
      )
      payload = await request.validateUsing(dynamicSchema)
    } else {
      payload = await request.validateUsing(complaintFormIncidentValidator)
    }

    const time = payload.incidentTime
    const incidentAt = payload.incidentDate.set({
      hour: time.hour,
      minute: time.minute,
    })
    this.saveComplaint(session, null, { ...payload, incidentAt }, null, null, 3)
    return response.redirect().back() //('/complaint/form')
  }

  async formComplainant({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(complaintFormComplainantValidator)
    this.saveComplaint(session, null, null, payload, null, 4)
    return response.redirect().back() //('/complaint/form')
  }

  async formConfirm({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(complaintFormConfirmValidator)
    const data = this.saveComplaint(session, null, null, null, payload, 4)

    const allModel = { ...data.model, ...data.step1, ...data.step2, ...data.step3, ...data.step4 }
    const { witnesses, files, mimes, incidentDate, incidentTime, confirm, ...model } = allModel
    const time = DateTime.fromISO(data.step2.incidentTime)
    const date = DateTime.fromISO(data.step2.incidentDate)
    model.incidentAt = date.set({
      hour: time.hour,
      minute: time.minute,
    })
    model.isAnonymous = model.isAnonymous ?? false
    model.is_complex = false
    model.is_sensitive = false
    model.consent = true
    // model.priority = 0
    model.status = ComplaintStatus.NEW
    model.updated_by = 0

    const answers: any[] = []
    Object.keys(model).forEach((e) => {
      if (e.startsWith('answers_')) {
        // console.log(e.substring(8), model[e])
        answers[Number(e.substring(8))] = model[e]
        delete model[e]
      }
    })
    const complaint = await Complaint.create(model)
    const baseComplaint = { complaintId: complaint.id }
    if (answers && answers.length > 0) {
      const answerRecords = answers
        .map((e: any, i) => {
          if (e === undefined || e === null) {
            return null
          }
          const answerDate = DateTime.isDateTime(e)
            ? e
            : typeof e === 'string' && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(e)
              ? DateTime.fromISO(e)
              : null
          const isDate = answerDate?.isValid === true
          return {
            ...baseComplaint,
            formQuestionId: i,
            answerText: isDate ? '' : e,
            answerDatetime: isDate ? answerDate : null,
            status: ActiveStatus.ACTIVE,
          }
        })
        .filter((record) => record !== null)

      if (answerRecords.length > 0) {
        await ComplaintAnswer.createMany(answerRecords)
      }
    }

    if (witnesses && witnesses.length > 0) {
      ComplaintWitness.createMany(
        witnesses.map((e: any) => ({
          ...baseComplaint,
          fullName: e.name,
          telephone: e.phone,
        }))
      )
    }
    if (files && files.length > 0) {
      const fileRecords = await Promise.all(
        files.map(async (file: any, i: number) => {
          // console.log(files)
          const fileName = `${randomUUID()}.${file.split('.').pop()}`
          await drive.use('fileApi').moveFromFs(file, fileName, { contentType: mimes[i] })
          return {
            ...baseComplaint,
            file: fileName,
          }
        })
      )

      await ComplaintFile.createMany(fileRecords)
    }

    const userGroup = await FormSubject.query()
      .preload('userGroups1')
      .where('id', model.formSubjectId)
      .where('status', ActiveStatus.ACTIVE)
      .firstOrFail()
    const userGroupIds = userGroup.userGroups1.flatMap((g) => g.id)

    await ComplaintService.createTracking(
      complaint.id,
      ComplaintTrackingMode.NEW,
      false,
      false,
      false,
      false,
      ComplaintStatus.NEW,
      ComplaintTrackingStatus.NEW,
      ApproveStatus.NONE,
      '',
      0,
      userGroupIds
    )

    // return response.redirect().back()
    session.put(this.SESSION_KEY_ID, complaint.id)
    session.forget(this.SESSION_KEY)
    return response.redirect('/complaint/thank')
  }

  async thank({ inertia, response, session }: HttpContext) {
    const id = session.get(this.SESSION_KEY_ID, 0) //this.getComplaint(session)
    const model = await Complaint.query().where('id', id).select('code').first()

    if (!model) response.redirect('/complaint/category')

    return inertia.render('complaint/thank', { model: ComplaintTransformer.transform(model) })
  }

  private checkConsent(response: HttpResponse, session: Session) {
    const consent = session.get(this.SESSION_KEY_CONSENT, false)
    if (!consent) response.redirect('/complaint')
  }

  private async getForm(formCategoryId: number) {
    const form = await Form.query()
      .where('form_category_id', formCategoryId)
      .where('status', ActiveStatus.ACTIVE)
      .preload('formQuestions', (query) => {
        query.orderBy('sequence')
      })
      .orderBy('id', 'asc')
      .firstOrFail()
    return form
  }

  private saveNewComplaint(session: Session) {
    return session.put(this.SESSION_KEY, {
      consent_pdpa: true,
      model: new Complaint(),
      step1: null,
      step2: null,
      step3: null,
      step4: null,
      currentStep: 1,
      nextStep: 1,
    })
  }

  private getComplaint(session: Session): {
    maxStep: number
    model: any
    consent_pdpa: boolean
    step1: any
    step2: any
    step3: any
    step4: any
    currentStep: number
    nextStep: number
  } {
    return (
      encryption.decrypt(session.get(this.SESSION_KEY, null)) ?? {
        consent_pdpa: false,
        model: new Complaint(),
        step1: null,
        step2: null,
        step3: null,
        step4: null,
        currentStep: 1,
        nextStep: 1,
        maxStep: 1,
      }
    )
  }

  private saveComplaint(
    session: Session,
    step1: any,
    step2: any,
    step3: any,
    step4: any,
    step: number
  ) {
    const sess = this.getComplaint(session)
    const model = sess.model
    const data = { ...model, ...step1 }
    let newStep = step
    const newStep1 = step1 ?? sess.step1 ?? null
    const newStep2 = step2 ?? sess.step2 ?? null
    const newStep3 = step3 ?? sess.step3 ?? null
    const newStep4 = step4 ?? sess.step4 ?? null
    if (step >= 1 && newStep1 === null) {
      newStep = 1
    } else if (step >= 2 && newStep2 === null) {
      newStep = 2
    } else if (step >= 3 && newStep3 === null) {
      newStep = 3
    } else if (step >= 4 && newStep4 === null) {
      newStep = 4
    }
    const result = {
      model: data,
      step1: newStep1,
      step2: newStep2,
      step3: newStep3,
      step4: newStep4,
      currentStep: newStep,
      maxStep: Math.max(newStep, sess.maxStep ?? 1),
    }
    // console.log('savemodel', result)
    session.put(this.SESSION_KEY, encryption.encrypt(result))
    return result
  }
}
