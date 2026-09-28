import { type HttpContext } from '@adonisjs/core/http'
import FormCategory from '#models/form_category'
import FormCategoryTransformer from '#transformers/form_category_transformer'
import { urlFor } from '@adonisjs/core/services/url_builder'
import { PaginationLimits } from '#constants/index'
import {
  formCategoryAdminStoreValidator,
  formCategoryAdminUpdateValidator,
} from '#validators/form_category'

export default class FormCategoriesController {
  async index({ request, inertia }: HttpContext): Promise<any> {
    const search = request.input('search', '')
    const status = request.input('status', '')
    const page = request.input('page', 1)
    const createUrl = urlFor('admin.form_categories.create')

    const props = {
      createUrl,
      filters: { search, status, page },
      data: async () => {
        const data = await FormCategory.query()
          .withCount('formSubjects')
          // .whereNull('deleted_at')
          .if(search, (query) => query.whereILike('title', `%${search}%`))
          .if(status, (query) => query.where('status', status))
          .orderBy('sequence')
          .orderBy('title')
          .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE)
        data.baseUrl(urlFor('admin.form_categories.index'))
        data.queryString({
          search: search || '',
          status: status || '',
        })
        const modelData = FormCategoryTransformer.transform(data).useVariant('forAdminObject')
        return { meta: data.getMeta(), model: modelData }
      },
    }
    return inertia.render('admin/form_categories/index', props)
  }

  async create({ inertia }: HttpContext) {
    const lastCategory = await FormCategory.query().orderBy('sequence', 'desc').first()
    const nextSequence = (lastCategory?.sequence ?? 0) + 1
    return inertia.render('admin/form_categories/form', { nextSequence })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const data = await request.validateUsing(formCategoryAdminStoreValidator)
    const payload = {
      ...data,
      createdBy: auth.user?.id,
      updatedBy: auth.user?.id,
      status: Number(data.status),
    }
    await FormCategory.create(payload)
    session.flash('success', 'สร้างหมวดหมู่เรียบร้อย')
    return response.redirect().toRoute('admin.form_categories.index')
  }

  async show({ inertia, params }: HttpContext) {
    const model = await FormCategory.findOrFail(params.id)
    return inertia.render('admin/form_categories/form', { model: model.$attributes })
  }

  async edit({ inertia, params }: HttpContext) {
    const model = await FormCategory.findOrFail(params.id)
    return inertia.render('admin/form_categories/form', { model: model.$attributes })
  }
  async update({ params, request, response, auth, session }: HttpContext) {
    const model = await FormCategory.findOrFail(params.id)
    const data = await request.validateUsing(formCategoryAdminUpdateValidator)
    await model.merge({ ...data, updatedBy: auth.user?.id, status: Number(data.status) }).save()
    session.flash('success', 'แก้ไขหมวดหมู่เรียบร้อย')
    return response.redirect().toRoute('admin.form_categories.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const model = await FormCategory.findOrFail(params.id)
    const formSubject = await model.related('formSubjects').query().first()

    if (formSubject) {
      session.flash('error', 'This form category cannot be deleted because it has form subjects.')
      return response.redirect().toRoute('admin.form_categories.index')
    }

    // model.deletedBy = auth.user?.id
    // model.deletedAt = DateTime.fromJSDate(new Date())
    // await model.save()
    await model.delete()
    return response.redirect().toRoute('admin.form_categories.index')
  }
}
