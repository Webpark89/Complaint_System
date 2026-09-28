import vine from '@vinejs/vine';
import { ActiveStatus, getEnumValueAsString } from '#contracts/enum';
const email = () => vine.string().email().maxLength(254);
const password = () => vine.string().minLength(8).maxLength(32);
export const signupValidator = vine.create({
    fullName: vine
        .string()
        .unique({ table: 'users', column: 'full_name', caseInsensitive: true })
        .nullable(),
    email: email().unique({ table: 'users', column: 'email', caseInsensitive: true }),
    password: password().confirmed({
        confirmationField: 'passwordConfirmation',
    }),
});
export const loginValidator = vine.create({
    email: email(),
    password: password(),
});
export const userListSearchValidator = vine.create({
    search: vine.string().nullable(),
    status: vine.enum(ActiveStatus).optional(),
});
export const userStoreValidator = vine.create({
    full_name: vine
        .string()
        .maxLength(250)
        .unique({ table: 'users', column: 'full_name', caseInsensitive: true })
        .nullable(),
    email: email().maxLength(250).unique({ table: 'users', column: 'email', caseInsensitive: true }),
    user_role_id: vine.number().exists({ table: 'user_roles', column: 'id' }),
    organization_id: vine.number().exists({ table: 'organizations', column: 'id' }),
    status: vine.enum(getEnumValueAsString(ActiveStatus)),
});
export const userUpdateValidator = vine.create({
    full_name: vine
        .string()
        .maxLength(250)
        .unique({
        table: 'users',
        column: 'full_name',
        filter: (db, _value, field) => {
            db.whereNot('id', field.data.params.id);
        },
    })
        .nullable(),
    email: email()
        .maxLength(250)
        .unique({
        table: 'users',
        column: 'email',
        filter: (db, _value, field) => {
            db.whereNot('id', field.data.params.id);
        },
    }),
    user_role_id: vine.number().exists({ table: 'user_roles', column: 'id' }),
    organization_id: vine.number().exists({ table: 'organizations', column: 'id' }),
    status: vine.enum(getEnumValueAsString(ActiveStatus)),
});
//# sourceMappingURL=user.js.map