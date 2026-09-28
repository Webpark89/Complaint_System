import { AuditSchema } from '#database/schema'
// import type { BelongsTo } from '@adonisjs/lucid/types/relations'
// import User from '#models/user'
// import { belongsTo } from '@adonisjs/lucid/orm'

export default class Audit extends AuditSchema {
  //   @belongsTo(() => User, {
  //     foreignKey: 'userId',
  //   })
  //   declare createdUser: BelongsTo<typeof User>
}
