// import { urlFor } from '@adonisjs/core/services/url_builder'
import { BaseTransformer } from '@adonisjs/core/transformers'
import type FormQuestion from '#models/form_question'
import { ActiveStatusTitle, getEnumByValue } from '#contracts/enum'
import FormSectionTransformer from '#transformers/form_section_transformer'

export default class FormQuestionTransformer extends BaseTransformer<FormQuestion> {
  toObject() {
    return this.pick(this.resource, ['id', 'title', 'hint', 'sequence', 'formSectionId', 'type'])
  }

  forAdminObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'title',
        'hint',
        'sequence',
        'formId',
        'formSectionId',
        'type',
      ]),
      form_section: FormSectionTransformer.transform(this.resource.formSection),
      status: getEnumByValue(ActiveStatusTitle, this.resource.status),
      status_id: this.resource.status,
      // view_url: urlFor('admin.form_categories.show', { id: this.resource.id }),
      // edit_url: urlFor('admin.form_categories.edit', { id: this.resource.id }),
      // delete_url: urlFor('admin.form_categories.destroy', { id: this.resource.id }),
    }
  }
}
