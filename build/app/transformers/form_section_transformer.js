import { BaseTransformer } from '@adonisjs/core/transformers';
export default class FormSectionTransformer extends BaseTransformer {
    toObject() {
        return this.pick(this.resource, ['id']);
    }
    forAdminObject() {
        return {
            ...this.pick(this.resource, ['id', 'title']),
        };
    }
}
//# sourceMappingURL=form_section_transformer.js.map