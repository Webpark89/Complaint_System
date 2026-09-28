import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'forms';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.unique(['form_category_id', 'title', 'version']);
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropUnique(['form_category_id', 'title', 'version']);
        });
    }
}
//# sourceMappingURL=1789200000001_add_unique_category_title_version_to_forms_table.js.map