import { BaseTransformer } from '@adonisjs/core/transformers'
import type ComplaintAnswer from '#models/complaint_answer'
import FormQuestionTransformer from '#transformers/form_question_transformer'

export default class ComplaintAnswerTransformer extends BaseTransformer<ComplaintAnswer> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'answerDatetime',
        'answerText',
        // 'complaintId',
        // 'createdAt',
        // 'formQuestionId',
      ]),
      Question: FormQuestionTransformer.transform(this.whenLoaded(this.resource.question)),
    }
  }
}
