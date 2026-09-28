import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'users';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.unique(['full_name']);
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropUnique(['full_name']);
        });
    }
}
//# sourceMappingURL=1789000000000_add_unique_full_name_to_users_table.js.map