import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'complaint_answers';
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
            table
                .integer('form_question_id')
                .unsigned()
                .nullable()
                .index()
                .references('form_questions.id')
                .onDelete('SET NULL');
            table.text('answer_text').nullable();
            table.datetime('answer_datetime').nullable();
            table.tinyint('status').notNullable();
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1782443067767_create_complaint_answers_table.js.map