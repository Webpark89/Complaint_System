import { urlFor } from '@adonisjs/core/services/url_builder';
import { PaginationLimits } from '#constants/index';
import Organization from '#models/organization';
import OrganizationTransformer from '#transformers/organization_transformer';
import { organizationStoreValidator, organizationUpdateValidator } from '#validators/organization';
import { getEnumKeyValueWithCustomTitle, OrganizationTypeTitle, } from '#contracts/enum';
export default class OrganizationsController {
    async index({ request, inertia }) {
        const search = request.input('search', '');
        const status = request.input('status', '');
        const page = request.input('page', 1);
        const createUrl = urlFor('admin.organizations.create');
        const props = {
            createUrl,
            filters: { search, status, page },
            data: async () => {
                const data = await Organization.query()
                    .withCount('children')
                    .preload('parent')
                    .if(search, (query) => query.whereILike('title', `%${search}%`).orWhereHas('parent', (parentQuery) => {
                    parentQuery.whereILike('title', `%${search}%`);
                }))
                    .if(status, (query) => query.where('status', status))
                    .orderBy('id')
                    .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE);
                data.baseUrl(urlFor('admin.organizations.index'));
                data.queryString({
                    search: search || '',
                    status: status || '',
                });
                const modelData = OrganizationTransformer.transform(data).useVariant('forAdminObject');
                return { meta: data.getMeta(), model: modelData };
            },
        };
        return inertia.render('admin/organizations/index', props);
    }
    async create({ inertia }) {
        const data = await this.getFormData(0);
        return inertia.render('admin/organizations/form', { data });
    }
    async store({ request, response, auth, session }) {
        const data = await request.validateUsing(organizationStoreValidator);
        const payload = {
            ...data,
            createdBy: auth.user?.id,
            updatedBy: auth.user?.id,
            status: Number(data.status),
            parentOrganizationId: data.parent_organization_id
                ? Number(data.parent_organization_id)
                : null,
        };
        await Organization.create(payload);
        session.flash('success', 'สร้างหน่วยงานเรียบร้อย');
        return response.redirect().toRoute('admin.organizations.index');
    }
    async show({ inertia, params }) {
        const model = await Organization.findOrFail(params.id);
        const data = await this.getFormData(params.id);
        return inertia.render('admin/organizations/form', { data, model: model.$attributes });
    }
    async edit({ inertia, params }) {
        const model = await Organization.findOrFail(params.id);
        const data = await this.getFormData(params.id);
        return inertia.render('admin/organizations/form', { data, model: model.$attributes });
    }
    async update({ params, request, response, auth, session }) {
        const model = await Organization.findOrFail(params.id);
        const data = await request.validateUsing(organizationUpdateValidator);
        await model
            .merge({
            ...data,
            updatedBy: auth.user?.id,
            status: Number(data.status),
            parentOrganizationId: data.parent_organization_id
                ? Number(data.parent_organization_id)
                : null,
        })
            .save();
        session.flash('success', 'แก้ไขหน่วยงานเรียบร้อย');
        return response.redirect().toRoute('admin.organizations.index');
    }
    async destroy({ params, response, session }) {
        const model = await Organization.findOrFail(params.id);
        const child = await model.related('children').query().first();
        if (child) {
            session.flash('error', 'This organization cannot be deleted because it has child organizations.');
            return response.redirect().toRoute('admin.organizations.index');
        }
        await model.delete();
        return response.redirect().toRoute('admin.organizations.index');
    }
    async getFormData(myId) {
        const model = await Organization.query()
            .where('id', '<>', myId)
            .orderBy('title')
            .select('id', 'title');
        const types = getEnumKeyValueWithCustomTitle(OrganizationTypeTitle, 'label', 'value');
        return { types, parents: model.map((e) => ({ label: e.title, value: e.id })) };
    }
}
//# sourceMappingURL=organizations_controller.js.map