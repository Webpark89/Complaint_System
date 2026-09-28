import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'form_questions';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .integer('form_id')
                .unsigned()
                .notNullable()
                .index()
                .references('forms.id')
                .onDelete('CASCADE');
            table
                .integer('form_section_id')
                .unsigned()
                .nullable()
                .index()
                .references('form_sections.id')
                .onDelete('SET NULL');
            table.enum('type', ['string', 'text', 'date', 'datetime']).index();
            table.string('title').notNullable();
            table.text('hint').notNullable();
            table.text('data').nullable();
            table.tinyint('sequence').notNullable();
            table.tinyint('status').notNullable();
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
//# sourceMappingURL=1782442826759_create_form_questions_table.js.map