import { urlFor } from '@adonisjs/core/services/url_builder';
import { PaginationLimits } from '#constants/index';
import UserRoleTransformer from '#transformers/user_role_transformer';
import UserRole from '#models/user_role';
import { userRoleAdminStoreValidator, userRoleAdminUpdateValidator } from '#validators/user_role';
import UserModule from '#models/user_module';
import UserModuleTransformer from '#transformers/user_module_transformer';
import UserRolePermission from '#models/user_role_permission';
import auditing from '@filipebraida/adonis-auditing/services/main';
import UserModuleAction from '#models/user_module_action';
import { ActiveStatus } from '#contracts/enum';
export default class UserRolesController {
    async index({ request, inertia }) {
        const search = request.input('search', '');
        const status = request.input('status', '');
        const page = request.input('page', 1);
        const createUrl = urlFor('admin.user_roles.create');
        const props = {
            createUrl,
            filters: { search, status, page },
            data: async () => {
                const data = await UserRole.query()
                    .withCount('users')
                    .if(search, (query) => query.whereILike('title', `%${search}%`))
                    .if(status, (query) => query.where('status', status))
                    .orderBy('id', 'desc')
                    .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE);
                data.baseUrl(urlFor('admin.user_roles.index'));
                data.queryString({
                    search: search || '',
                    status: status || '',
                });
                const modelData = UserRoleTransformer.transform(data).useVariant('forAdminObject');
                return { meta: data.getMeta(), model: modelData };
            },
        };
        return inertia.render('admin/user_roles/index', props);
    }
    async create({ inertia }) {
        const data = await this.getFormData();
        return inertia.render('admin/user_roles/form', { data });
    }
    async store({ request, response, auth, session }) {
        const { title, description, status, permissions } = await request.validateUsing(userRoleAdminStoreValidator);
        const payload = {
            title,
            description,
            createdBy: auth.user?.id,
            updatedBy: auth.user?.id,
            status: Number(status),
        };
        const model = await UserRole.create(payload);
        const permissionTitles = await this.getPermissionTitles(permissions);
        await model.auditCustom('permissions', {
            new: {
                permissions: JSON.stringify(permissions),
                permissionTitles: JSON.stringify(permissionTitles),
            },
        });
        const basePermission = { userRoleId: model.id };
        await auditing.withoutAuditing(async () => {
            await UserRolePermission.fetchOrCreateMany(['userRoleId', 'userModuleActionId'], permissions.map((p) => ({
                ...basePermission,
                userModuleActionId: p,
            })));
        });
        session.flash('success', 'สร้างบทบาทผู้ใช้งานเรียบร้อย');
        return response.redirect().toRoute('admin.user_roles.index');
    }
    async show({ inertia, params }) {
        const model = await UserRole.findOrFail(params.id);
        const permissions = await this.getPermissions(params.id);
        const data = await this.getFormData();
        return inertia.render('admin/user_roles/form', {
            data,
            model: model.$attributes,
            permissions: permissions,
        });
    }
    async edit({ inertia, params }) {
        const model = await UserRole.findOrFail(params.id);
        const permissions = await this.getPermissions(params.id);
        const data = await this.getFormData();
        return inertia.render('admin/user_roles/form', {
            data,
            model: model.$attributes,
            permissions: permissions,
        });
    }
    async update({ params, request, response, auth, session }) {
        const model = await UserRole.findOrFail(params.id);
        const { title, description, status, permissions } = await request.validateUsing(userRoleAdminUpdateValidator);
        const oldPermissions = await this.getPermissions(model.id);
        const oldPermissionTitles = await this.getPermissionTitles(oldPermissions);
        const newPermissionTitles = await this.getPermissionTitles(permissions);
        await model
            .merge({ title, description, updatedBy: auth.user?.id, status: Number(status) })
            .save();
        await model.auditCustom('permissions', {
            old: {
                permissions: JSON.stringify(oldPermissions),
                permissionTitles: JSON.stringify(oldPermissionTitles),
            },
            new: {
                permissions: JSON.stringify(permissions),
                permissionTitles: JSON.stringify(newPermissionTitles),
            },
        });
        const basePermission = { userRoleId: model.id };
        await auditing.withoutAuditing(async () => {
            await UserRolePermission.query()
                .where('userRoleId', model.id)
                .whereNotIn('userModuleActionId', permissions)
                .delete();
            await UserRolePermission.fetchOrCreateMany(['userRoleId', 'userModuleActionId'], permissions.map((p) => ({
                ...basePermission,
                userModuleActionId: p,
            })));
        });
        session.flash('success', 'แก้ไขบทบาทผู้ใช้งานเรียบร้อย');
        return response.redirect().toRoute('admin.user_roles.index');
    }
    async destroy({ params, response }) {
        const model = await UserRole.findOrFail(params.id);
        const hasUsers = await model.related('users').query().first();
        if (hasUsers) {
            return response.status(422).send({
                message: 'Cannot delete a user role that still has assigned users.',
            });
        }
        await model.delete();
        return response.redirect().toRoute('admin.user_roles.index');
    }
    async getFormData() {
        const model = await UserModule.query()
            .preload('userModuleActions')
            .where('status', ActiveStatus.ACTIVE)
            .orderBy('sequence')
            .orderBy('title');
        return {
            module_actions: UserModuleTransformer.transform(model).useVariant('forAdminRoleObject'),
        };
    }
    async getPermissions(id) {
        const model = await UserRolePermission.query()
            .where('user_role_id', id)
            .select('user_module_action_id');
        return model.map((e) => e.$attributes.userModuleActionId);
    }
    async getPermissionTitles(ids) {
        if (!ids.length)
            return '';
        const permissions = await UserModuleAction.query()
            .whereIn('id', ids)
            .preload('userModule')
            .orderBy('id');
        const grouped = new Map();
        for (const permission of permissions) {
            const moduleTitle = permission.userModule?.title ?? 'Unknown';
            const action = permission.action;
            const existing = grouped.get(moduleTitle) ?? [];
            existing.push(action);
            grouped.set(moduleTitle, existing);
        }
        return [...grouped.entries()].map(([moduleTitle, actions]) => {
            const uniqueActions = [...new Set(actions)].sort();
            return `${moduleTitle} (${uniqueActions.join('/')})`;
        });
    }
}
//# sourceMappingURL=user_roles_controller.js.map