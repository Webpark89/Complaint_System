import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'complaint_trackings';
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
            table.tinyint('mode').notNullable();
            table.jsonb('old_values').nullable();
            table.jsonb('new_values').nullable();
            table.text('remark').notNullable();
            table.date('due_date').nullable();
            table.date('due_date_extend').nullable();
            table.integer('owned_by').nullable();
            table.tinyint('status').notNullable();
            table.tinyint('tracking_status').notNullable();
            table.tinyint('approve_status').notNullable();
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
//# sourceMappingURL=1782443086390_create_complaint_trackings_table.js.map