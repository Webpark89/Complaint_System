import { FormSubjectUserGroupSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { Auditable } from '@filipebraida/adonis-auditing'
import { withAuditTitles, type AuditTitleRelation } from '#mixins/auditable_with_titles'

export default class FormSubjectUserGroup extends compose(
  FormSubjectUserGroupSchema,
  Auditable,
  withAuditTitles
) {
  static auditTitleRelations: AuditTitleRelation[] = [
    { foreignKey: 'formSubjectId', relatedModel: () => import('#models/form_subject') },
    { foreignKey: 'userGroupId', relatedModel: () => import('#models/user_group') },
  ]
}
