import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'organizations';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.string('code').nullable();
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('code');
        });
    }
}
//# sourceMappingURL=1788938046747_alter_organizations_table.js.map