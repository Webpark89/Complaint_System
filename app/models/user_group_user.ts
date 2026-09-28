import { UserGroupUserSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import { withAuditTitles, type AuditTitleRelation } from '#mixins/auditable_with_titles'
import UserGroup from '#models/user_group'
import User from '#models/user'

export default class UserGroupUser extends compose(
  UserGroupUserSchema,
  Auditable,
  withAuditTitles
) {
  static auditTitleRelations: AuditTitleRelation[] = [
    { foreignKey: 'userGroupId', relatedModel: () => import('#models/user_group') },
    { foreignKey: 'userId', relatedModel: () => import('#models/user'), titleColumn: 'fullName' },
  ]

  @belongsTo(() => UserGroup, {
    localKey: 'id',
    foreignKey: 'userGroupId',
  })
  declare userGroup: BelongsTo<typeof UserGroup>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>
}
