import { FormSubjectSchema } from '#database/schema'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import { withAuditTitles, type AuditTitleRelation } from '#mixins/auditable_with_titles'
import FormCategory from '#models/form_category'
import Complaint from '#models/complaint'
import UserGroup from '#models/user_group'

export default class FormSubject extends compose(FormSubjectSchema, Auditable, withAuditTitles) {
  static auditTitleRelations: AuditTitleRelation[] = [
    { foreignKey: 'formCategoryId', relatedModel: () => import('#models/form_category') },
  ]

  @belongsTo(() => FormCategory)
  declare formCategory: BelongsTo<typeof FormCategory>

  @hasMany(() => Complaint)
  declare complaints: HasMany<typeof Complaint>

  @manyToMany(() => UserGroup, {
    pivotTable: 'form_subject_user_groups', // Pivot table name
    pivotForeignKey: 'form_subject_id', // Key for this model in pivot table
    pivotRelatedForeignKey: 'user_group_id', // Key for target model in pivot table
    onQuery: (query) => query.where('form_subject_user_groups.step', 1),
  })
  declare userGroups1: ManyToMany<typeof UserGroup>

  @manyToMany(() => UserGroup, {
    pivotTable: 'form_subject_user_groups',
    pivotForeignKey: 'form_subject_id',
    pivotRelatedForeignKey: 'user_group_id',
    onQuery: (query) => query.where('form_subject_user_groups.step', 2),
  })
  declare userGroups2: ManyToMany<typeof UserGroup>

  @manyToMany(() => UserGroup, {
    pivotTable: 'form_subject_user_groups',
    pivotForeignKey: 'form_subject_id',
    pivotRelatedForeignKey: 'user_group_id',
    onQuery: (query) => query.where('form_subject_user_groups.step', 25),
  })
  declare userGroups2S: ManyToMany<typeof UserGroup>

  @manyToMany(() => UserGroup, {
    pivotTable: 'form_subject_user_groups',
    pivotForeignKey: 'form_subject_id',
    pivotRelatedForeignKey: 'user_group_id',
    onQuery: (query) => query.where('form_subject_user_groups.step', 3),
  })
  declare userGroups3: ManyToMany<typeof UserGroup>

  @manyToMany(() => UserGroup, {
    pivotTable: 'form_subject_user_groups',
    pivotForeignKey: 'form_subject_id',
    pivotRelatedForeignKey: 'user_group_id',
    onQuery: (query) => query.where('form_subject_user_groups.step', 4),
  })
  declare userGroups4: ManyToMany<typeof UserGroup>
}
