import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import { withAuditTitles, type AuditTitleRelation } from '#mixins/auditable_with_titles'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { belongsTo, hasManyThrough } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasManyThrough } from '@adonisjs/lucid/types/relations'
import UserRole from '#models/user_role'
import UserRolePermission from '#models/user_role_permission'
import Organization from '#models/organization'

export default class User extends compose(
  UserSchema,
  withAuthFinder(hash),
  Auditable,
  withAuditTitles
) {
  static auditTitleRelations: AuditTitleRelation[] = [
    { foreignKey: 'userRoleId', relatedModel: () => import('#models/user_role') },
    { foreignKey: 'organizationId', relatedModel: () => import('#models/organization') },
  ]

  @belongsTo(() => UserRole)
  declare userRole: BelongsTo<typeof UserRole>

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @hasManyThrough([() => UserRolePermission, () => UserRole], {
    localKey: 'userRoleId',
    foreignKey: 'id',
  })
  declare permissions: HasManyThrough<typeof UserRolePermission>
}
