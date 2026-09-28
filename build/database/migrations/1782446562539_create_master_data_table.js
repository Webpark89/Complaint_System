import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'master_data';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('ref_type').notNullable();
            table.integer('ref_id').unsigned().notNullable();
            table.string('title').notNullable();
            table.text('description').notNullable();
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
            table.unique(['ref_type', 'ref_id']);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782446562539_create_master_data_table.js.map