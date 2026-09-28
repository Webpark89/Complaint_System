import vine from '@vinejs/vine'

export const complaintStatusTrackingValidator = vine.create({
  complaintCode: vine.string(),
})
