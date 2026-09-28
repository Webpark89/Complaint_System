var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { FormCategorySchema } from '#database/schema';
import { hasMany } from '@adonisjs/lucid/orm';
import { compose } from '@adonisjs/core/helpers';
import { Auditable } from '@filipebraida/adonis-auditing';
import { withAuditTitles } from '#mixins/auditable_with_titles';
import FormSubject from '#models/form_subject';
import Form from '#models/form';
export default class FormCategory extends compose(FormCategorySchema, Auditable, withAuditTitles) {
}
__decorate([
    hasMany(() => FormSubject),
    __metadata("design:type", Object)
], FormCategory.prototype, "formSubjects", void 0);
__decorate([
    hasMany(() => Form),
    __metadata("design:type", Object)
], FormCategory.prototype, "forms", void 0);
//# sourceMappingURL=form_category.js.map