import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { organizations } from '../data/organization.js';
import Organization from '#models/organization';
export default class extends BaseSeeder {
    async run() {
        await this.#createOrganization();
    }
    async #createOrganization() {
        await Organization.createMany(organizations);
    }
}
//# sourceMappingURL=organization_seeder.js.map