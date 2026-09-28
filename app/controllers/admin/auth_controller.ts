import type { HttpContext } from '@adonisjs/core/http'
// import User from '#models/user'

export default class AuthController {
  // async create({ inertia }: HttpContext) {
  //   return inertia.render('auth/login', {})
  // }

  async index({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  // async store({ auth, request, response }: HttpContext) {
  //   const { email } = request.all()
  //   const user = await User.verifyCredentials(email, 'google')
  //   await user.auditCustom('login', { metadata: { status: 'success' } })
  //   await auth.use('admin').login(user)

  //   response.redirect().toRoute('admin.dashboard')
  // }

  async logout({ auth, request, response }: HttpContext) {
    // console.log(auth.user)
    await auth.user?.auditCustom('logout', {
      new: { email: auth.user.email },
      tags: ['authen'],
      metadata: { status: 'success' },
    })
    // console.log('logout')
    await auth.use('admin').logout()
    if (request.header('referer', '')?.includes('/process')) {
      return response.redirect().toRoute('admin.login')
    }
    return response.redirect().back()
  }
}
