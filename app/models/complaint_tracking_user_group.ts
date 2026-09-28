import { ComplaintTrackingUserGroupSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import ComplaintTracking from '#models/complaint_tracking'
import * as relations from '@adonisjs/lucid/types/relations'

export default class ComplaintTrackingUserGroup extends ComplaintTrackingUserGroupSchema {
  @belongsTo(() => ComplaintTracking)
  declare complaintTracking: relations.BelongsTo<typeof ComplaintTracking>
}
