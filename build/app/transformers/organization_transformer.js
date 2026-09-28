import { urlFor } from '@adonisjs/core/services/url_builder';
import { BaseTransformer } from '@adonisjs/core/transformers';
import { ActiveStatusTitle, getEnumByValue, OrganizationTypeTitle } from '#contracts/enum';
export default class OrganizationTransformer extends BaseTransformer {
    toObject() {
        return this.pick(this.resource, ['id', 'title']);
    }
    forAdminObject() {
        return {
            ...this.pick(this.resource, ['id', 'code', 'title']),
            children_count: this.resource.$extras.children_count,
            can_delete: Number(this.resource.$extras.children_count ?? 0) === 0,
            parent: OrganizationTransformer.transform(this.resource.parent),
            type: getEnumByValue(OrganizationTypeTitle, this.resource.type),
            status: getEnumByValue(ActiveStatusTitle, this.resource.status),
            status_id: this.resource.status,
            view_url: urlFor('admin.organizations.show', { id: this.resource.id }),
            edit_url: urlFor('admin.organizations.edit', { id: this.resource.id }),
            delete_url: urlFor('admin.organizations.destroy', { id: this.resource.id }),
        };
    }
}
//# sourceMappingURL=organization_transformer.js.map