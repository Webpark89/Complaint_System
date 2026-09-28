var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { FormSubjectSchema } from '#database/schema';
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm';
import { compose } from '@adonisjs/core/helpers';
import { Auditable } from '@filipebraida/adonis-auditing';
import { withAuditTitles } from '#mixins/auditable_with_titles';
import FormCategory from '#models/form_category';
import Complaint from '#models/complaint';
import UserGroup from '#models/user_group';
export default class FormSubject extends compose(FormSubjectSchema, Auditable, withAuditTitles) {
    static auditTitleRelations = [
        { foreignKey: 'formCategoryId', relatedModel: () => import('#models/form_category') },
    ];
}
__decorate([
    belongsTo(() => FormCategory),
    __metadata("design:type", Object)
], FormSubject.prototype, "formCategory", void 0);
__decorate([
    hasMany(() => Complaint),
    __metadata("design:type", Object)
], FormSubject.prototype, "complaints", void 0);
__decorate([
    manyToMany(() => UserGroup, {
        pivotTable: 'form_subject_user_groups',
        pivotForeignKey: 'form_subject_id',
        pivotRelatedForeignKey: 'user_group_id',
        onQuery: (query) => query.where('form_subject_user_groups.step', 1),
    }),
    __metadata("design:type", Object)
], FormSubject.prototype, "userGroups1", void 0);
__decorate([
    manyToMany(() => UserGroup, {
        pivotTable: 'form_subject_user_groups',
        pivotForeignKey: 'form_subject_id',
        pivotRelatedForeignKey: 'user_group_id',
        onQuery: (query) => query.where('form_subject_user_groups.step', 2),
    }),
    __metadata("design:type", Object)
], FormSubject.prototype, "userGroups2", void 0);
__decorate([
    manyToMany(() => UserGroup, {
        pivotTable: 'form_subject_user_groups',
        pivotForeignKey: 'form_subject_id',
        pivotRelatedForeignKey: 'user_group_id',
        onQuery: (query) => query.where('form_subject_user_groups.step', 25),
    }),
    __metadata("design:type", Object)
], FormSubject.prototype, "userGroups2S", void 0);
__decorate([
    manyToMany(() => UserGroup, {
        pivotTable: 'form_subject_user_groups',
        pivotForeignKey: 'form_subject_id',
        pivotRelatedForeignKey: 'user_group_id',
        onQuery: (query) => query.where('form_subject_user_groups.step', 3),
    }),
    __metadata("design:type", Object)
], FormSubject.prototype, "userGroups3", void 0);
__decorate([
    manyToMany(() => UserGroup, {
        pivotTable: 'form_subject_user_groups',
        pivotForeignKey: 'form_subject_id',
        pivotRelatedForeignKey: 'user_group_id',
        onQuery: (query) => query.where('form_subject_user_groups.step', 4),
    }),
    __metadata("design:type", Object)
], FormSubject.prototype, "userGroups4", void 0);
//# sourceMappingURL=form_subject.js.map