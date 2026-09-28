import vine from '@vinejs/vine';
import { ActiveStatus, getEnumValueAsString } from '#contracts/enum';
export const userRoleAdminStoreValidator = vine.create({
    title: vine
        .string()
        .maxLength(250)
        .unique({ table: 'user_roles', column: 'title', caseInsensitive: true }),
    description: vine.string(),
    status: vine.enum(getEnumValueAsString(ActiveStatus)),
    permissions: vine.array(vine.number()),
});
export const userRoleAdminUpdateValidator = vine.create({
    title: vine
        .string()
        .maxLength(250)
        .unique({
        table: 'user_roles',
        column: 'title',
        caseInsensitive: true,
        filter: (db, _value, field) => {
            db.whereNot('id', field.data.params.id);
        },
    }),
    description: vine.string(),
    status: vine.enum(getEnumValueAsString(ActiveStatus)),
    permissions: vine.array(vine.number()),
});
//# sourceMappingURL=user_role.js.map