import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'users';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').notNullable();
            table.integer('user_role_id').unsigned().notNullable().references('user_roles.id');
            table
                .integer('organization_id')
                .unsigned()
                .nullable()
                .references('organizations.id')
                .onDelete('SET NULL');
            table.string('full_name').nullable();
            table.string('email', 254).notNullable().unique();
            table.string('password').notNullable();
            table.timestamp('login_at').nullable();
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
//# sourceMappingURL=1782386384210_create_users_table.js.map