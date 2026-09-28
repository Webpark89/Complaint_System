import vine from '@vinejs/vine';
import { ActiveStatus, getEnumValueAsString, OrganizationType } from '#contracts/enum';
import { isExistsOrNullRule } from '#validators/app_rules';
const organizationFields = {
    parent_organization_id: vine
        .any()
        .nullable()
        .optional()
        .use(isExistsOrNullRule({ table: 'organizations', column: 'id' })),
    code: vine.string().maxLength(250),
    type: vine.enum(getEnumValueAsString(OrganizationType)),
    status: vine.enum(getEnumValueAsString(ActiveStatus)),
};
export const organizationStoreValidator = vine.create({
    ...organizationFields,
    title: vine.string().maxLength(250).unique({ table: 'organizations', column: 'title' }),
});
export const organizationUpdateValidator = vine.create({
    ...organizationFields,
    title: vine
        .string()
        .maxLength(250)
        .unique({
        table: 'organizations',
        column: 'title',
        filter: (db, _value, field) => {
            db.whereNot('id', field.data.params.id);
        },
    }),
});
//# sourceMappingURL=organization.js.map