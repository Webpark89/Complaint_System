import { BaseTransformer } from '@adonisjs/core/transformers'
import type ComplaintWitness from '#models/complaint_witness'

export default class ComplaintWitnessTransformer extends BaseTransformer<ComplaintWitness> {
  toObject() {
    return this.pick(this.resource, ['id', 'fullName', 'telephone'])
  }
}
