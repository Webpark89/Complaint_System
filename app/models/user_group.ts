import { UserGroupSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
// import UserGroupUser from '#models/user_group_user'
import User from '#models/user'

export default class UserGroup extends compose(UserGroupSchema, Auditable) {
  // @hasMany(() => UserGroupUser, {
  //   localKey: 'id',
  //   foreignKey: 'userGroupId',
  // })
  // declare users: HasMany<typeof UserGroupUser>

  @manyToMany(() => User, {
    pivotTable: 'user_group_users',
    pivotForeignKey: 'user_group_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof User>
  // @hasManyThrough([() => User, () => UserGroupUser], {
  //   localKey: 'userGroupId',
  //   foreignKey: 'id',
  //   throughForeignKey: 'id',
  //   throughLocalKey: 'userId',
  // })
  // declare user: HasManyThrough<typeof User>
}
