import { ComplaintFileSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Complaint from '#models/complaint'

export default class ComplaintFile extends ComplaintFileSchema {
  @belongsTo(() => Complaint)
  declare complaint: BelongsTo<typeof Complaint>
}
