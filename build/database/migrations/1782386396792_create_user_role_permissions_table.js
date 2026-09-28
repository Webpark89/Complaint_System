import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'user_role_permissions';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .integer('user_role_id')
                .unsigned()
                .notNullable()
                .references('user_roles.id')
                .onDelete('CASCADE')
                .index();
            table
                .integer('user_module_action_id')
                .unsigned()
                .nullable()
                .references('user_module_actions.id')
                .onDelete('SET NULL')
                .index();
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782386396792_create_user_role_permissions_table.js.map