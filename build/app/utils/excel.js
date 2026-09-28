export function styleExcelHeader(row) {
    row.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF00008B' },
    };
    row.alignment = { horizontal: 'center', vertical: 'middle' };
}
//# sourceMappingURL=excel.js.map