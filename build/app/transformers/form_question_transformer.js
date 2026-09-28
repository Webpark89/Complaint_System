import { BaseTransformer } from '@adonisjs/core/transformers';
import { ActiveStatusTitle, getEnumByValue } from '#contracts/enum';
import FormSectionTransformer from '#transformers/form_section_transformer';
export default class FormQuestionTransformer extends BaseTransformer {
    toObject() {
        return this.pick(this.resource, ['id', 'title', 'hint', 'sequence', 'formSectionId', 'type']);
    }
    forAdminObject() {
        return {
            ...this.pick(this.resource, [
                'id',
                'title',
                'hint',
                'sequence',
                'formId',
                'formSectionId',
                'type',
            ]),
            form_section: FormSectionTransformer.transform(this.resource.formSection),
            status: getEnumByValue(ActiveStatusTitle, this.resource.status),
            status_id: this.resource.status,
        };
    }
}
//# sourceMappingURL=form_question_transformer.js.map