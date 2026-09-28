import vine from '@vinejs/vine';
import { ActiveStatus, getEnumValueAsString } from '#contracts/enum';
const formCategoryFields = {
    sub_title: vine.string().maxLength(250),
    description: vine.string(),
    status: vine.enum(getEnumValueAsString(ActiveStatus)),
};
export const formCategoryAdminStoreValidator = vine.create({
    ...formCategoryFields,
    title: vine
        .string()
        .maxLength(250)
        .unique({ table: 'form_categories', column: 'title', caseInsensitive: true }),
    sequence: vine
        .number()
        .nonNegative()
        .withoutDecimals()
        .max(2000000000)
        .unique({ table: 'form_categories', column: 'sequence' }),
});
export const formCategoryAdminUpdateValidator = vine.create({
    ...formCategoryFields,
    title: vine
        .string()
        .maxLength(250)
        .unique({
        table: 'form_categories',
        column: 'title',
        caseInsensitive: true,
        filter: (db, _value, field) => {
            db.whereNot('id', field.data.params.id);
        },
    }),
    sequence: vine
        .number()
        .nonNegative()
        .withoutDecimals()
        .max(2000000000)
        .unique({
        table: 'form_categories',
        column: 'sequence',
        filter: (db, _value, field) => {
            db.whereNot('id', field.data.params.id);
        },
    }),
});
//# sourceMappingURL=form_category.js.map