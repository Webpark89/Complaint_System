import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'organizations';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('parent_organization_id').index();
            table.string('title').notNullable();
            table.enum('type', ['COMPANY', 'BRANCH', 'DEPARTMENT']).notNullable();
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
//# sourceMappingURL=1782342159213_create_organizations_table.js.map