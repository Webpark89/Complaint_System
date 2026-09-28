var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { FormQuestionSchema } from '#database/schema';
import { belongsTo } from '@adonisjs/lucid/orm';
import { compose } from '@adonisjs/core/helpers';
import { Auditable } from '@filipebraida/adonis-auditing';
import { withAuditTitles } from '#mixins/auditable_with_titles';
import Form from '#models/form';
import FormSection from '#models/form_section';
export default class FormQuestion extends compose(FormQuestionSchema, Auditable, withAuditTitles) {
    static auditTitleRelations = [
        { foreignKey: 'formId', relatedModel: () => import('#models/form') },
        { foreignKey: 'formSectionId', relatedModel: () => import('#models/form_section') },
    ];
}
__decorate([
    belongsTo(() => Form),
    __metadata("design:type", Object)
], FormQuestion.prototype, "form", void 0);
__decorate([
    belongsTo(() => FormSection),
    __metadata("design:type", Object)
], FormQuestion.prototype, "formSection", void 0);
//# sourceMappingURL=form_question.js.map