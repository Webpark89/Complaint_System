import vine from '@vinejs/vine';
export const reportDateValidator = vine.create({
    from: vine
        .date({ formats: ['YYYY-MM-DD'] })
        .parse((value) => (value === '' || value === null ? undefined : value))
        .optional(),
    to: vine
        .date({ formats: ['YYYY-MM-DD'] })
        .parse((value) => (value === '' || value === null ? undefined : value))
        .optional(),
});
//# sourceMappingURL=report.js.map