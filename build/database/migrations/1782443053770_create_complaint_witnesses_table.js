import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'complaint_witnesses';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .integer('complaint_id')
                .unsigned()
                .notNullable()
                .index()
                .references('complaints.id')
                .onDelete('CASCADE');
            table.string('full_name').notNullable().defaultTo('');
            table.string('telephone').nullable().defaultTo('');
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782443053770_create_complaint_witnesses_table.js.map