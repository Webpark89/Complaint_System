import { type HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AdminService {
  constructor(protected ctx: HttpContext) {}

  get user() {
    return this.ctx.auth.user
  }

  async nav() {
    if (!this.user) return {}

    // console.log(this.user)

    const user = await User.findOrFail(this.user.id)
    // console.log(user.load('permissions'))
    return user.load('permissions')
  }
}
