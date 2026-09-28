import { UserRolePermissionSchema } from '#database/schema'
import { belongsTo, hasManyThrough } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasManyThrough } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import { withAuditTitles, type AuditTitleRelation } from '#mixins/auditable_with_titles'
import UserRole from '#models/user_role'
import UserModuleAction from '#models/user_module_action'
import UserModule from '#models/user_module'

export default class UserRolePermission extends compose(
  UserRolePermissionSchema,
  Auditable,
  withAuditTitles
) {
  static auditTitleRelations: AuditTitleRelation[] = [
    { foreignKey: 'userRoleId', relatedModel: () => import('#models/user_role') },
    {
      foreignKey: 'userModuleActionId',
      relatedModel: () => import('#models/user_module_action'),
      titleColumn: 'action',
    },
  ]

  @belongsTo(() => UserRole)
  declare userRole: BelongsTo<typeof UserRole>

  @belongsTo(() => UserModuleAction)
  declare userModuleActions: BelongsTo<typeof UserModuleAction>

  @hasManyThrough([() => UserModule, () => UserModuleAction], {
    localKey: 'userModuleActionId',
    foreignKey: 'id',
    throughForeignKey: 'id',
    throughLocalKey: 'userModuleId',
  })
  declare userModules: HasManyThrough<typeof UserModule>
}
