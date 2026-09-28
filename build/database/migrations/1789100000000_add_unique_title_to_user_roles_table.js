import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'user_roles';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.unique(['title']);
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropUnique(['title']);
        });
    }
}
//# sourceMappingURL=1789100000000_add_unique_title_to_user_roles_table.js.map