import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'complaint_trackings';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.boolean('count_sla').defaultTo(false);
        });
        this.defer(async (db) => {
            await db.rawQuery('update complaint_trackings set count_sla = true where id in (select max(id) from complaint_trackings group by complaint_id,status)');
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('count_sla');
        });
    }
}
//# sourceMappingURL=1788940394201_alter_complaint_trackings_table.js.map