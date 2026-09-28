import vine from '@vinejs/vine'

export const complaintSubjectValidator = vine.create({
  formCategoryId: vine.number(),
  formSubjectId: vine.number(),
})
