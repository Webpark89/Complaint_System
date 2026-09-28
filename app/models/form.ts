import { FormSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import { withAuditTitles, type AuditTitleRelation } from '#mixins/auditable_with_titles'

import FormCategory from '#models/form_category'
import FormQuestion from '#models/form_question'
export default class Form extends compose(FormSchema, Auditable, withAuditTitles) {
  static auditTitleRelations: AuditTitleRelation[] = [
    { foreignKey: 'formCategoryId', relatedModel: () => import('#models/form_category') },
  ]

  @belongsTo(() => FormCategory)
  declare formCategory: BelongsTo<typeof FormCategory>

  @hasMany(() => FormQuestion)
  declare formQuestions: HasMany<typeof FormQuestion>
}
