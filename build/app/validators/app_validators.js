import vine from '@vinejs/vine';
import { ActiveStatus } from '#contracts/enum';
export const dataTableSearchValidator = vine.create({
    search: vine.string().nullable().optional(),
    status: vine.enum(ActiveStatus).nullable().optional(),
    page: vine.number().nullable().optional(),
});
//# sourceMappingURL=app_validators.js.map