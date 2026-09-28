import { ComplaintSchema } from '#database/schema'
import {
  afterFetch,
  afterFind,
  beforeCreate,
  beforeSave,
  belongsTo,
  hasMany,
  hasOne,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import encryption from '@adonisjs/core/services/encryption'
import Form from '#models/form'
import ComplaintAnswer from '#models/complaint_answer'
import ComplaintTracking from '#models/complaint_tracking'
import ComplaintFile from '#models/complaint_file'
import ComplaintWitness from '#models/complaint_witness'
import FormCategory from '#models/form_category'
import FormSubject from '#models/form_subject'
import Organization from '#models/organization'
import User from '#models/user'

export default class Complaint extends ComplaintSchema {
  @belongsTo(() => FormCategory)
  declare formCategory: BelongsTo<typeof FormCategory>

  @belongsTo(() => FormSubject)
  declare formSubject: BelongsTo<typeof FormSubject>

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @belongsTo(() => Form)
  declare form: BelongsTo<typeof Form>

  // @belongsTo(() => User, {
  //   foreignKey: 'createdBy',
  // })
  // declare createdUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'updatedBy',
  })
  declare updatedUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'ownedBy',
  })
  declare ownedUser: BelongsTo<typeof User>

  @hasMany(() => ComplaintAnswer)
  declare complaintAnswers: HasMany<typeof ComplaintAnswer>

  @hasMany(() => ComplaintFile)
  declare complaintFiles: HasMany<typeof ComplaintFile>

  @hasMany(() => ComplaintWitness)
  declare complaintWitnesses: HasMany<typeof ComplaintWitness>

  @hasMany(() => ComplaintTracking)
  declare complaintTrackings: HasMany<typeof ComplaintTracking>

  @hasOne(() => ComplaintTracking, {
    onQuery: (query) => query.orderBy('id', 'desc'),
  })
  declare complaintTrackingLast: HasOne<typeof ComplaintTracking>

  @beforeCreate()
  static async generateCode(complaint: Complaint) {
    let uniqueCode = this.randomCode(8, 'CMP-')
    let exists = await Complaint.findBy('code', uniqueCode)
    while (exists) {
      uniqueCode = this.randomCode(8, 'CMP-')
      exists = await Complaint.findBy('code', uniqueCode)
    }
    complaint.code = uniqueCode
  }

  private static randomCode(length: number, prefix: string): string {
    const chars = '346789ABCDEFGHJKMNPQRTUVWXY' //0,O,1,I,L,2,Z,5,S
    let result = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      result += chars.charAt(randomIndex)
    }
    return `${prefix}${result}`
  }

  @beforeSave()
  public static async encryptSensitiveData(data: Complaint) {
    if (data.$dirty.detail) {
      data.detail = encryption.encrypt(data.detail)
    }
    if (data.$dirty.complainantFullName) {
      data.complainantFullName = encryption.encrypt(data.complainantFullName)
    }
    if (data.$dirty.complainantEmail) {
      data.complainantEmail = encryption.encrypt(data.complainantEmail)
    }
    if (data.$dirty.complainantTelephone) {
      data.complainantTelephone = encryption.encrypt(data.complainantTelephone)
    }
  }

  private static decryptSensitiveFields(data: Complaint) {
    if (data.detail) {
      data.detail = encryption.decrypt(data.detail) || data.detail
    }
    if (data.complainantFullName) {
      data.complainantFullName =
        encryption.decrypt(data.complainantFullName) || data.complainantFullName
    }
    if (data.complainantEmail) {
      data.complainantEmail = encryption.decrypt(data.complainantEmail) || data.complainantEmail
    }
    if (data.complainantTelephone) {
      data.complainantTelephone =
        encryption.decrypt(data.complainantTelephone) || data.complainantTelephone
    }
  }

  @afterFetch()
  public static async decryptSensitiveData(data: Complaint[]) {
    data.forEach((e) => this.decryptSensitiveFields(e))
  }

  @afterFind()
  public static async decryptSensitiveDataSingle(data: Complaint | null) {
    if (data) {
      this.decryptSensitiveFields(data)
    }
  }
}
