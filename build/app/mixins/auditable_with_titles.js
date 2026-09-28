function defaultTitleKey(foreignKey) {
    return foreignKey.endsWith('Id') ? `${foreignKey.slice(0, -2)}Title` : `${foreignKey}Title`;
}
async function resolveTitle(relation, id) {
    if (id === null || id === undefined)
        return null;
    const { default: RelatedModel } = await relation.relatedModel();
    const record = await RelatedModel.find(id);
    if (!record)
        return null;
    return record[relation.titleColumn ?? 'title'] ?? null;
}
async function withRelationTitles(values, relations) {
    if (!values || relations.length === 0)
        return values;
    const out = { ...values };
    for (const relation of relations) {
        if (!(relation.foreignKey in values))
            continue;
        out[relation.titleKey ?? defaultTitleKey(relation.foreignKey)] = await resolveTitle(relation, values[relation.foreignKey]);
    }
    return out;
}
export function withAuditTitles(superclass) {
    class ModelWithAuditTitles extends superclass {
        static auditTitleRelations = [];
        async $writeAudit(opts) {
            const relations = this.constructor.auditTitleRelations;
            const oldValues = await withRelationTitles(opts.oldValues, relations);
            const newValues = await withRelationTitles(opts.newValues, relations);
            return super.$writeAudit({ ...opts, oldValues, newValues });
        }
    }
    return ModelWithAuditTitles;
}
//# sourceMappingURL=auditable_with_titles.js.map