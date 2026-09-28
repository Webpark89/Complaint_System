import { FormSubjectUserGroupSchema } from '#database/schema';
import { compose } from '@adonisjs/core/helpers';
import { Auditable } from '@filipebraida/adonis-auditing';
import { withAuditTitles } from '#mixins/auditable_with_titles';
export default class FormSubjectUserGroup extends compose(FormSubjectUserGroupSchema, Auditable, withAuditTitles) {
    static auditTitleRelations = [
        { foreignKey: 'formSubjectId', relatedModel: () => import('#models/form_subject') },
        { foreignKey: 'userGroupId', relatedModel: () => import('#models/user_group') },
    ];
}
//# sourceMappingURL=form_subject_user_group.js.map