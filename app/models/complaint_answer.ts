import { ComplaintAnswerSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Complaint from '#models/complaint'
import FormQuestion from '#models/form_question'

export default class ComplaintAnswer extends ComplaintAnswerSchema {
  @belongsTo(() => Complaint)
  declare complaint: BelongsTo<typeof Complaint>

  @belongsTo(() => FormQuestion, {
    foreignKey: 'formQuestionId',
  })
  declare question: BelongsTo<typeof FormQuestion>
}
