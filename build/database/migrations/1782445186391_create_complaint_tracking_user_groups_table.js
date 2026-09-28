import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'complaint_tracking_user_groups';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .integer('complaint_tracking_id')
                .unsigned()
                .references('complaint_trackings.id')
                .onDelete('CASCADE');
            table.integer('user_group_id').unsigned().references('user_groups.id').onDelete('CASCADE');
            table.unique(['complaint_tracking_id', 'user_group_id']);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782445186391_create_complaint_tracking_user_groups_table.js.map