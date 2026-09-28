import User from '#models/user'
import { type Infer } from '@vinejs/vine/types'
import { type userListSearchValidator } from '#validators/user'
import UserRole from '#models/user_role'
import UserGroupUser from '#models/user_group_user'
import { ActiveStatus } from '#contracts/enum'

// type UserFilter = {
//   id: string
//   search: string
// }

export class UserService {
  static find(id: Number) {
    return User.findOrFail(id)
  }

  static list(filter: Infer<typeof userListSearchValidator>) {
    return User.query()
      .if(filter.status, (q) => q.where('status', filter.status!))
      .if(filter.search, (q) =>
        q.where('full_name', `%${filter.search}%`).orWhere('email', `%${filter.search}%`)
      )
      .preload('userRole')
      .orderBy('id', 'desc')
  }

  static async listUserRole() {
    const roles = await UserRole.query().orderBy('title')
    return { roles }
  }

  static async listUserGroupIds(user_id: number) {
    const userGroupsData = await UserGroupUser.query()
      .whereHas('userGroup', (q) => q.where('status', ActiveStatus.ACTIVE))
      .where('user_id', user_id)
      .select('user_group_id')
    return userGroupsData?.flatMap((e: any) => e.userGroupId) || []
  }
}
