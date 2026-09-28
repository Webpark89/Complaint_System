var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { UserGroupUserSchema } from '#database/schema';
import { belongsTo } from '@adonisjs/lucid/orm';
import { compose } from '@adonisjs/core/helpers';
import { Auditable } from '@filipebraida/adonis-auditing';
import { withAuditTitles } from '#mixins/auditable_with_titles';
import UserGroup from '#models/user_group';
import User from '#models/user';
export default class UserGroupUser extends compose(UserGroupUserSchema, Auditable, withAuditTitles) {
    static auditTitleRelations = [
        { foreignKey: 'userGroupId', relatedModel: () => import('#models/user_group') },
        { foreignKey: 'userId', relatedModel: () => import('#models/user'), titleColumn: 'fullName' },
    ];
}
__decorate([
    belongsTo(() => UserGroup, {
        localKey: 'id',
        foreignKey: 'userGroupId',
    }),
    __metadata("design:type", Object)
], UserGroupUser.prototype, "userGroup", void 0);
__decorate([
    belongsTo(() => User, {
        localKey: 'id',
        foreignKey: 'userId',
    }),
    __metadata("design:type", Object)
], UserGroupUser.prototype, "user", void 0);
//# sourceMappingURL=user_group_user.js.map