import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'sessions';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.string('id').primary();
            table.text('data').notNullable();
            table.string('user_id').nullable().index();
            table.timestamp('expires_at').notNullable().index();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1788512188574_create_sessions_table.js.map