import { BaseTransformer } from '@adonisjs/core/transformers'
import type FormSection from '#models/form_section'

export default class FormSectionTransformer extends BaseTransformer<FormSection> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }

  forAdminObject() {
    return {
      ...this.pick(this.resource, ['id', 'title']),
    }
  }
}
