import type { HttpContext } from '@adonisjs/core/http'
import { userStoreValidator, userUpdateValidator } from '#validators/user'
// import { UserService } from '#services/user_service'
import User from '#models/user'
import { urlFor } from '@adonisjs/core/services/url_builder'
import { PaginationLimits } from '#constants/index'
import UserTransformer from '#transformers/user_transformer'
import UserRole from '#models/user_role'
import Organization from '#models/organization'
// import { dataTableSearchValidator } from '#validators/app_validators'

export default class UsersController {
  async index({ request, inertia }: HttpContext): Promise<any> {
    // const f = await request.validateUsing(dataTableSearchValidator)
    const search = request.input('search', '')
    const status = request.input('status', '')
    const page = request.input('page', 1)
    const createUrl = urlFor('admin.users.create')

    const props = {
      createUrl,
      filters: { search, status, page },
      data: async () => {
        const data = await User.query()
          .preload('userRole')
          .preload('organization')
          .if(search, (query) =>
            query.whereILike('email', `%${search}%`).orWhereILike('fullName', `%${search}%`)
          )
          .if(status, (query) => query.where('status', status))
          .orderBy('id', 'desc')
          .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE)
        data.baseUrl(urlFor('admin.users.index'))
        data.queryString({
          search: search || '',
          status: status || '',
        })
        const modelData = UserTransformer.transform(data).useVariant('forAdminObject')
        return { meta: data.getMeta(), model: modelData }
      },
    }
    return inertia.render('admin/users/index', props)
  }

  async create({ inertia }: HttpContext) {
    const data = await this.getFormData()
    return inertia.render('admin/users/form', { data })
  }

  async store({ auth, request, response, session }: HttpContext) {
    const { email, ...data } = await request.validateUsing(userStoreValidator)
    const payload = {
      ...data,
      email: email.toLowerCase(),
      password: 'google',
      createdBy: auth.user?.id,
      updatedBy: auth.user?.id,
      status: Number(data.status),
    }
    await User.create(payload)
    session.flash('success', 'สร้างข้อมูลผู้ใช้งานเรียบร้อย')
    return response.redirect().toRoute('admin.users.index')
  }

  async show({ inertia, params }: HttpContext) {
    const model = await User.findOrFail(params.id)
    const data = await this.getFormData()
    return inertia.render('admin/users/form', { data, model: model.$attributes })
  }

  async edit({ inertia, params }: HttpContext) {
    const model = await User.findOrFail(params.id)
    const data = await this.getFormData()
    return inertia.render('admin/users/form', { data, model: model.$attributes })
  }

  async update({ auth, params, request, response, session }: HttpContext) {
    const model = await User.findOrFail(params.id)
    const { email, ...data } = await request.validateUsing(userUpdateValidator)
    await model
      .merge({
        ...data,
        email: email.toLowerCase(),
        updatedBy: auth.user?.id,
        status: Number(data.status),
      })
      .save()
    session.flash('success', 'แก้ไขข้อมูลผู้ใช้งานเรียบร้อย')
    return response.redirect().toRoute('admin.users.index')
  }

  async destroy({ params, response }: HttpContext) {
    const model = await User.findOrFail(params.id)
    // model.deletedBy = auth.user?.id
    // model.deletedAt = DateTime.fromJSDate(new Date())
    // await model.save()
    await model.delete()
    return response.redirect().toRoute('admin.users.index')
  }

  async getFormData() {
    const organizations = await Organization.query()
      .preload('parent')
      // .orderBy('parent_organization_id')
      .orderByRaw('parent_organization_id ASC NULLS FIRST')
      .orderBy('id')
      .select('id', 'type', 'parent_organization_id', 'title')
    const roles = await UserRole.query().orderBy('title').select('id', 'title')

    return {
      roles: roles.map((e: any) => ({ label: e.title, value: e.id })),
      organizations: organizations.map((e: any) => ({
        label: e.title,
        value: e.id,
        group: e.parent?.title,
      })),
    }
  }
}
