import { BaseTransformer } from '@adonisjs/core/transformers';
import { urlFor } from '@adonisjs/core/services/url_builder';
import { ActiveStatusTitle, getEnumByValue } from '#contracts/enum';
export default class UserRoleTransformer extends BaseTransformer {
    toObject() {
        return this.pick(this.resource, ['id', 'title']);
    }
    forAdminObject() {
        return {
            ...this.pick(this.resource, ['id', 'title', 'description']),
            users_count: this.resource.$extras.users_count,
            status: getEnumByValue(ActiveStatusTitle, this.resource.status),
            status_id: this.resource.status,
            view_url: urlFor('admin.user_roles.show', { id: this.resource.id }),
            edit_url: urlFor('admin.user_roles.edit', { id: this.resource.id }),
            delete_url: urlFor('admin.user_roles.destroy', { id: this.resource.id }),
        };
    }
}
//# sourceMappingURL=user_role_transformer.js.map