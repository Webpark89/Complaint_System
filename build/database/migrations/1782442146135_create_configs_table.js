import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'configs';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('title').notNullable();
            table.text('hint').notNullable();
            table.text('value').notNullable();
            table.text('validation').notNullable();
            table.enum('category', ['config', 'sla', 'term']).index();
            table.enum('mode', ['image', 'number', 'string', 'text', 'file']);
            table.timestamp('created_at').notNullable();
            table.integer('created_by').notNullable();
            table.timestamp('updated_at').nullable();
            table.integer('updated_by').notNullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782442146135_create_configs_table.js.map