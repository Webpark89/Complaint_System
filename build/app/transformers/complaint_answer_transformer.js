import { BaseTransformer } from '@adonisjs/core/transformers';
import FormQuestionTransformer from '#transformers/form_question_transformer';
export default class ComplaintAnswerTransformer extends BaseTransformer {
    toObject() {
        return {
            ...this.pick(this.resource, [
                'id',
                'answerDatetime',
                'answerText',
            ]),
            Question: FormQuestionTransformer.transform(this.whenLoaded(this.resource.question)),
        };
    }
}
//# sourceMappingURL=complaint_answer_transformer.js.map