import { UserModuleActionSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import UserModule from '#models/user_module'

export default class UserModuleAction extends UserModuleActionSchema {
  @belongsTo(() => UserModule)
  declare userModule: BelongsTo<typeof UserModule>
}
