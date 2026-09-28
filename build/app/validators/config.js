import vine from '@vinejs/vine';
export const configTermAdminFormValidator = vine.create({
    term: vine.string(),
    pdpa: vine.string(),
});
export const configTermFileAdminFormValidator = vine.create({
    file: vine.file({
        size: '10mb',
        extnames: ['pdf'],
    }),
});
export const configSLAAdminFormValidator = vine.create({
    new: vine.number().withoutDecimals().min(1).max(700),
    in_progress: vine.number().withoutDecimals().min(1).max(700),
    in_progress_extend: vine.number().withoutDecimals().min(1).max(700),
    investigating_normal: vine.number().withoutDecimals().min(1).max(700),
    investigating_normal_extend: vine.number().withoutDecimals().min(1).max(700),
    investigating_complex: vine.number().withoutDecimals().min(1).max(700),
    investigating_complex_extend: vine.number().withoutDecimals().min(1).max(700),
});
//# sourceMappingURL=config.js.map