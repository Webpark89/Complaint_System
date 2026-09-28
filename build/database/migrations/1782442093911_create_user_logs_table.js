import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'user_logs';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('user_id').unsigned().nullable().references('users.id').onDelete('SET NULL');
            table.string('module').notNullable();
            table.string('action').notNullable();
            table.string('ip_public').notNullable();
            table.string('ip_local').notNullable();
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782442093911_create_user_logs_table.js.map