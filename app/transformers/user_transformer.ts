import { urlFor } from '@adonisjs/core/services/url_builder'
import { BaseTransformer } from '@adonisjs/core/transformers'
import type User from '#models/user'
import { ActiveStatusTitle, getEnumByValue } from '#contracts/enum'
import OrganizationTransformer from '#transformers/organization_transformer'
import UserRoleTransformer from '#transformers/user_role_transformer'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'fullName',
      'email',
      'createdAt',
      'updatedAt',
      'loginAt',
    ])
  }

  forAdminObject() {
    return {
      ...this.pick(this.resource, ['id', 'fullName', 'email', 'loginAt']),
      organization: OrganizationTransformer.transform(this.resource.organization),
      role: UserRoleTransformer.transform(this.resource.userRole),
      status: getEnumByValue(ActiveStatusTitle, this.resource.status),
      status_id: this.resource.status,
      view_url: urlFor('admin.users.show', { id: this.resource.id }),
      edit_url: urlFor('admin.users.edit', { id: this.resource.id }),
      delete_url: urlFor('admin.users.destroy', { id: this.resource.id }),
    }
  }

  forAdminUserGroupObject() {
    return {
      ...this.pick(this.resource, ['id', 'fullName', 'email']),
    }
  }

  forAdminComplaintObject() {
    return {
      ...this.pick(this.resource, ['id', 'fullName', 'email']),
      organization: OrganizationTransformer.transform(this.whenLoaded(this.resource.organization)),
    }
  }
}
