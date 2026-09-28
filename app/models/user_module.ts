import { UserModuleSchema } from '#database/schema'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { hasMany, hasOne } from '@adonisjs/lucid/orm'
import UserModuleAction from '#models/user_module_action'

export default class UserModule extends UserModuleSchema {
  @hasMany(() => UserModuleAction)
  declare userModuleActions: HasMany<typeof UserModuleAction>

  @hasOne(() => UserModule, {
    localKey: 'parentModuleId',
    foreignKey: 'id',
  })
  declare parentModule: HasOne<typeof UserModule>

  @hasMany(() => UserModule, {
    localKey: 'id',
    foreignKey: 'parentModuleId',
  })
  declare children: HasMany<typeof UserModule>
}
