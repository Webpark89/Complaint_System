import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'complaints';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.string('title', 20).notNullable().defaultTo('');
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('title');
        });
    }
}
//# sourceMappingURL=1789300000000_add_title_to_complaints_table.js.map