import { urlFor } from '@adonisjs/core/services/url_builder';
import { PaginationLimits } from '#constants/index';
import UserGroup from '#models/user_group';
import UserGroupTransformer from '#transformers/user_group_transformer';
import { userGroupAdminStoreValidator, userGroupAdminUpdateValidator } from '#validators/user_group';
import auditing from '@filipebraida/adonis-auditing/services/main';
import UserGroupUser from '#models/user_group_user';
import User from '#models/user';
export default class UserGroupsController {
    async index({ request, inertia }) {
        const search = request.input('search', '');
        const status = request.input('status', '');
        const page = request.input('page', 1);
        const createUrl = urlFor('admin.user_groups.create');
        const props = {
            createUrl,
            filters: { search, status, page },
            data: async () => {
                const data = await UserGroup.query()
                    .withCount('users')
                    .if(search, (query) => query.whereILike('title', `%${search}%`))
                    .if(status, (query) => query.where('status', status))
                    .orderBy('id', 'desc')
                    .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE);
                data.baseUrl(urlFor('admin.user_groups.index'));
                data.queryString({
                    search: search || '',
                    status: status || '',
                });
                const modelData = UserGroupTransformer.transform(data).useVariant('forAdminObject');
                return { meta: data.getMeta(), model: modelData };
            },
        };
        return inertia.render('admin/user_groups/index', props);
    }
    async create({ inertia }) {
        const data = await this.getFormData();
        return inertia.render('admin/user_groups/form', { data, users: [] });
    }
    async store({ request, response, auth, session }) {
        const { title, description, status, users } = await request.validateUsing(userGroupAdminStoreValidator);
        const payload = {
            title,
            description,
            createdBy: auth.user?.id,
            updatedBy: auth.user?.id,
            status: Number(status),
        };
        const model = await UserGroup.create(payload);
        const userFullNames = await this.getUserFullNames(users);
        await model.auditCustom('created', {
            new: {
                users: JSON.stringify(users),
                userFullName: JSON.stringify(userFullNames),
            },
        });
        const baseUsers = { userGroupId: model.id };
        await auditing.withoutAuditing(async () => {
            await UserGroupUser.fetchOrCreateMany(['userGroupId', 'userId'], users.map((p) => ({
                ...baseUsers,
                userId: p,
            })));
        });
        session.flash('success', 'สร้างกลุ่มผู้ใช้งานเรียบร้อย');
        return response.redirect().toRoute('admin.user_groups.index');
    }
    async show({ inertia, params }) {
        const model = await UserGroup.findOrFail(params.id);
        const users = await this.getUsers(params.id);
        const data = await this.getFormData();
        return inertia.render('admin/user_groups/form', {
            data,
            model: model.$attributes,
            users: users,
        });
    }
    async edit({ inertia, params }) {
        const model = await UserGroup.findOrFail(params.id);
        const users = await this.getUsers(params.id);
        const data = await this.getFormData();
        return inertia.render('admin/user_groups/form', {
            data,
            model: model.$attributes,
            users: users,
        });
    }
    async update({ params, request, response, auth, session }) {
        const model = await UserGroup.findOrFail(params.id);
        const { title, description, status, users } = await request.validateUsing(userGroupAdminUpdateValidator);
        await model
            .merge({ title, description, updatedBy: auth.user?.id, status: Number(status) })
            .save();
        const previousUsers = await this.getUsers(model.id);
        const previousUserIds = previousUsers.map((e) => e.value);
        const previousUserFullNames = previousUsers.map((e) => e.label);
        const userFullNames = await this.getUserFullNames(users);
        await model.auditCustom('updated', {
            old: {
                users: JSON.stringify(previousUserIds),
                userFullName: JSON.stringify(previousUserFullNames),
            },
            new: {
                users: JSON.stringify(users),
                userFullName: JSON.stringify(userFullNames),
            },
        });
        const baseUsers = { userGroupId: model.id };
        await auditing.withoutAuditing(async () => {
            await UserGroupUser.query()
                .where('userGroupId', model.id)
                .whereNotIn('userId', users)
                .delete();
            await UserGroupUser.fetchOrCreateMany(['userGroupId', 'userId'], users.map((p) => ({
                ...baseUsers,
                userId: p,
            })));
        });
        session.flash('success', 'แก้ไขกลุ่มผู้ใช้งานเรียบร้อย');
        return response.redirect().toRoute('admin.user_groups.index');
    }
    async destroy({ params, response }) {
        const model = await UserGroup.findOrFail(params.id);
        const hasUsers = await UserGroupUser.query().where('user_group_id', model.id).first();
        if (hasUsers) {
            return response.status(422).send({
                message: 'Cannot delete a user group that still has assigned users.',
            });
        }
        await model.delete();
        return response.redirect().toRoute('admin.user_groups.index');
    }
    async getFormData() {
        const model = await User.query().orderBy('fullName').select('id', 'fullName');
        return {
            user_lists: model.map((e) => ({ label: e.fullName, value: e.id })),
        };
    }
    async getUsers(id) {
        const model = await UserGroupUser.query().where('user_group_id', id).preload('user');
        return model.map((e) => ({ label: e.user.fullName, value: e.user.id }));
    }
    async getUserFullNames(ids) {
        if (ids.length === 0)
            return [];
        const users = await User.query().whereIn('id', ids).select('id', 'fullName');
        const fullNameById = new Map(users.map((user) => [user.id, user.fullName]));
        return ids.map((id) => fullNameById.get(id) ?? null);
    }
}
//# sourceMappingURL=user_groups_controller.js.map