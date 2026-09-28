import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'user_module_actions';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .integer('user_module_id')
                .unsigned()
                .nullable()
                .references('user_modules.id')
                .onDelete('SET NULL')
                .index();
            table.string('action').notNullable();
            table.string('code').notNullable();
            table.tinyint('sequence').notNullable();
            table.timestamp('created_at');
            table.timestamp('updated_at');
            table.index(['user_module_id', 'sequence']);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782341444960_create_user_module_actions_table.js.map