import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'user_modules';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('module').notNullable().index();
            table.integer('parent_module_id').unsigned().index();
            table.string('title').notNullable();
            table.string('icon').notNullable();
            table.string('url').notNullable();
            table.string('slug').notNullable();
            table.string('css_class').notNullable();
            table.integer('sequence').notNullable().index();
            table.tinyint('status').notNullable();
            table.enum('mode', ['SINGLE', 'CHILD', 'PARENT']).notNullable();
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
            table.index(['parent_module_id', 'sequence']);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782341444959_create_user_modules_table.js.map