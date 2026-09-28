var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ComplaintTrackingSchema } from '#database/schema';
import { belongsTo, manyToMany } from '@adonisjs/lucid/orm';
import { compose } from '@adonisjs/core/helpers';
import { Auditable } from '@filipebraida/adonis-auditing';
import { withAuditTitles } from '#mixins/auditable_with_titles';
import Complaint from '#models/complaint';
import UserGroup from '#models/user_group';
import User from '#models/user';
export default class ComplaintTracking extends compose(ComplaintTrackingSchema, Auditable, withAuditTitles) {
    static auditTitleRelations = [
        {
            foreignKey: 'complaintId',
            relatedModel: () => import('#models/complaint'),
            titleColumn: 'code',
            titleKey: 'complaintCode',
        },
        {
            foreignKey: 'createdBy',
            relatedModel: () => import('#models/user'),
            titleColumn: 'fullName',
            titleKey: 'createdByName',
        },
        {
            foreignKey: 'updatedBy',
            relatedModel: () => import('#models/user'),
            titleColumn: 'fullName',
            titleKey: 'updatedByName',
        },
        {
            foreignKey: 'ownedBy',
            relatedModel: () => import('#models/user'),
            titleColumn: 'fullName',
            titleKey: 'ownedByName',
        },
    ];
}
__decorate([
    belongsTo(() => Complaint),
    __metadata("design:type", Object)
], ComplaintTracking.prototype, "complaint", void 0);
__decorate([
    manyToMany(() => UserGroup, {
        pivotTable: 'complaint_tracking_user_groups',
        pivotForeignKey: 'complaint_tracking_id',
        pivotRelatedForeignKey: 'user_group_id',
    }),
    __metadata("design:type", Object)
], ComplaintTracking.prototype, "userGroups", void 0);
__decorate([
    belongsTo(() => User, {
        foreignKey: 'createdBy',
    }),
    __metadata("design:type", Object)
], ComplaintTracking.prototype, "createdUser", void 0);
__decorate([
    belongsTo(() => User, {
        foreignKey: 'updatedBy',
    }),
    __metadata("design:type", Object)
], ComplaintTracking.prototype, "updatedUser", void 0);
__decorate([
    belongsTo(() => User, {
        foreignKey: 'ownedBy',
    }),
    __metadata("design:type", Object)
], ComplaintTracking.prototype, "ownedUser", void 0);
//# sourceMappingURL=complaint_tracking.js.map