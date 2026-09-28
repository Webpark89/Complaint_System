import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'complaint_trackings';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.text('detail').nullable();
            table.text('summary').nullable();
            table.string('file_1').nullable();
            table.string('file_2').nullable();
            table.string('file_3').nullable();
            table.string('file_4').nullable();
            table.string('file_5').nullable();
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('detail');
            table.dropColumn('summary');
            table.dropColumn('file_1');
            table.dropColumn('file_2');
            table.dropColumn('file_3');
            table.dropColumn('file_4');
            table.dropColumn('file_5');
        });
    }
}
//# sourceMappingURL=1785000000000_add_detail_summary_files_to_complaint_trackings_table.js.map