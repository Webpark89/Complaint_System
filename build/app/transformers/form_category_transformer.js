import { urlFor } from '@adonisjs/core/services/url_builder';
import { BaseTransformer } from '@adonisjs/core/transformers';
import { ActiveStatusTitle, getEnumByValue } from '#contracts/enum';
import FormSubjectTransformer from '#transformers/form_subject_transformer';
export default class FormCategoryTransformer extends BaseTransformer {
    toObject() {
        return {
            ...this.pick(this.resource, ['id', 'title', 'subTitle', 'description', 'sequence']),
            form_subjects: FormSubjectTransformer.transform(this.resource.formSubjects),
        };
    }
    forAdminObject() {
        return {
            ...this.pick(this.resource, ['id', 'title', 'subTitle', 'description', 'sequence']),
            form_subjects_count: this.resource.$extras.formSubjects_count,
            status: getEnumByValue(ActiveStatusTitle, this.resource.status),
            status_id: this.resource.status,
            view_url: urlFor('admin.form_categories.show', { id: this.resource.id }),
            edit_url: urlFor('admin.form_categories.edit', { id: this.resource.id }),
            delete_url: urlFor('admin.form_categories.destroy', { id: this.resource.id }),
        };
    }
}
//# sourceMappingURL=form_category_transformer.js.map