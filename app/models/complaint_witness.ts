import { ComplaintWitnessSchema } from '#database/schema'
import { afterFetch, afterFind, beforeSave, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import encryption from '@adonisjs/core/services/encryption'
import Complaint from '#models/complaint'

export default class ComplaintWitness extends ComplaintWitnessSchema {
  @belongsTo(() => Complaint)
  declare complaint: BelongsTo<typeof Complaint>

  @beforeSave()
  public static async encryptSensitiveData(data: ComplaintWitness) {
    if (data.$dirty.fullName) {
      data.fullName = encryption.encrypt(data.fullName)
    }
    if (data.$dirty.telephone) {
      data.telephone = encryption.encrypt(data.telephone)
    }
  }

  public static async decryptSensitiveFields(data: ComplaintWitness) {
    if (data.fullName) {
      data.fullName = encryption.decrypt(data.fullName) || data.fullName
    }
    if (data.telephone) {
      data.telephone = encryption.decrypt(data.telephone) || data.telephone
    }
  }

  @afterFetch()
  public static async decryptSensitiveData(data: ComplaintWitness[]) {
    data.forEach((e) => this.decryptSensitiveFields(e))
  }

  @afterFind()
  public static async decryptSensitiveDataSingle(data: ComplaintWitness | null) {
    if (data) {
      this.decryptSensitiveFields(data)
    }
  }
}
