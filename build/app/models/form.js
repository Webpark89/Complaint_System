var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { FormSchema } from '#database/schema';
import { belongsTo, hasMany } from '@adonisjs/lucid/orm';
import { compose } from '@adonisjs/core/helpers';
import { Auditable } from '@filipebraida/adonis-auditing';
import { withAuditTitles } from '#mixins/auditable_with_titles';
import FormCategory from '#models/form_category';
import FormQuestion from '#models/form_question';
export default class Form extends compose(FormSchema, Auditable, withAuditTitles) {
    static auditTitleRelations = [
        { foreignKey: 'formCategoryId', relatedModel: () => import('#models/form_category') },
    ];
}
__decorate([
    belongsTo(() => FormCategory),
    __metadata("design:type", Object)
], Form.prototype, "formCategory", void 0);
__decorate([
    hasMany(() => FormQuestion),
    __metadata("design:type", Object)
], Form.prototype, "formQuestions", void 0);
//# sourceMappingURL=form.js.map