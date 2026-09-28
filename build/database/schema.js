var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
export class AuditSchema extends BaseModel {
    static $columns = ['auditComment', 'auditableId', 'auditableType', 'createdAt', 'event', 'id', 'metadata', 'newValues', 'oldValues', 'requestId', 'tags', 'tenantId', 'updatedAt', 'userId', 'userType'];
    $columns = AuditSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], AuditSchema.prototype, "auditComment", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuditSchema.prototype, "auditableId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AuditSchema.prototype, "auditableType", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], AuditSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AuditSchema.prototype, "event", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], AuditSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuditSchema.prototype, "metadata", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuditSchema.prototype, "newValues", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuditSchema.prototype, "oldValues", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuditSchema.prototype, "requestId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuditSchema.prototype, "tags", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuditSchema.prototype, "tenantId", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], AuditSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuditSchema.prototype, "userId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuditSchema.prototype, "userType", void 0);
export class ComplaintAnswerSchema extends BaseModel {
    static $columns = ['answerDatetime', 'answerText', 'complaintId', 'createdAt', 'formQuestionId', 'id', 'status', 'updatedAt'];
    $columns = ComplaintAnswerSchema.$columns;
}
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], ComplaintAnswerSchema.prototype, "answerDatetime", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintAnswerSchema.prototype, "answerText", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintAnswerSchema.prototype, "complaintId", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], ComplaintAnswerSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintAnswerSchema.prototype, "formQuestionId", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], ComplaintAnswerSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintAnswerSchema.prototype, "status", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], ComplaintAnswerSchema.prototype, "updatedAt", void 0);
export class ComplaintFileSchema extends BaseModel {
    static $columns = ['complaintId', 'createdAt', 'file', 'id', 'updatedAt'];
    $columns = ComplaintFileSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintFileSchema.prototype, "complaintId", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], ComplaintFileSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ComplaintFileSchema.prototype, "file", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], ComplaintFileSchema.prototype, "id", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], ComplaintFileSchema.prototype, "updatedAt", void 0);
export class ComplaintTrackingUserGroupSchema extends BaseModel {
    static $columns = ['complaintTrackingId', 'id', 'userGroupId'];
    $columns = ComplaintTrackingUserGroupSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingUserGroupSchema.prototype, "complaintTrackingId", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], ComplaintTrackingUserGroupSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingUserGroupSchema.prototype, "userGroupId", void 0);
export class ComplaintTrackingSchema extends BaseModel {
    static $columns = ['approveStatus', 'complaintId', 'countSla', 'createdAt', 'createdBy', 'detail', 'dueDate', 'dueDateExtend', 'file1', 'file2', 'file3', 'file4', 'file5', 'id', 'mode', 'newValues', 'oldValues', 'overdue', 'ownedBy', 'remark', 'status', 'summary', 'trackingStatus', 'updatedAt', 'updatedBy'];
    $columns = ComplaintTrackingSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintTrackingSchema.prototype, "approveStatus", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintTrackingSchema.prototype, "complaintId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "countSla", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], ComplaintTrackingSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintTrackingSchema.prototype, "createdBy", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "detail", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "dueDate", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "dueDateExtend", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "file1", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "file2", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "file3", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "file4", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "file5", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], ComplaintTrackingSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintTrackingSchema.prototype, "mode", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "newValues", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "oldValues", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "overdue", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "ownedBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ComplaintTrackingSchema.prototype, "remark", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintTrackingSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "summary", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintTrackingSchema.prototype, "trackingStatus", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintTrackingSchema.prototype, "updatedBy", void 0);
export class ComplaintWitnessSchema extends BaseModel {
    static $columns = ['complaintId', 'createdAt', 'fullName', 'id', 'telephone', 'updatedAt'];
    $columns = ComplaintWitnessSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintWitnessSchema.prototype, "complaintId", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], ComplaintWitnessSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ComplaintWitnessSchema.prototype, "fullName", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], ComplaintWitnessSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintWitnessSchema.prototype, "telephone", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], ComplaintWitnessSchema.prototype, "updatedAt", void 0);
