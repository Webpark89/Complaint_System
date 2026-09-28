import { ComplaintTrackingSchema } from '#database/schema'
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import { withAuditTitles, type AuditTitleRelation } from '#mixins/auditable_with_titles'
import Complaint from '#models/complaint'
import UserGroup from '#models/user_group'
import User from '#models/user'

export default class ComplaintTracking extends compose(
  ComplaintTrackingSchema,
  Auditable,
  withAuditTitles
) {
  static auditTitleRelations: AuditTitleRelation[] = [
    {
      foreignKey: 'complaintId',
      relatedModel: () => import('#models/complaint'),
      titleColumn: 'code',
      titleKey: 'complaintCode',
    },
    {
      foreignKey: 'createdBy',
      relatedModel: () => import('#models/user'),
      titleColumn: 'fullName',
      titleKey: 'createdByName',
    },
    {
      foreignKey: 'updatedBy',
      relatedModel: () => import('#models/user'),
      titleColumn: 'fullName',
      titleKey: 'updatedByName',
    },
    {
      foreignKey: 'ownedBy',
      relatedModel: () => import('#models/user'),
      titleColumn: 'fullName',
      titleKey: 'ownedByName',
    },
  ]

  @belongsTo(() => Complaint)
  declare complaint: BelongsTo<typeof Complaint>

  @manyToMany(() => UserGroup, {
    pivotTable: 'complaint_tracking_user_groups',
    pivotForeignKey: 'complaint_tracking_id',
    pivotRelatedForeignKey: 'user_group_id',
  })
  declare userGroups: ManyToMany<typeof UserGroup>

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare createdUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'updatedBy',
  })
  declare updatedUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'ownedBy',
  })
  declare ownedUser: BelongsTo<typeof User>
}
