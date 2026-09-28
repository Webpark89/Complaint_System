import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { configs } from '../data/config.js'
import Config from '#models/config'

export default class extends BaseSeeder {
  async run() {
    await this.#createConfig()
  }

  async #createConfig() {
    await Config.createMany(configs)
  }
}
