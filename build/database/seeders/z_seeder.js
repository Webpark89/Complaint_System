import { BaseSeeder } from '@adonisjs/lucid/seeders';
import db from '@adonisjs/lucid/services/db';
export default class extends BaseSeeder {
    async run() {
        await db.rawQuery(`truncate table audits`);
        const tables = [
            'audits',
            'form_categories',
            'form_subjects',
            'form_sections',
            'forms',
            'form_questions',
            'form_subject_user_groups',
            'organizations',
            'users',
            'user_groups',
            'user_group_users',
            'user_roles',
            'user_role_permissions',
            'user_logs',
            'master_data',
        ];
        for (const table of tables) {
            await db.rawQuery(`SELECT setval(
          pg_get_serial_sequence('${table}', 'id'),
          COALESCE(max(id), 0) + 1,
          false
      ) FROM ${table};`);
        }
    }
}
//# sourceMappingURL=z_seeder.js.map