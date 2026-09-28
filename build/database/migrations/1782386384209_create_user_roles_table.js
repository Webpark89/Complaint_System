import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'user_roles';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('title').notNullable();
            table.string('description').notNullable();
            table.tinyint('status').notNullable();
            table.timestamp('created_at').notNullable();
            table.integer('created_by').notNullable();
            table.timestamp('updated_at').nullable();
            table.integer('updated_by').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782386384209_create_user_roles_table.js.map