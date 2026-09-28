import { BaseTransformer } from '@adonisjs/core/transformers';
import { urlFor } from '@adonisjs/core/services/url_builder';
import { ActiveStatusTitle, getEnumByValue } from '#contracts/enum';
export default class UserGroupTransformer extends BaseTransformer {
    toObject() {
        return this.pick(this.resource, ['id', 'title']);
    }
    forAdminObject() {
        return {
            ...this.pick(this.resource, ['id', 'title', 'description']),
            users_count: this.resource.$extras.users_count,
            status: getEnumByValue(ActiveStatusTitle, this.resource.status),
            status_id: this.resource.status,
            view_url: urlFor('admin.user_groups.show', { id: this.resource.id }),
            edit_url: urlFor('admin.user_groups.edit', { id: this.resource.id }),
            delete_url: urlFor('admin.user_groups.destroy', { id: this.resource.id }),
        };
    }
    forAdminFormSubjectUserGroupObject() {
        return {
            label: this.resource.title,
            value: this.resource.id,
        };
    }
}
//# sourceMappingURL=user_group_transformer.js.map