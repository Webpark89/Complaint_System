var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ComplaintWitnessSchema } from '#database/schema';
import { afterFetch, afterFind, beforeSave, belongsTo } from '@adonisjs/lucid/orm';
import encryption from '@adonisjs/core/services/encryption';
import Complaint from '#models/complaint';
export default class ComplaintWitness extends ComplaintWitnessSchema {
    static async encryptSensitiveData(data) {
        if (data.$dirty.fullName) {
            data.fullName = encryption.encrypt(data.fullName);
        }
        if (data.$dirty.telephone) {
            data.telephone = encryption.encrypt(data.telephone);
        }
    }
    static async decryptSensitiveFields(data) {
        if (data.fullName) {
            data.fullName = encryption.decrypt(data.fullName) || data.fullName;
        }
        if (data.telephone) {
            data.telephone = encryption.decrypt(data.telephone) || data.telephone;
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
    belongsTo(() => Complaint),
    __metadata("design:type", Object)
], ComplaintWitness.prototype, "complaint", void 0);
__decorate([
    beforeSave(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ComplaintWitness]),
    __metadata("design:returntype", Promise)
], ComplaintWitness, "encryptSensitiveData", null);
__decorate([
    afterFetch(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ComplaintWitness, "decryptSensitiveData", null);
__decorate([
    afterFind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplaintWitness, "decryptSensitiveDataSingle", null);
//# sourceMappingURL=complaint_witness.js.map