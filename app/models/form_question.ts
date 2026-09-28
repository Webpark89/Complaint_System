import { FormQuestionSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import { withAuditTitles, type AuditTitleRelation } from '#mixins/auditable_with_titles'
import Form from '#models/form'
import FormSection from '#models/form_section'

export default class FormQuestion extends compose(FormQuestionSchema, Auditable, withAuditTitles) {
  static auditTitleRelations: AuditTitleRelation[] = [
    { foreignKey: 'formId', relatedModel: () => import('#models/form') },
    { foreignKey: 'formSectionId', relatedModel: () => import('#models/form_section') },
  ]

  @belongsTo(() => Form)
  declare form: BelongsTo<typeof Form>

  @belongsTo(() => FormSection)
  declare formSection: BelongsTo<typeof FormSection>
}