export class ComplaintSchema extends BaseModel {
    static $columns = ['code', 'complainantEmail', 'complainantFullName', 'complainantTelephone', 'consent', 'createdAt', 'detail', 'dueDate', 'formCategoryId', 'formId', 'formSubjectId', 'formSubjectOther', 'hasWitness', 'id', 'incidentAt', 'isAnonymous', 'isComplex', 'isSensitive', 'organizationId', 'ownedBy', 'status', 'title', 'updatedAt', 'updatedBy'];
    $columns = ComplaintSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], ComplaintSchema.prototype, "code", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ComplaintSchema.prototype, "complainantEmail", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ComplaintSchema.prototype, "complainantFullName", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ComplaintSchema.prototype, "complainantTelephone", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], ComplaintSchema.prototype, "consent", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], ComplaintSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ComplaintSchema.prototype, "detail", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], ComplaintSchema.prototype, "dueDate", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintSchema.prototype, "formCategoryId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintSchema.prototype, "formId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintSchema.prototype, "formSubjectId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ComplaintSchema.prototype, "formSubjectOther", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], ComplaintSchema.prototype, "hasWitness", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], ComplaintSchema.prototype, "id", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", DateTime)
], ComplaintSchema.prototype, "incidentAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], ComplaintSchema.prototype, "isAnonymous", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], ComplaintSchema.prototype, "isComplex", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], ComplaintSchema.prototype, "isSensitive", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintSchema.prototype, "organizationId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintSchema.prototype, "ownedBy", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ComplaintSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ComplaintSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], ComplaintSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ComplaintSchema.prototype, "updatedBy", void 0);
export class ConfigSchema extends BaseModel {
    static $columns = ['category', 'createdAt', 'createdBy', 'hint', 'id', 'mode', 'title', 'updatedAt', 'updatedBy', 'validation', 'value'];
    $columns = ConfigSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], ConfigSchema.prototype, "category", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], ConfigSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ConfigSchema.prototype, "createdBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ConfigSchema.prototype, "hint", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], ConfigSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ConfigSchema.prototype, "mode", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ConfigSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], ConfigSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ConfigSchema.prototype, "updatedBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ConfigSchema.prototype, "validation", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ConfigSchema.prototype, "value", void 0);
export class FormCategorySchema extends BaseModel {
    static $columns = ['createdAt', 'createdBy', 'description', 'id', 'sequence', 'status', 'subTitle', 'title', 'updatedAt', 'updatedBy'];
    $columns = FormCategorySchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], FormCategorySchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormCategorySchema.prototype, "createdBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormCategorySchema.prototype, "description", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], FormCategorySchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormCategorySchema.prototype, "sequence", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormCategorySchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormCategorySchema.prototype, "subTitle", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormCategorySchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], FormCategorySchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormCategorySchema.prototype, "updatedBy", void 0);
export class FormQuestionSchema extends BaseModel {
    static $columns = ['createdAt', 'createdBy', 'data', 'formId', 'formSectionId', 'hint', 'id', 'sequence', 'status', 'title', 'type', 'updatedAt', 'updatedBy'];
    $columns = FormQuestionSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], FormQuestionSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormQuestionSchema.prototype, "createdBy", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormQuestionSchema.prototype, "data", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormQuestionSchema.prototype, "formId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormQuestionSchema.prototype, "formSectionId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormQuestionSchema.prototype, "hint", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], FormQuestionSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormQuestionSchema.prototype, "sequence", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormQuestionSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormQuestionSchema.prototype, "title", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormQuestionSchema.prototype, "type", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], FormQuestionSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormQuestionSchema.prototype, "updatedBy", void 0);
export class FormSectionSchema extends BaseModel {
    static $columns = ['createdAt', 'createdBy', 'description', 'id', 'sequence', 'status', 'title', 'updatedAt', 'updatedBy'];
    $columns = FormSectionSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], FormSectionSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormSectionSchema.prototype, "createdBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormSectionSchema.prototype, "description", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], FormSectionSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormSectionSchema.prototype, "sequence", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormSectionSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormSectionSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], FormSectionSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormSectionSchema.prototype, "updatedBy", void 0);
export class FormSubjectUserGroupSchema extends BaseModel {
    static $columns = ['formSubjectId', 'id', 'step', 'userGroupId'];
    $columns = FormSubjectUserGroupSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], FormSubjectUserGroupSchema.prototype, "formSubjectId", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], FormSubjectUserGroupSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormSubjectUserGroupSchema.prototype, "step", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormSubjectUserGroupSchema.prototype, "userGroupId", void 0);
