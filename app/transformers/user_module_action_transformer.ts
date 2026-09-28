import { BaseTransformer } from '@adonisjs/core/transformers'
import type UserModuleAction from '#models/user_module_action'

export default class UserModuleActionTransformer extends BaseTransformer<UserModuleAction> {
  toObject() {
    return this.pick(this.resource, ['id', 'userModuleId', 'action', 'code'])
  }
}
