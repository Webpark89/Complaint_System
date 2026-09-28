import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'form_subjects';
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
            table.string('title').notNullable();
            table.string('sub_title').notNullable();
            table.string('description').notNullable();
            table.boolean('is_other').notNullable();
            table.integer('sequence').notNullable().index();
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
//# sourceMappingURL=1782442740066_create_form_subjects_table.js.map