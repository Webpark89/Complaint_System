import type { HttpContext } from '@adonisjs/core/http'
import Config, { ConfigID } from '#models/config'
import { configTermAdminFormValidator, configTermFileAdminFormValidator } from '#validators/config'
import { ConfigService } from '#services/config_service'
import { randomUUID } from 'node:crypto'
import drive from '@adonisjs/drive/services/main'

export default class TermsController {
  async index({ inertia }: HttpContext) {
    const model = await ConfigService.getConfigTerm()

    return inertia.render('admin/terms/index', { model })
  }

  async store({ request, response, auth }: HttpContext) {
    const model = await Config.findOrFail(ConfigID.ID_TERM_PDPA_FILE)
    const { file } = await request.validateUsing(configTermFileAdminFormValidator)
    let filename = model.value
    if (file) {
      if (model.$attributes.value) {
        try {
          await drive.use('fs').delete(model.$attributes.value.replace('/uploads/', ''))
        } catch {}
      }
      filename = `pdpa_file-${randomUUID()}.${file.extname}`
      await drive.use('fs').moveFromFs(file.tmpPath!, `files/${filename}`)
      await model.merge({ value: `/uploads/files/${filename}`, updatedBy: auth.user?.id }).save()
    }

    return response.redirect().toRoute('admin.terms.index')
  }

  async update({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(configTermAdminFormValidator)
    const modelTerm = await Config.findOrFail(ConfigID.ID_TERM)
    modelTerm.merge({ value: data.term, updatedBy: auth.user?.id }).save()
    const modelPDPA = await Config.findOrFail(ConfigID.ID_TERM_PDPA)
    modelPDPA.merge({ value: data.pdpa, updatedBy: auth.user?.id }).save()
    return response.redirect().toRoute('admin.terms.index')
  }
}
