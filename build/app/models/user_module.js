var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { UserModuleSchema } from '#database/schema';
import { hasMany, hasOne } from '@adonisjs/lucid/orm';
import UserModuleAction from '#models/user_module_action';
export default class UserModule extends UserModuleSchema {
}
__decorate([
    hasMany(() => UserModuleAction),
    __metadata("design:type", Object)
], UserModule.prototype, "userModuleActions", void 0);
__decorate([
    hasOne(() => UserModule, {
        localKey: 'parentModuleId',
        foreignKey: 'id',
    }),
    __metadata("design:type", Object)
], UserModule.prototype, "parentModule", void 0);
__decorate([
    hasMany(() => UserModule, {
        localKey: 'id',
        foreignKey: 'parentModuleId',
    }),
    __metadata("design:type", Object)
], UserModule.prototype, "children", void 0);
//# sourceMappingURL=user_module.js.map