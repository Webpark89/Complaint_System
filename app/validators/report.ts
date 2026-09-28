import vine from '@vinejs/vine'

export const reportDateValidator = vine.create({
  //   page: vine.number().optional(),
  from: vine
    .date({ formats: ['YYYY-MM-DD'] })
    // .beforeOrEqual('today')
    .parse((value) => (value === '' || value === null ? undefined : value))
    .optional(),
  to: vine
    .date({ formats: ['YYYY-MM-DD'] })
    // .beforeOrEqual('today')
    .parse((value) => (value === '' || value === null ? undefined : value))
    .optional(),
})
