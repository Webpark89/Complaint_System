import { BaseTransformer } from '@adonisjs/core/transformers'
import { urlFor } from '@adonisjs/core/services/url_builder'
import type Form from '#models/form'
import FormCategoryTransformer from '#transformers/form_category_transformer'
import { ActiveStatusTitle, getEnumByValue } from '#contracts/enum'
import FormQuestionTransformer from '#transformers/form_question_transformer'

export default class FormTransformer extends BaseTransformer<Form> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id']),
      form_category: this.resource.formCategory
        ? FormCategoryTransformer.transform(this.resource.formCategory)
        : null,
      questions: FormQuestionTransformer.transform(this.resource.formQuestions),
    }
  }

  forAdminObject() {
    return {
      ...this.pick(this.resource, ['id', 'formCategoryId', 'title', 'version', 'updatedAt']),
      form_category: this.resource.formCategory
        ? FormCategoryTransformer.transform(this.resource.formCategory)
        : null,
      status: getEnumByValue(ActiveStatusTitle, this.resource.status),
      status_id: this.resource.status,
      view_url: urlFor('admin.forms.show', { id: this.resource.id }),
      edit_url: urlFor('admin.forms.edit', { id: this.resource.id }),
      delete_url: urlFor('admin.forms.destroy', { id: this.resource.id }),
    }
  }
}
