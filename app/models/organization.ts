import { OrganizationSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import { withAuditTitles, type AuditTitleRelation } from '#mixins/auditable_with_titles'

export default class Organization extends compose(OrganizationSchema, Auditable, withAuditTitles) {
  static auditTitleRelations: AuditTitleRelation[] = [
    { foreignKey: 'parentOrganizationId', relatedModel: () => import('#models/organization') },
  ]

  @belongsTo(() => Organization, {
    localKey: 'id',
    foreignKey: 'parentOrganizationId',
  })
  declare parent: BelongsTo<typeof Organization>

  @belongsTo(() => Organization, {
    foreignKey: 'parentOrganizationId',
    onQuery: (query) => {
      query.preload('parent')
    },
  })
  declare grandParent: BelongsTo<typeof Organization>

  @hasMany(() => Organization, {
    localKey: 'id',
    foreignKey: 'parentOrganizationId',
  })
  declare children: HasMany<typeof Organization>
}
