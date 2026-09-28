import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { userRoles, users, userGroups } from '../data/user.js'
import UserRole from '#models/user_role'
import User from '#models/user'
import UserModuleAction from '#models/user_module_action'
import UserRolePermission from '#models/user_role_permission'
import { ActiveStatus } from '#contracts/enum'
import UserGroup from '#models/user_group'

export default class extends BaseSeeder {
  async run() {
    await this.#createUser()
  }

  async #createUser() {
    await UserRole.createMany(userRoles)
    await User.createMany(users)

    const actions = await UserModuleAction.query().select('id')

    for (const role of userRoles) {
      await UserRolePermission.createMany(
        (actions as Array<{ id: number }>).map((e) => ({
          user_role_id: role.id,
          user_module_action_id: e.id,
        })) as any
      )
    }

    const baseUserGroups = { status: ActiveStatus.ACTIVE, createdBy: 0, updatedBy: 0 }
    await UserGroup.createMany(
      userGroups.map((e) => ({
        title: e.title,
        description: e.title,
        ...baseUserGroups,
      }))
    )
  }
}
