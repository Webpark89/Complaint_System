import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'form_subject_user_groups';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .integer('form_subject_id')
                .unsigned()
                .references('form_subjects.id')
                .nullable()
                .onDelete('SET NULL');
            table.mediumint('step').unsigned().notNullable();
            table
                .integer('user_group_id')
                .unsigned()
                .references('user_groups.id')
                .nullable()
                .onDelete('SET NULL');
            table.unique(['form_subject_id', 'step', 'user_group_id']);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782447978070_create_form_subject_user_groups_table.js.map