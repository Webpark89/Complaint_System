// import { compose } from '@adonisjs/core/helpers'
import { FormCategorySchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import { withAuditTitles } from '#mixins/auditable_with_titles'
import FormSubject from '#models/form_subject'
import Form from '#models/form'
// import { SoftDeletes } from 'adonis-lucid-soft-deletes'

export default class FormCategory extends compose(FormCategorySchema, Auditable, withAuditTitles) {
  //   extends compose(FormCategorySchema, SoftDeletes as any)
  // {
  @hasMany(() => FormSubject)
  declare formSubjects: HasMany<typeof FormSubject>

  @hasMany(() => Form)
  declare forms: HasMany<typeof Form>
}
