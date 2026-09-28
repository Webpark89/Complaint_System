import { ActiveStatus } from '#contracts/enum';
export const userRoles = [
    {
        id: 1,
        title: 'Admin',
        description: 'Admin',
        status: ActiveStatus.ACTIVE,
        created_by: 0,
        updated_by: 0,
    },
];
export const users = [
    {
        id: 1,
        user_role_id: 1,
        organization_id: 1,
        full_name: 'Administrator SMO',
        email: 'authentest@smg-thai.com',
        password: 'google',
        status: ActiveStatus.ACTIVE,
        created_by: 0,
        updated_by: 0,
    },
    {
        id: 2,
        user_role_id: 1,
        organization_id: 1,
        full_name: 'Administrator',
        email: 'guicontroltest@gmail.com',
        password: 'google',
        status: ActiveStatus.ACTIVE,
        created_by: 0,
        updated_by: 0,
    },
];
export const userGroups = [
    {
        title: 'CS กลยุทธ์องค์กร',
    },
    {
        title: 'OS สำนักงานเลขานุการบริหาร',
    },
    {
        title: 'SC เลขานุการบริษัท',
    },
    {
        title: 'QE บริหารระบบคุณภาพ ความปลอดภัย อาชีวอนามัยและสิ่งแวดล้อม',
    },
    {
        title: 'IT เทคโนโลยีสารสนเทศ',
    },
    {
        title: 'HR ทรัพยากรบุคคล',
    },
    {
        title: 'ISM ขายและการตลาดต่างประเทศ',
    },
    {
        title: 'DSM ขายและการตลาดในประเทศ',
    },
    {
        title: 'GP จัดซื้อทั่วไป',
    },
    {
        title: 'RP จัดซื้อวัตถุดิบ',
    },
    {
        title: 'LG โลจิสติกส์',
    },
    {
        title: 'MD-INT',
    },
    {
        title: 'MD-Factory',
    },
    {
        title: 'CFO',
    },
    {
        title: 'CEO',
    },
    {
        title: 'SEVP-Office',
    },
    {
        title: 'SEVP-DSM',
    },
    {
        title: 'FN การเงิน',
    },
    {
        title: 'RM ประเมินคุณภาพและตรวจสอบวัตถุดิบ',
    },
    {
        title: 'AC บัญชี',
    },
    {
        title: 'QC ควบคุมคุณภาพ',
    },
    {
        title: 'MM ผู้บริหาร',
    },
    {
        title: 'BG ก๊าชชีวภาพ',
    },
];
//# sourceMappingURL=user.js.map