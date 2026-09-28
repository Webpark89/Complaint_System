import { BaseTransformer } from '@adonisjs/core/transformers';
import encryption from '@adonisjs/core/services/encryption';
import { DateTime } from 'luxon';
export const AUDIT_EVENT_TITLES = {
    created: 'เพิ่ม',
    updated: 'แก้ไข',
    deleted: 'ลบ',
    login: 'เข้าสู่ระบบ',
    login_attempt: 'เข้าสู่ระบบ (ไม่สำเร็จ)',
    logout: 'ออกจากระบบ',
    permissions: 'แก้ไขสิทธิ์',
    users: 'แก้ไขผู้ใช้งาน',
};
export const AUDIT_MODULE_TITLES = {
    User: 'ผู้ใช้งาน',
    UserRole: 'สิทธิ์ใช้งาน',
    UserGroup: 'กลุ่มผู้ใช้งาน',
    Organization: 'หน่วยงานและโครงสร้างองค์กร',
    Complaint: 'เรื่องร้องเรียน',
    ComplaintTracking: 'ติดตามเรื่องร้องเรียน',
    ComplaintWitness: 'พยานเรื่องร้องเรียน',
    FormCategory: 'หมวดหมู่เรื่องร้องเรียน',
    FormSubject: 'ประเด็นเรื่องร้องเรียน',
    Form: 'แบบฟอร์มร้องเรียน',
    FormQuestion: 'แบบฟอร์มร้องเรียน (คำถาม)',
    Config: 'ตั้งค่า',
};
import { ActiveStatusTitle, ApproveStatusTitle, ComplaintStatusTitle, ComplaintTrackingModeTitle, ComplaintTrackingStatusTitle, getEnumByValue, IsComplexTitle, IsSensitiveTitle, OrganizationTypeTitle, } from '#contracts/enum';
export default class AuditLogTransformer extends BaseTransformer {
    skipFields = new Set([
        'id',
        'auditableId',
        'auditableType',
        'userId',
        'userType',
        'requestId',
        'tenantId',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'createdBy',
        'updatedBy',
        'deletedBy',
        'password',
        'permissions',
        'metadata',
        'tags',
        'auditComment',
        'user_groups',
        'user_groups_1',
        'user_groups_2',
        'user_groups_2S',
        'user_groups_3',
        'user_groups_4',
        'userRoleId',
        'users',
        'countSla',
        'complaintId',
        'organizationId',
        'parentOrganizationId',
        'formCategoryId',
        'ownedBy',
    ]);
    toObject() {
        return {
            ...this.pick(this.resource, ['id']),
            created_at: this.resource.createdAt.toFormat('dd/MM/yyyy HH:mm'),
            user: this.resource.$extras.full_name ?? '',
            user_role: this.resource.$extras.user_role ?? '',
            ip: this.resource.metadata?.ip_address,
            event: this.getEventTitle(this.resource.event),
            module: this.getModuleTitle(this.resource.auditableType),
            old_values: this.getValuesMappings(this.resource.oldValues, this.resource.auditableType),
            new_values: this.getValuesMappings(this.resource.newValues, this.resource.auditableType),
        };
    }
    getValuesMappings(values, module) {
        if (!values)
            return {};
        return Object.fromEntries(Object.entries(values)
            .filter(([field]) => !this.skipFields.has(field))
            .map(([field, value]) => [
            this.getFieldTitle(field),
            this.getValueTitle(field, value, module),
        ])
            .filter(([, value]) => value !== null && value !== ''));
    }
    getFieldTitle(field) {
        const titles = {
            approveStatus: 'สถานะการอนุมัติ',
            category: 'หมวดหมู่',
            code: 'รหัส',
            complaintCode: 'รหัสเรื่องร้องเรียน',
            complainantEmail: 'อีเมลผู้ร้องเรียน',
            complainantFullName: 'ชื่อผู้ร้องเรียน',
            complainantTelephone: 'เบอร์โทรศัพท์ผู้ร้องเรียน',
            consent: 'การยินยอม',
            countSla: 'นับ SLA',
            createdAt: 'วันที่สร้าง',
            description: 'รายละเอียด',
            detail: 'รายละเอียด',
            dueDate: 'กำหนดเวลา',
            dueDateExtend: 'กำหนดเวลาที่ขยาย',
            email: 'อีเมล',
            file: 'ไฟล์แนบ',
            formCategoryTitle: 'หมวดหมู่เรื่องร้องเรียน',
            formId: 'แบบฟอร์มร้องเรียน',
            formQuestionId: 'คำถาม',
            formSubjectId: 'ประเด็นเรื่องร้องเรียน',
            formSubjectOther: 'ประเด็นอื่นๆ',
            fullName: 'ชื่อ-นามสกุล',
            hasWitness: 'มีพยาน',
            hint: 'คำแนะนำ',
            incidentAt: 'วันที่เกิดเหตุ',
            isAnonymous: 'ไม่ระบุตัวตน',
            isComplex: 'ข้อมูลซับซ้อน',
            isSensitive: 'ข้อมูลอ่อนไหว',
            isOther: 'อื่นๆ',
            mode: 'รูปแบบการดำเนินการ',
            name: 'ชื่อ',
            organizationTitle: 'หน่วยงาน',
            organizationType: 'ประเภทหน่วยงาน',
            ownedByName: 'ผู้รับผิดชอบ',
            parentOrganizationTitle: 'หน่วยงานแม่',
            password: 'รหัสผ่าน',
            permissionTitles: 'สิทธิ์การเข้าถึง',
            remark: 'หมายเหตุ',
            sequence: 'ลำดับ',
            status: 'สถานะ',
            subTitle: 'ชื่อรอง',
            summary: 'สรุปผล',
            telephone: 'เบอร์โทรศัพท์',
            title: 'ชื่อ',
            trackingStatus: 'สถานะการติดตาม',
            type: 'ประเภท',
            updatedAt: 'วันที่แก้ไข',
            updatedBy: 'ผู้แก้ไข',
            user_groups_title: 'กลุ่มผู้ใช้งาน',
            user_groups_1_title: 'กลุ่มผู้ใช้งาน (รับเรื่องร้องเรียน)',
            user_groups_2_title: 'กลุ่มผู้ใช้งาน (ผู้รับผิดชอบ ต่อ)',
            user_groups_2S_title: 'กลุ่มผู้ใช้งาน (ผู้รับผิดชอบ ต่อ Sensitive Case)',
            user_groups_3_title: 'กลุ่มผู้ใช้งาน (ดำเนินการสอบสวนและสรุปผล)',
            user_groups_4_title: 'กลุ่มผู้ใช้งาน (ผู้อนุมัติตรวจสอบอีกครั้ง)',
            userRoleTitle: 'สิทธิ์ใช้งาน',
            userFullName: 'ผู้ใช้งาน',
            validation: 'เงื่อนไขการตรวจสอบ',
            value: 'ค่า',
        };
        return titles[field] ?? field;
    }
    getValueTitle(field, value, module) {
        const decodedValue = this.decryptIfNeeded(field, value);
        if (field === 'status') {
            if (module === 'Complaint' || module === 'ComplaintTracking')
                return getEnumByValue(ComplaintStatusTitle, decodedValue);
            return getEnumByValue(ActiveStatusTitle, decodedValue);
        }
        if (field === 'approveStatus')
            return getEnumByValue(ApproveStatusTitle, decodedValue);
        if (field === 'trackingStatus')
            return getEnumByValue(ComplaintTrackingStatusTitle, decodedValue);
        if (field === 'mode' && module === 'ComplaintTracking') {
            return getEnumByValue(ComplaintTrackingModeTitle, decodedValue);
        }
        if (field === 'organizationType')
            return getEnumByValue(OrganizationTypeTitle, decodedValue);
        if (field === 'isSensitive')
            return IsSensitiveTitle(Boolean(decodedValue));
        if (field === 'isComplex')
            return IsComplexTitle(Boolean(decodedValue));
        if (['consent', 'hasWitness', 'isAnonymous', 'isOther'].includes(field))
            return decodedValue ? 'ใช่' : 'ไม่ใช่';
        if (field === 'permissionTitles')
            return Array.isArray(decodedValue) ? decodedValue.join(', ') : decodedValue || '';
        if (typeof decodedValue === 'string') {
            const date = DateTime.fromISO(decodedValue);
            if (date.isValid)
                return date.toFormat('dd/MM/yyyy HH:mm:ss');
        }
        return decodedValue;
    }
    decryptIfNeeded(field, value) {
        const encryptedFields = new Set([
            'detail',
            'complainantFullName',
            'complainantEmail',
            'complainantTelephone',
            'fullName',
            'telephone',
        ]);
        if (!encryptedFields.has(field) || typeof value !== 'string')
            return value;
        return encryption.decrypt(value) ?? value;
    }
    getEventTitle(val) {
        return AUDIT_EVENT_TITLES[val] ?? val;
    }
    getModuleTitle(val) {
        switch (val) {
            case 'User':
                return 'ผู้ใช้งาน';
            case 'UserRole':
                return 'สิทธิ์ใช้งาน';
            case 'UserGroup':
                return 'กลุ่มผู้ใช้งาน';
            case 'Organization':
                return 'หน่วยงานและโครงสร้างองค์กร';
            case 'Complaint':
                return 'เรื่องร้องเรียน';
            case 'ComplaintTracking':
                return 'ติดตามเรื่องร้องเรียน';
            case 'ComplaintWitness':
                return 'พยานเรื่องร้องเรียน';
            case 'FormCategory':
                return 'หมวดหมู่เรื่องร้องเรียน';
            case 'FormSubject':
                return 'ประเด็นเรื่องร้องเรียน';
            case 'Form':
                return 'แบบฟอร์มร้องเรียน';
            case 'FormQuestion':
                return 'แบบฟอร์มร้องเรียน (คำถาม)';
            case 'Config':
                return 'ตั้งค่า';
        }
        return AUDIT_MODULE_TITLES[val] ?? val;
    }
}
//# sourceMappingURL=audit_log_transformer.js.map