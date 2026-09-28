import vine from '@vinejs/vine'
import { ActiveStatus, getEnumValueAsString } from '#contracts/enum'

const formSubjectFields = {
  form_category_id: vine.number().exists({ table: 'form_categories', column: 'id' }),
  sub_title: vine.string().maxLength(250),
  description: vine.string().optional(),
  is_other: vine.boolean(),
  status: vine.enum(getEnumValueAsString(ActiveStatus)),
  userGroups1: vine.array(vine.number().exists({ table: 'user_groups', column: 'id' })),
  userGroups2: vine.array(vine.number().exists({ table: 'user_groups', column: 'id' })),
  userGroups2S: vine.array(vine.number().exists({ table: 'user_groups', column: 'id' })),
  userGroups3: vine.array(vine.number().exists({ table: 'user_groups', column: 'id' })),
  userGroups4: vine.array(vine.number().exists({ table: 'user_groups', column: 'id' })),
}

export const formSubjectAdminStoreValidator = vine.create({
  ...formSubjectFields,
  title: vine
    .string()
    .maxLength(250)
    .unique({
      table: 'form_subjects',
      column: 'title',
      caseInsensitive: true,
      filter: (db, _value, field) => {
        db.where('form_category_id', field.data.form_category_id)
      },
    }),
  sequence: vine
    .number()
    .nonNegative()
    .withoutDecimals()
    .max(2000000000)
    .unique({
      table: 'form_subjects',
      column: 'sequence',
      filter: (db, _value, field) => {
        db.where('form_category_id', field.data.form_category_id)
      },
    })
    .optional(),
})

export const formSubjectAdminUpdateValidator = vine.create({
  ...formSubjectFields,
  title: vine
    .string()
    .maxLength(250)
    .unique({
      table: 'form_subjects',
      column: 'title',
      caseInsensitive: true,
      filter: (db, _value, field) => {
        db.where('form_category_id', field.data.form_category_id).whereNot(
          'id',
          field.data.params.id
        )
      },
    }),
  sequence: vine
    .number()
    .nonNegative()
    .withoutDecimals()
    .max(2000000000)
    .unique({
      table: 'form_subjects',
      column: 'sequence',
      filter: (db, _value, field) => {
        db.where('form_category_id', field.data.form_category_id).whereNot(
          'id',
          field.data.params.id
        )
      },
    }),
})
