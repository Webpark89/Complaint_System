var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { UserRolePermissionSchema } from '#database/schema';
import { belongsTo, hasManyThrough } from '@adonisjs/lucid/orm';
import { compose } from '@adonisjs/core/helpers';
import { Auditable } from '@filipebraida/adonis-auditing';
import { withAuditTitles } from '#mixins/auditable_with_titles';
import UserRole from '#models/user_role';
import UserModuleAction from '#models/user_module_action';
import UserModule from '#models/user_module';
export default class UserRolePermission extends compose(UserRolePermissionSchema, Auditable, withAuditTitles) {
    static auditTitleRelations = [
        { foreignKey: 'userRoleId', relatedModel: () => import('#models/user_role') },
        {
            foreignKey: 'userModuleActionId',
            relatedModel: () => import('#models/user_module_action'),
            titleColumn: 'action',
        },
    ];
}
__decorate([
    belongsTo(() => UserRole),
    __metadata("design:type", Object)
], UserRolePermission.prototype, "userRole", void 0);
__decorate([
    belongsTo(() => UserModuleAction),
    __metadata("design:type", Object)
], UserRolePermission.prototype, "userModuleActions", void 0);
__decorate([
    hasManyThrough([() => UserModule, () => UserModuleAction], {
        localKey: 'userModuleActionId',
        foreignKey: 'id',
        throughForeignKey: 'id',
        throughLocalKey: 'userModuleId',
    }),
    __metadata("design:type", Object)
], UserRolePermission.prototype, "userModules", void 0);
//# sourceMappingURL=user_role_permission.js.map