import User from '#models/user';
import { ComplaintService } from '#services/complaint_service';
import { ActiveStatus } from "../contracts/enum.js";
const mapPermission = {
    index: 'view',
    show: 'view',
    create: 'create',
    store: 'create',
    edit: 'edit',
    update: 'edit',
    destroy: 'delete',
    export: 'export',
};
export default class AdminAuthMiddleware {
    redirectTo = '/process/login';
    async handle({ auth, route, inertia, response }, next) {
        await auth.authenticateUsing(['admin'], { loginRoute: this.redirectTo });
        const authUser = auth.getUserOrFail();
        const currentRoute = route?.name || '';
        const currentModule = route?.tokens[1]?.val;
        const currentAction = currentRoute.split('.').pop() || undefined;
        const currentPermission = currentAction
            ? (mapPermission[currentAction] ?? 'view')
            : undefined;
        let currentModulePermission = [];
        let hasPermission = false;
        const user = await User.query()
            .where('id', authUser.id)
            .where('status', ActiveStatus.ACTIVE)
            .preload('userRole', (q) => {
            q.where('status', ActiveStatus.ACTIVE);
        })
            .preload('permissions', (permissionQ) => {
            permissionQ
                .orderBy('user_module_action_id')
                .preload('userModuleActions')
                .preload('userModules', (userModuleQ) => {
                userModuleQ.where('status', ActiveStatus.ACTIVE).preload('parentModule');
            });
        })
            .first();
        const permittedModules = new Set(user?.permissions
            .filter((permission) => permission.userModuleActions.code === 'view')
            .flatMap((permission) => permission.userModules.map((module) => module.module)) ?? []);
        const canViewSensitiveComplaints = permittedModules.has('complaint_sensitive');
        const [complaintCount, sensitiveComplaintCount, complaintExtendCount] = await Promise.all([
            permittedModules.has('complaint')
                ? ComplaintService.getAdminComplaintCount(false, authUser)
                : Promise.resolve(0),
            canViewSensitiveComplaints
                ? ComplaintService.getAdminComplaintCount(true, authUser)
                : Promise.resolve(0),
            ComplaintService.getAdminComplaintExtendCount(authUser),
        ]);
        let menu = [];
        let previous = {};
        user?.permissions.map((e) => {
            e.userModules.forEach((m) => {
                if (m.module === currentModule) {
                    currentModulePermission.push(e.userModuleActions.code);
                    if (currentPermission === e.userModuleActions.code) {
                        hasPermission = true;
                    }
                }
                if (m.id === previous.id) {
                    const existingItem = menu[m.parentModule.id]?.children.find((child) => child.module === m.module);
                    existingItem?.actions.push(e.userModuleActions.code);
                    if (m.module === 'complaint')
                        existingItem.count = complaintCount;
                    if (m.module === 'complaint_sensitive')
                        existingItem.count = sensitiveComplaintCount;
                    if (m.module === 'complaint_extend') {
                        existingItem.count = complaintExtendCount;
                    }
                    return;
                }
                previous = m;
                const item = {
                    actions: [e.userModuleActions.code],
                    ...m.$attributes,
                };
                if (m.module === 'complaint_extend') {
                    item.count = complaintExtendCount;
                }
                if (m.module === 'complaint')
                    item.count = complaintCount;
                if (m.module === 'complaint_sensitive')
                    item.count = sensitiveComplaintCount;
                if (m.parentModule !== null) {
                    if (menu[m.parentModule.id] !== undefined) {
                        const existingItem = menu[m.parentModule.id].children.find((child) => child.module === item.module);
                        if (existingItem) {
                            existingItem.actions.push(e.userModuleActions.code);
                            if (m.module === 'complaint')
                                existingItem.count = complaintCount;
                            if (m.module === 'complaint_sensitive')
                                existingItem.count = sensitiveComplaintCount;
                            if (m.module === 'complaint_extend') {
                                existingItem.count = complaintExtendCount;
                            }
                        }
                        else {
                            menu[m.parentModule.id].children.push(item);
                        }
                    }
                    else {
                        menu[m.parentModule.id] = {
                            ...m.parentModule.$attributes,
                            children: [item],
                        };
                    }
                }
            });
        });
        const userRoleTitle = Array.isArray(user?.$preloaded.userRole)
            ? (user.$preloaded.userRole[0]?.$attributes?.title ?? '')
            : (user?.$preloaded.userRole?.$attributes?.title ?? '');
        inertia.share({
            adminMenu: menu,
            userRole: userRoleTitle,
            currentModulePermission: currentModulePermission,
            currentModuleActionHasPermission: hasPermission,
        });
        if (['create', 'edit', 'delete', 'export'].includes(currentPermission ?? '') &&
            !hasPermission) {
            return response.status(403).send('Forbidden');
        }
        return next();
    }
}
//# sourceMappingURL=admin_auth_middleware.js.map