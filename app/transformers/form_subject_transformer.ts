import { urlFor } from '@adonisjs/core/services/url_builder'
import { BaseTransformer } from '@adonisjs/core/transformers'
import type FormSubject from '#models/form_subject'
import FormCategoryTransformer from '#transformers/form_category_transformer'
import { ActiveStatusTitle, getEnumByValue } from '#contracts/enum'
import UserGroupTransformer from '#transformers/user_group_transformer'

export default class FormSubjectTransformer extends BaseTransformer<FormSubject> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'formCategoryId',
        'title',
        'subTitle',
        'description',
        'isOther',
        'sequence',
      ]),
      FormCategory: this.resource.formCategory
        ? FormCategoryTransformer.transform(this.resource.formCategory)
        : null,
    }
  }

  forAdminObject() {
    const userGroupVariant = 'forAdminFormSubjectUserGroupObject'
    return {
      ...this.pick(this.resource, [
        'id',
        'formCategoryId',
        'title',
        'subTitle',
        'description',
        'isOther',
        'sequence',
      ]),
      form_category: this.resource.formCategory
        ? FormCategoryTransformer.transform(this.resource.formCategory)
        : null,
      user_groups_1: this.resource.userGroups1
        ? UserGroupTransformer.transform(this.resource.userGroups1).useVariant(userGroupVariant)
        : null,
      user_groups_2: this.resource.userGroups2
        ? UserGroupTransformer.transform(this.resource.userGroups2).useVariant(userGroupVariant)
        : null,
      user_groups_2S: this.resource.userGroups2S
        ? UserGroupTransformer.transform(this.resource.userGroups2S).useVariant(userGroupVariant)
        : null,
      user_groups_3: this.resource.userGroups3
        ? UserGroupTransformer.transform(this.resource.userGroups3).useVariant(userGroupVariant)
        : null,
      user_groups_4: this.resource.userGroups4
        ? UserGroupTransformer.transform(this.resource.userGroups4).useVariant(userGroupVariant)
        : null,
      status: getEnumByValue(ActiveStatusTitle, this.resource.status),
      status_id: this.resource.status,
      complaints_count: this.resource.$extras.complaints_count ?? 0,
      view_url: urlFor('admin.form_subjects.show', { id: this.resource.id }),
      edit_url: urlFor('admin.form_subjects.edit', { id: this.resource.id }),
      delete_url: urlFor('admin.form_subjects.destroy', { id: this.resource.id }),
    }
  }
}
