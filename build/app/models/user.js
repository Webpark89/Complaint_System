var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { UserSchema } from '#database/schema';
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { Auditable } from '@filipebraida/adonis-auditing';
import { withAuditTitles } from '#mixins/auditable_with_titles';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { belongsTo, hasManyThrough } from '@adonisjs/lucid/orm';
import UserRole from '#models/user_role';
import UserRolePermission from '#models/user_role_permission';
import Organization from '#models/organization';
export default class User extends compose(UserSchema, withAuthFinder(hash), Auditable, withAuditTitles) {
    static auditTitleRelations = [
        { foreignKey: 'userRoleId', relatedModel: () => import('#models/user_role') },
        { foreignKey: 'organizationId', relatedModel: () => import('#models/organization') },
    ];
}
__decorate([
    belongsTo(() => UserRole),
    __metadata("design:type", Object)
], User.prototype, "userRole", void 0);
__decorate([
    belongsTo(() => Organization),
    __metadata("design:type", Object)
], User.prototype, "organization", void 0);
__decorate([
    hasManyThrough([() => UserRolePermission, () => UserRole], {
        localKey: 'userRoleId',
        foreignKey: 'id',
    }),
    __metadata("design:type", Object)
], User.prototype, "permissions", void 0);
//# sourceMappingURL=user.js.map