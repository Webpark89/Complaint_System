var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ComplaintAnswerSchema } from '#database/schema';
import { belongsTo } from '@adonisjs/lucid/orm';
import Complaint from '#models/complaint';
import FormQuestion from '#models/form_question';
export default class ComplaintAnswer extends ComplaintAnswerSchema {
}
__decorate([
    belongsTo(() => Complaint),
    __metadata("design:type", Object)
], ComplaintAnswer.prototype, "complaint", void 0);
__decorate([
    belongsTo(() => FormQuestion, {
        foreignKey: 'formQuestionId',
    }),
    __metadata("design:type", Object)
], ComplaintAnswer.prototype, "question", void 0);
//# sourceMappingURL=complaint_answer.js.map