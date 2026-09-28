var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ComplaintSchema } from '#database/schema';
import { afterFetch, afterFind, beforeCreate, beforeSave, belongsTo, hasMany, hasOne, } from '@adonisjs/lucid/orm';
import encryption from '@adonisjs/core/services/encryption';
import Form from '#models/form';
import ComplaintAnswer from '#models/complaint_answer';
import ComplaintTracking from '#models/complaint_tracking';
import ComplaintFile from '#models/complaint_file';
import ComplaintWitness from '#models/complaint_witness';
import FormCategory from '#models/form_category';
import FormSubject from '#models/form_subject';
import Organization from '#models/organization';
import User from '#models/user';
export default class Complaint extends ComplaintSchema {
    static async generateCode(complaint) {
        let uniqueCode = this.randomCode(8, 'CMP-');
        let exists = await Complaint.findBy('code', uniqueCode);
        while (exists) {
            uniqueCode = this.randomCode(8, 'CMP-');
            exists = await Complaint.findBy('code', uniqueCode);
        }
        complaint.code = uniqueCode;
    }
    static randomCode(length, prefix) {
        const chars = '346789ABCDEFGHJKMNPQRTUVWXY';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars.charAt(randomIndex);
        }
        return `${prefix}${result}`;
    }
    static async encryptSensitiveData(data) {
        if (data.$dirty.detail) {
            data.detail = encryption.encrypt(data.detail);
        }
        if (data.$dirty.complainantFullName) {
            data.complainantFullName = encryption.encrypt(data.complainantFullName);
        }
        if (data.$dirty.complainantEmail) {
            data.complainantEmail = encryption.encrypt(data.complainantEmail);
        }
        if (data.$dirty.complainantTelephone) {
            data.complainantTelephone = encryption.encrypt(data.complainantTelephone);
        }
    }
    static decryptSensitiveFields(data) {
        if (data.detail) {
            data.detail = encryption.decrypt(data.detail) || data.detail;
        }
        if (data.complainantFullName) {
            data.complainantFullName =
                encryption.decrypt(data.complainantFullName) || data.complainantFullName;
        }
        if (data.complainantEmail) {
            data.complainantEmail = encryption.decrypt(data.complainantEmail) || data.complainantEmail;
        }
        if (data.complainantTelephone) {
            data.complainantTelephone =
                encryption.decrypt(data.complainantTelephone) || data.complainantTelephone;
        }
    }
    static async decryptSensitiveData(data) {
        data.forEach((e) => this.decryptSensitiveFields(e));
    }
    static async decryptSensitiveDataSingle(data) {
        if (data) {
            this.decryptSensitiveFields(data);
        }
    }
}
__decorate([
    belongsTo(() => FormCategory),
    __metadata("design:type", Object)
], Complaint.prototype, "formCategory", void 0);
__decorate([
    belongsTo(() => FormSubject),
    __metadata("design:type", Object)
], Complaint.prototype, "formSubject", void 0);
__decorate([
    belongsTo(() => Organization),
    __metadata("design:type", Object)
], Complaint.prototype, "organization", void 0);
__decorate([
    belongsTo(() => Form),
    __metadata("design:type", Object)
], Complaint.prototype, "form", void 0);
__decorate([
    belongsTo(() => User, {
        foreignKey: 'updatedBy',
    }),
    __metadata("design:type", Object)
], Complaint.prototype, "updatedUser", void 0);
__decorate([
    belongsTo(() => User, {
        foreignKey: 'ownedBy',
    }),
    __metadata("design:type", Object)
], Complaint.prototype, "ownedUser", void 0);
__decorate([
    hasMany(() => ComplaintAnswer),
    __metadata("design:type", Object)
], Complaint.prototype, "complaintAnswers", void 0);
__decorate([
    hasMany(() => ComplaintFile),
    __metadata("design:type", Object)
], Complaint.prototype, "complaintFiles", void 0);
__decorate([
    hasMany(() => ComplaintWitness),
    __metadata("design:type", Object)
], Complaint.prototype, "complaintWitnesses", void 0);
__decorate([
    hasMany(() => ComplaintTracking),
    __metadata("design:type", Object)
], Complaint.prototype, "complaintTrackings", void 0);
__decorate([
    hasOne(() => ComplaintTracking, {
        onQuery: (query) => query.orderBy('id', 'desc'),
    }),
    __metadata("design:type", Object)
], Complaint.prototype, "complaintTrackingLast", void 0);
__decorate([
    beforeCreate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Complaint]),
    __metadata("design:returntype", Promise)
], Complaint, "generateCode", null);
__decorate([
    beforeSave(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Complaint]),
    __metadata("design:returntype", Promise)
], Complaint, "encryptSensitiveData", null);
__decorate([
    afterFetch(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], Complaint, "decryptSensitiveData", null);
__decorate([
    afterFind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Complaint, "decryptSensitiveDataSingle", null);
//# sourceMappingURL=complaint.js.map