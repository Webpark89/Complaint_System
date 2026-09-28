import { BaseTransformer } from '@adonisjs/core/transformers'
import type Complaint from '#models/complaint'
import FormCategoryTransformer from '#transformers/form_category_transformer'
import FormSubjectTransformer from '#transformers/form_subject_transformer'
import OrganizationTransformer from '#transformers/organization_transformer'
import ComplaintAnswerTransformer from '#transformers/complaint_answer_transformer'
import ComplaintFileTransformer from '#transformers/complaint_file_transformer'
import ComplaintWitnessTransformer from '#transformers/complaint_witness_transformer'
import ComplaintTrackingTransformer from '#transformers/complaint_tracking_transformer'
import { ComplaintStatusTitle, getEnumByValue, IsSensitiveTitle } from '#contracts/enum'
import { urlFor } from '@adonisjs/core/services/url_builder'
import UserTransformer from '#transformers/user_transformer'

export default class ComplaintTransformer extends BaseTransformer<Complaint> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'code',
        'complainantEmail',
        'complainantFullName',
        'complainantTelephone',
        'consent',
        'detail',
        'formCategoryId',
        'formId',
        'formSubjectId',
        'formSubjectOther',
        'hasWitness',
        'incidentAt',
        'isAnonymous',
        'organizationId',
        'status',
        'title',
        'createdAt',
        'updatedAt',
      ]),
      FormCategory: FormCategoryTransformer.transform(this.whenLoaded(this.resource.formCategory)),
      FormSubject: FormSubjectTransformer.transform(this.whenLoaded(this.resource.formSubject)),
      Organization: OrganizationTransformer.transform(this.whenLoaded(this.resource.organization)),
      Answers: ComplaintAnswerTransformer.transform(
        this.whenLoaded(this.resource.complaintAnswers)
      ),
      Files: ComplaintFileTransformer.transform(this.whenLoaded(this.resource.complaintFiles)),
      Witnesses: ComplaintWitnessTransformer.transform(
        this.whenLoaded(this.resource.complaintWitnesses)
      ),
      Owner: this.resource.ownedUser
        ? UserTransformer.transform(this.resource.ownedUser).useVariant('forAdminUserGroupObject')
        : null,
      // Trackings: this.resource.complaintTrackings
      //   ? ComplaintTrackingTransformer.transform(this.resource.complaintTrackings)
      //   : null,
    }
  }

  forTrackingFrontObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'code',
        // 'complainantEmail',
        // 'complainantFullName',
        // 'complainantTelephone',
        // 'consent',
        'detail',
        // 'formCategoryId',
        // 'formId',
        // 'formSubjectId',
        'formSubjectOther',
        // 'hasWitness',
        'incidentAt',
        // 'isAnonymous',
        'organizationId',
        'status',
        'title',
        'createdAt',
        'updatedAt',
      ]),
      status_title: getEnumByValue(ComplaintStatusTitle, this.resource.status),
      FormCategory: FormCategoryTransformer.transform(this.whenLoaded(this.resource.formCategory)),
      FormSubject: FormSubjectTransformer.transform(this.whenLoaded(this.resource.formSubject)),
      Organization: OrganizationTransformer.transform(this.whenLoaded(this.resource.organization)),
      Trackings: this.resource.complaintTrackings
        ? ComplaintTrackingTransformer.transform(this.resource.complaintTrackings)
        : null,
    }
  }

  forAdminListObject() {
    const baseUrl = this.resource.isSensitive ? 'admin.complaints_sensitive' : 'admin.complaints'
    // const updatedUser = this.resource.complaintTrackingLast?.$preloaded?.updatedUser
    return {
      ...this.pick(this.resource, [
        'id',
        'code',
        'formSubjectOther',
        'isSensitive',
        'isComplex',
        // 'priority',
        // 'status',
        'dueDate',
        'title',
        'createdAt',
        'updatedAt',
      ]),
      status: getEnumByValue(ComplaintStatusTitle, this.resource.status),
      status_id: this.resource.status,
      count_tracking_overdue: Number(this.resource.$extras.count_tracking_overdue ?? 0),
      isSensitiveTitle: IsSensitiveTitle(this.resource.isSensitive),
      FormCategory: this.resource.formCategory
        ? FormCategoryTransformer.transform(this.resource.formCategory)
        : null,
      FormSubject: this.resource.formSubject
        ? FormSubjectTransformer.transform(this.resource.formSubject).useVariant('forAdminObject')
        : null,
      Organization: this.resource.organization
        ? OrganizationTransformer.transform(this.resource.organization)
        : null,
      Owner: this.resource.ownedUser
        ? UserTransformer.transform(this.resource.ownedUser).useVariant('forAdminUserGroupObject')
        : null,
      updated_user: this.resource.updatedUser
        ? UserTransformer.transform(this.resource.updatedUser).useVariant('forAdminUserGroupObject')
        : null,
      view_url: urlFor(`${baseUrl}.show`, { id: this.resource.id }),
      edit_url:
        this.resource.complaintTrackingLast?.userGroups?.length > 0
          ? urlFor(`${baseUrl}.edit`, { id: this.resource.id })
          : null,
      // Answers: this.resource.complaintAnswers
      //   ? ComplaintAnswerTransformer.transform(this.resource.complaintAnswers)
      //   : null,
      // Files: this.resource.complaintFiles
      //   ? ComplaintFileTransformer.transform(this.resource.complaintFiles)
      //   : null,
      // Witnesses: this.resource.complaintWitnesses
      //   ? ComplaintWitnessTransformer.transform(this.resource.complaintWitnesses)
      //   : null,
      // Trackings: this.resource.complaintTrackings
      //   ? ComplaintTrackingTransformer.transform(this.resource.complaintTrackings)
      //   : null,
      TrackingLast: this.resource.complaintTrackingLast
        ? ComplaintTrackingTransformer.transform(this.resource.complaintTrackingLast).useVariant(
            'forAdminListObject'
          )
        : null,
    }
  }

  forAdminObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'code',
        'complainantEmail',
        'complainantFullName',
        'complainantTelephone',
        'consent',
        'detail',
        // 'formCategoryId',
        // 'formId',
        // 'formSubjectId',
        'formSubjectOther',
        'hasWitness',
        'incidentAt',
        'isAnonymous',
        'isSensitive',
        'isComplex',
        'organizationId',
        // 'priority',
        'dueDate',
        'title',
        'status',
        'updatedAt',
      ]),
      status_title: getEnumByValue(ComplaintStatusTitle, this.resource.status),
      // status_id: this.resource.status,
      FormCategory: this.resource.formCategory
        ? FormCategoryTransformer.transform(this.resource.formCategory)
        : null,
      FormSubject: this.resource.formSubject
        ? FormSubjectTransformer.transform(this.resource.formSubject)
        : null,
      Organization: this.resource.organization
        ? OrganizationTransformer.transform(this.resource.organization)
        : null,
      Answers: this.resource.complaintAnswers
        ? ComplaintAnswerTransformer.transform(this.resource.complaintAnswers).depth(2)
        : null,
      Files: this.resource.complaintFiles
        ? ComplaintFileTransformer.transform(this.resource.complaintFiles).useVariant(
            'toAdminObjectWithStreamUrl'
            // 'toAdminObjectWithSignedUrl'
          )
        : null,
      Witnesses: this.resource.complaintWitnesses
        ? ComplaintWitnessTransformer.transform(this.resource.complaintWitnesses)
        : null,
      Trackings: this.resource.complaintTrackings
        ? ComplaintTrackingTransformer.transform(this.resource.complaintTrackings)
            .useVariant('toAdminObject')
            .depth(3)
        : null,
      TrackingLast: this.resource.complaintTrackingLast
        ? ComplaintTrackingTransformer.transform(this.resource.complaintTrackingLast)
            .useVariant('toAdminObject')
            .depth(4)
        : null,
      Owner: this.resource.ownedUser
        ? UserTransformer.transform(this.resource.ownedUser).useVariant('forAdminUserGroupObject')
        : null,
      is_current_user_group: false,
    }
  }
}
