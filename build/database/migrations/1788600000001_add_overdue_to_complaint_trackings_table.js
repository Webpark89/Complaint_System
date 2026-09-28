import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'complaint_trackings';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.integer('overdue').nullable();
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('overdue');
        });
    }
}
//# sourceMappingURL=1788600000001_add_overdue_to_complaint_trackings_table.js.map