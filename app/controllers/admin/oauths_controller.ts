type HttpContextContract = any
import { errors as authErrors } from '@adonisjs/auth'
import User from '#models/user'
import { Audit } from '@filipebraida/adonis-auditing'
import { DateTime } from 'luxon'
import { ActiveStatus } from '../../contracts/enum.ts'

export default class OauthsController {
  async redirect({ ally }: HttpContextContract) {
    return ally.use('google').redirect()
  }

  async callback({ ally, auth, response, session }: HttpContextContract) {
    let email = ''
    try {
      const google = ally.use('google')
      if (google.accessDenied()) {
        return response.abort('Access was denied')
      }

      if (google.stateMisMatch()) {
        return response.abort('Request expired. Retry again')
      }

      if (google.hasError()) {
        return response.abort(google.getError())
      }

      const gUser = await google.user()
      email = gUser.email
      const user = await User.verifyCredentials(gUser.email, 'google')
      if (user.$attributes.status !== ActiveStatus.ACTIVE) throw authErrors.E_INVALID_CREDENTIALS
      await auth.use('admin').login(user)
      await user.auditCustom('login', {
        new: { email: email },
        tags: ['authen', 'authen_success'],
        metadata: { status: 'success' },
      })
      await user.withoutAudit(async () => {
        user.loginAt = DateTime.now()
        await user.save()
      })
      // User Id is null
      await Audit.query()
        .where('auditable_type', 'User')
        .where('auditable_id', user.id)
        .where('event', 'login')
        .where('user_id', '')
        .update({ user_id: user.id })

      response.redirect().withQs(false).toRoute('admin.dashboard')
    } catch (error: any) {
      // console.log({ error: error.response })

      const user = await User.findBy('email', email)
      if (user) {
        await user.auditCustom('login_attempt', {
          new: { email: email },
          tags: ['authen', 'authen_fail'],
          metadata: { status: 'fail' },
        })
      } else {
        await Audit.create({
          event: 'login_attempt',
          auditableType: 'User',
          auditableId: 0,
          newValues: { email: email },
          tags: ['authen', 'authen_fail'],
          metadata: { status: 'fail' },
        })
      }
      session.flash('errors.E_INVALID_CREDENTIALS', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS || authErrors.E_INVALID_CREDENTIALS) {
        return response.redirect().withQs(false).toRoute('admin.login')
      }
      throw error
    }
  }
}
