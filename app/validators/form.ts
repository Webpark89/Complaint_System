import vine from '@vinejs/vine'
import { ActiveStatus, getEnumValueAsString } from '#contracts/enum'

const formAdminFormFields = {
  form_category_id: vine.number().exists({ table: 'form_categories', column: 'id' }),
  title: vine.string().maxLength(250),
  status: vine.enum(getEnumValueAsString(ActiveStatus)),
  questions: vine
    .array(
      vine.object({
        id: vine.number().nullable(),
        type: vine.enum(['string', 'text', 'date', 'datetime']),
        title: vine.string().maxLength(250),
        hint: vine.string().maxLength(250),
        sequence: vine.number().nonNegative().withoutDecimals(),
      })
    )
    .optional(),
}

export const formAdminFormValidator = vine.create({
  ...formAdminFormFields,
  version: vine
    .string()
    .regex(/^[1-9][0-9]*$/)
    .maxLength(250)
    .unique({
      table: 'forms',
      column: 'version',
      filter: (db, _value, field) => {
        db.where('form_category_id', field.data.form_category_id).where('title', field.data.title)
      },
    }),
})

export const formAdminFormUpdateValidator = vine.create({
  ...formAdminFormFields,
  version: vine
    .string()
    .regex(/^[1-9][0-9]*$/)
    .maxLength(250)
    .unique({
      table: 'forms',
      column: 'version',
      filter: (db, _value, field) => {
        db.where('form_category_id', field.data.form_category_id)
          .where('title', field.data.title)
          .whereNot('id', field.data.params.id)
      },
    }),
})