export class FormSubjectSchema extends BaseModel {
    static $columns = ['createdAt', 'createdBy', 'description', 'formCategoryId', 'id', 'isOther', 'sequence', 'status', 'subTitle', 'title', 'updatedAt', 'updatedBy'];
    $columns = FormSubjectSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], FormSubjectSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormSubjectSchema.prototype, "createdBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormSubjectSchema.prototype, "description", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormSubjectSchema.prototype, "formCategoryId", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], FormSubjectSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], FormSubjectSchema.prototype, "isOther", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormSubjectSchema.prototype, "sequence", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormSubjectSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormSubjectSchema.prototype, "subTitle", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormSubjectSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], FormSubjectSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormSubjectSchema.prototype, "updatedBy", void 0);
export class FormSchema extends BaseModel {
    static $columns = ['createdAt', 'createdBy', 'formCategoryId', 'id', 'status', 'title', 'updatedAt', 'updatedBy', 'version'];
    $columns = FormSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], FormSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormSchema.prototype, "createdBy", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormSchema.prototype, "formCategoryId", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], FormSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], FormSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], FormSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], FormSchema.prototype, "updatedBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FormSchema.prototype, "version", void 0);
export class MasterDatumSchema extends BaseModel {
    static $columns = ['createdAt', 'description', 'id', 'refId', 'refType', 'title', 'updatedAt'];
    $columns = MasterDatumSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], MasterDatumSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MasterDatumSchema.prototype, "description", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], MasterDatumSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], MasterDatumSchema.prototype, "refId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MasterDatumSchema.prototype, "refType", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MasterDatumSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], MasterDatumSchema.prototype, "updatedAt", void 0);
export class OrganizationSchema extends BaseModel {
    static $columns = ['code', 'createdAt', 'createdBy', 'id', 'parentOrganizationId', 'status', 'title', 'type', 'updatedAt', 'updatedBy'];
    $columns = OrganizationSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], OrganizationSchema.prototype, "code", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], OrganizationSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], OrganizationSchema.prototype, "createdBy", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], OrganizationSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], OrganizationSchema.prototype, "parentOrganizationId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], OrganizationSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], OrganizationSchema.prototype, "title", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], OrganizationSchema.prototype, "type", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], OrganizationSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], OrganizationSchema.prototype, "updatedBy", void 0);
export class QueueJobSchema extends BaseModel {
    static $columns = ['acquiredAt', 'data', 'dedupAt', 'dedupId', 'dedupTtl', 'error', 'executeAt', 'finishedAt', 'id', 'queue', 'score', 'status', 'workerId'];
    $columns = QueueJobSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueJobSchema.prototype, "acquiredAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], QueueJobSchema.prototype, "data", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueJobSchema.prototype, "dedupAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueJobSchema.prototype, "dedupId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueJobSchema.prototype, "dedupTtl", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueJobSchema.prototype, "error", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueJobSchema.prototype, "executeAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueJobSchema.prototype, "finishedAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], QueueJobSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], QueueJobSchema.prototype, "queue", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueJobSchema.prototype, "score", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], QueueJobSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueJobSchema.prototype, "workerId", void 0);
export class QueueScheduleSchema extends BaseModel {
    static $columns = ['createdAt', 'cronExpression', 'everyMs', 'fromDate', 'id', 'lastRunAt', 'name', 'nextRunAt', 'payload', 'runCount', 'runLimit', 'status', 'timezone', 'toDate'];
    $columns = QueueScheduleSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], QueueScheduleSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueScheduleSchema.prototype, "cronExpression", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueScheduleSchema.prototype, "everyMs", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], QueueScheduleSchema.prototype, "fromDate", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], QueueScheduleSchema.prototype, "id", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], QueueScheduleSchema.prototype, "lastRunAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], QueueScheduleSchema.prototype, "name", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], QueueScheduleSchema.prototype, "nextRunAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], QueueScheduleSchema.prototype, "payload", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], QueueScheduleSchema.prototype, "runCount", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], QueueScheduleSchema.prototype, "runLimit", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], QueueScheduleSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], QueueScheduleSchema.prototype, "timezone", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], QueueScheduleSchema.prototype, "toDate", void 0);
