import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { userModules } from '../data/user_module.js'
import UserModule from '#models/user_module'
import UserModuleAction from '#models/user_module_action'

export default class extends BaseSeeder {
  async run() {
    await this.#createUserModule()
  }

  async #createUserModule() {
    let index = 0
    for (const element of userModules) {
      const { actions, children, ...item } = element
      index++
      const userModule = await UserModule.create({
        parentModuleId: 0,
        ...item,
      })
      if (element.actions) {
        let actionIndex = 1
        for (const action of element.actions) {
          const actionPayload =
            typeof action === 'object' && action !== null ? action : { name: action }
          await UserModuleAction.create({
            userModuleId: userModule.id,
            sequence: actionIndex,
            ...actionPayload,
          })
          actionIndex++
        }
      }
      if (element.children) {
        for (const child of element.children) {
          const { actions: childActions, ...childItem } = child
          const userModuleChild = await UserModule.create({
            parentModuleId: userModule.id,
            ...childItem,
          })
          if (childActions) {
            let actionIndex = 1
            for (const action of childActions) {
              const actionPayload =
                typeof action === 'object' && action !== null ? action : { name: action }
              await UserModuleAction.create({
                userModuleId: userModuleChild.id,
                sequence: actionIndex,
                ...actionPayload,
              })
              actionIndex++
            }
          }
        }
      }
    }
  }
}
