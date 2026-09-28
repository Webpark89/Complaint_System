import vine from '@vinejs/vine'
import { ActiveStatus, getEnumValueAsString } from '#contracts/enum'

export const userGroupAdminStoreValidator = vine.create({
  title: vine
    .string()
    .maxLength(250)
    .unique({ table: 'user_groups', column: 'title', caseInsensitive: true }),
  description: vine.string(),
  status: vine.enum(getEnumValueAsString(ActiveStatus)),
  users: vine.array(vine.number()).notEmpty(),
})

export const userGroupAdminUpdateValidator = vine.create({
  title: vine
    .string()
    .maxLength(250)
    .unique({
      table: 'user_groups',
      column: 'title',
      caseInsensitive: true,
      filter: (db, _value, field) => {
        db.whereNot('id', field.data.params.id)
      },
    }),
  description: vine.string(),
  status: vine.enum(getEnumValueAsString(ActiveStatus)),
  users: vine.array(vine.number()).notEmpty(),
})
