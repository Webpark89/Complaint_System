import vine from '@vinejs/vine'
import {
  requiredIfAsyncRule,
  emailIfMissingRule,
  telephoneIfMissingRule,
  requiredIfMissingRule,
} from '#validators/app_rules'
import { ApproveStatus, ComplaintStatus, getEnumValue, getEnumValueAsString } from '#contracts/enum'

export const complaintConsentValidator = vine.create({
  consent: vine.accepted(),
})

const complaintCategoryValidatorSchema = vine.object({
  title: vine.string().trim().minLength(1).maxLength(20),
  formCategoryId: vine.number().exists({ table: 'form_categories', column: 'id' }),
  formSubjectId: vine.number().exists({ table: 'form_subjects', column: 'id' }),
  formSubjectOther: vine
    .string()
    .maxLength(250)
    .optional()
    .use(
      requiredIfAsyncRule({
        table: 'form_subjects',
        searchColumn: 'id',
        searchColumnFieldName: 'formSubjectId',
        column: 'is_other',
        columnValue: true,
      })
    ),
})

export const complaintFormIncidentValidatorSchema = vine.object({
  incidentDate: vine.date({ formats: ['DD/MM/YYYY', 'iso8601'] }).beforeOrEqual('today'),
  incidentTime: vine.date({ formats: ['HH:mm'] }),
  organizationId: vine.number().exists({ table: 'organizations', column: 'id' }),
  hasWitness: vine.boolean(),
  witnesses: vine
    .array(
      vine.object({
        name: vine.string().minLength(1).maxLength(30),
        phone: vine.string().regex(new RegExp('^0[0-9]{8,9}$')),
      })
    )
    .optional()
    .requiredWhen((field) => {
      if (field.parent.hasWitness !== true) {
        return false
      }
      return true
      // return field.report('The value is required', 'is_required', field)
    }),
  // witnessFullName: vine
  //   .string()
  //   .maxLength(250)
  //   .optional()
  //   .requiredWhen((field) => {
  //     if (field.parent.hasWitness !== true) {
  //       return false
  //     }
  //     return field.report('The value is required', 'is_required', field)
  //   }),
  // witnessTelephone: vine
  //   .string()
  //   .regex(new RegExp('^0[0-9]{8,9}$'))
  //   //.maxLength(10)
  //   .optional()
  //   .requiredWhen((field) => {
  //     if (field.parent.hasWitness !== true) {
  //       return false
  //     }
  //     return field.report('The value is required', 'is_required', field)
  //   }),
  detail: vine.string().maxLength(3000).optional(),
  files: vine.array(vine.string()),
  mimes: vine.array(vine.string()),
  // files: vine
  //   .array(
  //     vine.file({
  //       size: '100mb',
  //       // extnames: ['pdf'],
  //     })
  //   )
  //   .maxLength(5),
})

const complaintFormComplainantValidatorSchema = vine.object({
  isAnonymous: vine.boolean().optional(),
  complainantFullName: vine
    .string()
    .maxLength(30)
    .optional()
    .use(requiredIfMissingRule({ fieldName: 'isAnonymous' })),
  complainantEmail: vine
    .string()
    .maxLength(100)
    .optional()
    .use(emailIfMissingRule({ fieldName: 'isAnonymous' })),
  // .requiredIfMissing('isAnonymous'),

  complainantTelephone: vine
    .string()
    .optional()
    .use(telephoneIfMissingRule({ fieldName: 'isAnonymous' })),
  // .requiredIfMissing('isAnonymous'),
})

export const complaintCategoryValidator = vine.create(complaintCategoryValidatorSchema)

export const complaintFormIncidentValidator = vine.create(complaintFormIncidentValidatorSchema)

const complaintFileUploadValidatorSchema = vine.object({
  // files: vine
  //   .array(
  //     vine.file({
  //       size: '100mb',
  //       // extnames: ['pdf'],
  //     })
  //   )
  //   .maxLength(5),
  files: vine.file({
    size: '1gb',
    extnames: [
      'pdf',
      'docx',
      'doc',
      'xls',
      'xlsx',
      'png',
      'jpg',
      'jpeg',
      'mp4',
      'mov',
      'mp3',
      'wav',
      'flac',
      'aac',
      'alac',
      'm4a',
    ],
  }),
})

export const complaintFileUploadValidator = vine.create(complaintFileUploadValidatorSchema)

export const complaintAdminFileUploadValidator = vine.create(
  vine.object({
    files: vine.file({
      size: '1gb',
      extnames: [
        'pdf',
        'docx',
        'doc',
        'png',
        'jpg',
        'jpeg',
        'mp4',
        'mov',
        'xlsx',
        'xls',
        'zip',
        'mp3',
        'wav',
        'flac',
        'aac',
        'alac',
        'm4a',
      ],
    }),
  })
)

export const complaintFormComplainantValidator = vine.create(
  complaintFormComplainantValidatorSchema
)

export const complaintFormConfirmValidator = vine.create(
  vine.object({
    // ...complaintCategoryValidatorSchema.getProperties(),
    // ...complaintFormIncidentValidatorSchema.getProperties(),
    // ...complaintFormComplaintantValidatorSchema.getProperties(),
    confirm: vine.accepted(),
  })
)

export const complaintAdminFormValidator = vine.create({
  isSensitive: vine.boolean().optional(),
  isComplex: vine.boolean().optional(),
  isExtendDueDate: vine.boolean().optional(),
  isExtendDueDateApprove: vine.boolean().optional(),
  userGroups: vine.array(vine.number()).optional(),
  status: vine.number().in(getEnumValue(ComplaintStatus)),
  approveStatus: vine.enum(getEnumValueAsString(ApproveStatus)).optional(),
  remark: vine.string().maxLength(100000).optional(),
  detail: vine.string().maxLength(100000).optional(),
  summary: vine.string().maxLength(100000).optional(),
  file_1: vine.string().optional(),
  file_2: vine.string().optional(),
  file_3: vine.string().optional(),
  file_4: vine.string().optional(),
  file_5: vine.string().optional(),
  mime_1: vine.string().optional(),
  mime_2: vine.string().optional(),
  mime_3: vine.string().optional(),
  mime_4: vine.string().optional(),
  mime_5: vine.string().optional(),
})

export const complaintTrackingExtendAdminFormValidator = vine.create({
  approveStatus: vine.enum(getEnumValueAsString(ApproveStatus)).optional(),
  remark: vine.string().optional(),
})

export const complaintTrackingFrontValidator = vine.create({
  code: vine.string().minLength(12).maxLength(12).exists({ table: 'complaints', column: 'code' }),
})

// export const complaintConfirm