export class SessionSchema extends BaseModel {
    static $columns = ['data', 'expiresAt', 'id', 'userId'];
    $columns = SessionSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], SessionSchema.prototype, "data", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", DateTime)
], SessionSchema.prototype, "expiresAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], SessionSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SessionSchema.prototype, "userId", void 0);
export class UserGroupUserSchema extends BaseModel {
    static $columns = ['id', 'userGroupId', 'userId'];
    $columns = UserGroupUserSchema.$columns;
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], UserGroupUserSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserGroupUserSchema.prototype, "userGroupId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserGroupUserSchema.prototype, "userId", void 0);
export class UserGroupSchema extends BaseModel {
    static $columns = ['createdAt', 'createdBy', 'description', 'id', 'status', 'title', 'updatedAt', 'updatedBy'];
    $columns = UserGroupSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], UserGroupSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserGroupSchema.prototype, "createdBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserGroupSchema.prototype, "description", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], UserGroupSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserGroupSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserGroupSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], UserGroupSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserGroupSchema.prototype, "updatedBy", void 0);
export class UserLogSchema extends BaseModel {
    static $columns = ['action', 'createdAt', 'id', 'ipLocal', 'ipPublic', 'module', 'updatedAt', 'userId'];
    $columns = UserLogSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], UserLogSchema.prototype, "action", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], UserLogSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], UserLogSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserLogSchema.prototype, "ipLocal", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserLogSchema.prototype, "ipPublic", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserLogSchema.prototype, "module", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], UserLogSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserLogSchema.prototype, "userId", void 0);
export class UserModuleActionSchema extends BaseModel {
    static $columns = ['action', 'code', 'createdAt', 'id', 'sequence', 'updatedAt', 'userModuleId'];
    $columns = UserModuleActionSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], UserModuleActionSchema.prototype, "action", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserModuleActionSchema.prototype, "code", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], UserModuleActionSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], UserModuleActionSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserModuleActionSchema.prototype, "sequence", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], UserModuleActionSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserModuleActionSchema.prototype, "userModuleId", void 0);
export class UserModuleSchema extends BaseModel {
    static $columns = ['createdAt', 'cssClass', 'icon', 'id', 'mode', 'module', 'parentModuleId', 'sequence', 'slug', 'status', 'title', 'updatedAt', 'url'];
    $columns = UserModuleSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], UserModuleSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserModuleSchema.prototype, "cssClass", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserModuleSchema.prototype, "icon", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], UserModuleSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserModuleSchema.prototype, "mode", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserModuleSchema.prototype, "module", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserModuleSchema.prototype, "parentModuleId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserModuleSchema.prototype, "sequence", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserModuleSchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserModuleSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserModuleSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], UserModuleSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserModuleSchema.prototype, "url", void 0);
export class UserRolePermissionSchema extends BaseModel {
    static $columns = ['createdAt', 'id', 'updatedAt', 'userModuleActionId', 'userRoleId'];
    $columns = UserRolePermissionSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], UserRolePermissionSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], UserRolePermissionSchema.prototype, "id", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], UserRolePermissionSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserRolePermissionSchema.prototype, "userModuleActionId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserRolePermissionSchema.prototype, "userRoleId", void 0);
export class UserRoleSchema extends BaseModel {
    static $columns = ['createdAt', 'createdBy', 'description', 'id', 'status', 'title', 'updatedAt', 'updatedBy'];
    $columns = UserRoleSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], UserRoleSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserRoleSchema.prototype, "createdBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserRoleSchema.prototype, "description", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], UserRoleSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserRoleSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserRoleSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], UserRoleSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserRoleSchema.prototype, "updatedBy", void 0);
export class UserSchema extends BaseModel {
    static $columns = ['createdAt', 'createdBy', 'email', 'fullName', 'id', 'loginAt', 'organizationId', 'password', 'status', 'updatedAt', 'updatedBy', 'userRoleId'];
    $columns = UserSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], UserSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserSchema.prototype, "createdBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserSchema.prototype, "email", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserSchema.prototype, "fullName", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], UserSchema.prototype, "id", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], UserSchema.prototype, "loginAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserSchema.prototype, "organizationId", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], UserSchema.prototype, "password", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserSchema.prototype, "status", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], UserSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserSchema.prototype, "updatedBy", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], UserSchema.prototype, "userRoleId", void 0);
//# sourceMappingURL=schema.js.map