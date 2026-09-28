import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'complaints';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table
                .integer('form_category_id')
                .unsigned()
                .nullable()
                .index()
                .references('form_categories.id')
                .onDelete('SET NULL');
            table
                .integer('form_subject_id')
                .unsigned()
                .nullable()
                .index()
                .references('form_subjects.id')
                .onDelete('SET NULL');
            table
                .integer('form_id')
                .unsigned()
                .nullable()
                .index()
                .references('forms.id')
                .onDelete('SET NULL');
            table
                .integer('organization_id')
                .unsigned()
                .nullable()
                .index()
                .references('organizations.id')
                .onDelete('SET NULL');
            table.string('code').notNullable().unique();
            table.string('form_subject_other').notNullable().defaultTo('');
            table.text('detail').notNullable().defaultTo('');
            table.datetime('incident_at').notNullable();
            table.boolean('has_witness').notNullable();
            table.boolean('is_anonymous').notNullable();
            table.boolean('is_complex').notNullable();
            table.boolean('is_sensitive').notNullable();
            table.string('complainant_full_name').notNullable().defaultTo('');
            table.string('complainant_email').notNullable().defaultTo('');
            table.string('complainant_telephone').notNullable().defaultTo('');
            table.boolean('consent').notNullable();
            table.date('due_date').nullable();
            table.integer('owned_by').nullable();
            table.tinyint('status').notNullable();
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
            table.integer('updated_by').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782443053769_create_complaints_table.js.map