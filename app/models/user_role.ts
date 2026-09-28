import { UserRoleSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import User from '#models/user'
import UserRolePermission from '#models/user_role_permission'

export default class UserRole extends compose(UserRoleSchema, Auditable) {
  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => UserRolePermission)
  declare userRolePermissions: HasMany<typeof UserRolePermission>
}
