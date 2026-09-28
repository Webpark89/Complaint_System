import { BaseTransformer } from '@adonisjs/core/transformers'
import { urlFor } from '@adonisjs/core/services/url_builder'
import type UserModule from '#models/user_module'
import UserModuleActionTransformer from '#transformers/user_module_action_transformer'
import { ActiveStatusTitle, getEnumByValue } from '#contracts/enum'

export default class UserModuleTransformer extends BaseTransformer<UserModule> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }
  forAdminRoleObject() {
    return {
      ...this.pick(this.resource, ['id', 'title', 'mode', 'module']),
      actions: this.resource.userModuleActions
        ? UserModuleActionTransformer.transform(this.resource.userModuleActions)
        : [],
      children: this.resource.children
        ? UserModuleTransformer.transform(this.resource.children).useVariant('forAdminRoleObject')
        : [],
    }
  }
  forAdminObject() {
    return {
      ...this.pick(this.resource, ['id', 'title', 'mode']),
      actions: this.resource.userModuleActions
        ? UserModuleActionTransformer.transform(this.resource.userModuleActions)
        : [],
      status: getEnumByValue(ActiveStatusTitle, this.resource.status),
      status_id: this.resource.status,
      view_url: urlFor('admin.user_roles.show', { id: this.resource.id }),
      edit_url: urlFor('admin.user_roles.edit', { id: this.resource.id }),
      delete_url: urlFor('admin.user_roles.destroy', { id: this.resource.id }),
    }
  }
}
