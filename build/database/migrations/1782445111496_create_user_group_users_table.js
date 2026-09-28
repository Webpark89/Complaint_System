import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'user_group_users';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('user_group_id').unsigned().references('user_groups.id').onDelete('CASCADE');
            table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
            table.unique(['user_group_id', 'user_id']);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782445111496_create_user_group_users_table.js.map