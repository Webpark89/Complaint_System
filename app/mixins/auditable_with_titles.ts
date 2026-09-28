import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { LucidModel } from '@adonisjs/lucid/types/model'

export interface AuditTitleRelation {
  /** Column name as it appears in the audit old/new values, e.g. "formCategoryId" */
  foreignKey: string
  /** Lazy import of the related model, e.g. () => import('#models/form_category') */
  relatedModel: () => Promise<{ default: LucidModel }>
  /** Column on the related model used as the human-readable value, defaults to "title" */
  titleColumn?: string
  /** Key used to store the resolved value, defaults to `foreignKey` with an "Id" suffix swapped for "Title" */
  titleKey?: string
}

function defaultTitleKey(foreignKey: string) {
  return foreignKey.endsWith('Id') ? `${foreignKey.slice(0, -2)}Title` : `${foreignKey}Title`
}

type WriteAuditOpts = {
  event: string
  oldValues: Record<string, unknown> | null
  newValues: Record<string, unknown> | null
  tags?: string[] | null
  metadata?: Record<string, unknown>
  auditComment?: string | null
}

interface AuditWritable {
  $writeAudit(opts: WriteAuditOpts): Promise<void>
}

type AuditableConstructor = NormalizeConstructor<LucidModel> &
  (new (...args: any[]) => AuditWritable)

async function resolveTitle(relation: AuditTitleRelation, id: unknown) {
  if (id === null || id === undefined) return null
  const { default: RelatedModel } = await relation.relatedModel()
  const record = await (RelatedModel as any).find(id)
  if (!record) return null
  return record[relation.titleColumn ?? 'title'] ?? null
}

async function withRelationTitles(
  values: Record<string, unknown> | null,
  relations: AuditTitleRelation[]
): Promise<Record<string, unknown> | null> {
  if (!values || relations.length === 0) return values
  const out = { ...values }
  for (const relation of relations) {
    if (!(relation.foreignKey in values)) continue
    out[relation.titleKey ?? defaultTitleKey(relation.foreignKey)] = await resolveTitle(
      relation,
      values[relation.foreignKey]
    )
  }
  return out
}

/**
 * Compose after `Auditable` to enrich old/new audit values with the title
 * (or other human-readable column) of any related model referenced by a
 * foreign key, e.g. `formCategoryId: 5` also stores `formCategoryTitle: 'abc'`.
 */
export function withAuditTitles<T extends AuditableConstructor>(superclass: T) {
  class ModelWithAuditTitles extends superclass {
    static auditTitleRelations: AuditTitleRelation[] = []

    async $writeAudit(opts: WriteAuditOpts) {
      const relations = (this.constructor as typeof ModelWithAuditTitles).auditTitleRelations
      const oldValues = await withRelationTitles(opts.oldValues, relations)
      const newValues = await withRelationTitles(opts.newValues, relations)
      return super.$writeAudit({ ...opts, oldValues, newValues })
    }
  }

  return ModelWithAuditTitles
}
