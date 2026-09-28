import User from '#models/user';
import UserRole from '#models/user_role';
import UserGroupUser from '#models/user_group_user';
import { ActiveStatus } from '#contracts/enum';
export class UserService {
    static find(id) {
        return User.findOrFail(id);
    }
    static list(filter) {
        return User.query()
            .if(filter.status, (q) => q.where('status', filter.status))
            .if(filter.search, (q) => q.where('full_name', `%${filter.search}%`).orWhere('email', `%${filter.search}%`))
            .preload('userRole')
            .orderBy('id', 'desc');
    }
    static async listUserRole() {
        const roles = await UserRole.query().orderBy('title');
        return { roles };
    }
    static async listUserGroupIds(user_id) {
        const userGroupsData = await UserGroupUser.query()
            .whereHas('userGroup', (q) => q.where('status', ActiveStatus.ACTIVE))
            .where('user_id', user_id)
            .select('user_group_id');
        return userGroupsData?.flatMap((e) => e.userGroupId) || [];
    }
}
//# sourceMappingURL=user_service.js.map