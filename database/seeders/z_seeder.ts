import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    // Truncate Audits
    await db.rawQuery(`truncate table audits`)

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
    ]

    for (const table of tables) {
      await db.rawQuery(`SELECT setval(
          pg_get_serial_sequence('${table}', 'id'),
          COALESCE(max(id), 0) + 1,
          false
      ) FROM ${table};`)
    }

    //     // Reset id Seed
    //     const sqlLists = await db.rawQuery(`
    // SELECT 'SELECT setval(' ||
    //        quote_literal(pg_get_serial_sequence(table_name, column_name)) ||
    //        ', COALESCE(max(' || quote_ident(column_name) || '), 1)) FROM ' ||
    //        quote_ident(table_name) || ';' as sql
    // FROM information_schema.columns
    // WHERE table_schema = 'public' AND table_name NOT IN ('adonis_schema')
    //   AND column_default LIKE 'nextval%'
    // `)
    //     // console.log(sqlLists)
    //     sqlLists.rows.map(async (sql: any) => {
    //       // console.log(sql.sql)
    //       await db.rawQuery(sql.sql)
    //     })
  }
}
