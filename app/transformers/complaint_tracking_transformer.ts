import { BaseTransformer } from '@adonisjs/core/transformers'
import type ComplaintTracking from '#models/complaint_tracking'
import {
  ApproveStatusTitle,
  ComplaintStatusTitle,
  ComplaintTrackingModeTitle,
  ComplaintTrackingStatusTitle,
  getEnumByValue,
  IsComplexTitle,
  IsSensitiveTitle,
} from '#contracts/enum'
import UserTransformer from '#transformers/user_transformer'
import ComplaintTransformer from '#transformers/complaint_transformer'
import { signedUrlFor } from '@adonisjs/core/services/url_builder'

export default class ComplaintTrackingTransformer extends BaseTransformer<ComplaintTracking> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'remark', 'status', 'createdAt', 'updatedAt']),
      status_title: getEnumByValue(ComplaintStatusTitle, this.resource.status),
    }
  }

  forAdminListObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'remark',
        'updatedAt',
        'dueDate',
        'dueDateExtend',
        // 'isDueDateExtend',
        'trackingStatus',
        // 'oldValues',
        // 'newValues',
        // 'mode',
      ]),

      Owner: this.resource.ownedUser
        ? UserTransformer.transform(this.resource.ownedUser).useVariant('forAdminUserGroupObject')
        : null,
      updated_user: this.resource.updatedUser
        ? UserTransformer.transform(this.resource.updatedUser).useVariant('forAdminUserGroupObject')
        : null,
      status: getEnumByValue(ComplaintStatusTitle, this.resource.status),
      status_id: this.resource.status,
      tracking_status: getEnumByValue(ComplaintTrackingStatusTitle, this.resource.trackingStatus),
      tracking_status_id: this.resource.trackingStatus,
      approve_status_title: getEnumByValue(ApproveStatusTitle, this.resource.approveStatus),
      approve_status: this.resource.approveStatus,
      mode_id: this.resource.mode,
      mode: getEnumByValue(ComplaintTrackingModeTitle, this.resource.mode),

      Complaint: this.resource.complaint
        ? ComplaintTransformer.transform(this.resource.complaint)
            .useVariant('forAdminObject')
            .depth(2)
        : null,
    }
  }

  toAdminObject() {
    const rawFiles = [
      this.resource.file1,
      this.resource.file2,
      this.resource.file3,
      this.resource.file4,
      this.resource.file5,
    ].filter(Boolean) as string[]

    const files = rawFiles.map((file) => ({
      file,
      fileUrl: signedUrlFor('admin.complaints.file', { filename: file }, { expiresIn: '1 days' }),
    }))

    return {
      ...this.pick(this.resource, [
        'id',
        'remark',
        'detail',
        'summary',
        'updatedAt',
        'dueDate',
        'dueDateExtend',
        // 'isDueDateExtend',
        'trackingStatus',
        'oldValues',
        'newValues',
        // 'mode',
      ]),
      file_1: this.resource.file1
        ? signedUrlFor(
            'admin.complaints.file',
            { filename: this.resource.file1 },
            { expiresIn: '1 days' }
          )
        : null,
      file_2: this.resource.file2
        ? signedUrlFor(
            'admin.complaints.file',
            { filename: this.resource.file2 },
            { expiresIn: '1 days' }
          )
        : null,
      file_3: this.resource.file3
        ? signedUrlFor(
            'admin.complaints.file',
            { filename: this.resource.file3 },
            { expiresIn: '1 days' }
          )
        : null,
      file_4: this.resource.file4
        ? signedUrlFor(
            'admin.complaints.file',
            { filename: this.resource.file4 },
            { expiresIn: '1 days' }
          )
        : null,
      file_5: this.resource.file5
        ? signedUrlFor(
            'admin.complaints.file',
            { filename: this.resource.file5 },
            { expiresIn: '1 days' }
          )
        : null,
      files,

      Owner: this.resource.ownedUser
        ? UserTransformer.transform(this.resource.ownedUser).useVariant('forAdminUserGroupObject')
        : null,
      updated_user: this.resource.updatedUser
        ? UserTransformer.transform(this.resource.updatedUser)
            .useVariant('forAdminComplaintObject')
            .depth(2)
        : null,
      status: getEnumByValue(ComplaintStatusTitle, this.resource.status),
      status_id: this.resource.status,
      tracking_status: getEnumByValue(ComplaintTrackingStatusTitle, this.resource.trackingStatus),
      tracking_status_id: this.resource.trackingStatus,
      approve_status: getEnumByValue(ApproveStatusTitle, this.resource.approveStatus),
      approve_status_id: this.resource.approveStatus,
      mode_id: this.resource.mode,
      mode: getEnumByValue(ComplaintTrackingModeTitle, this.resource.mode),

      userGroups: this.resource.userGroups,

      changes: {
        status: this.resource.newValues?.status
          ? [
              'สถานะ',
              getEnumByValue(ComplaintStatusTitle, this.resource.oldValues?.status),
              getEnumByValue(ComplaintStatusTitle, this.resource.newValues?.status),
            ]
          : undefined,
        approve_status: this.resource.newValues?.approveStatus
          ? [
              'สถานะการอนุมัติ',
              getEnumByValue(ApproveStatusTitle, this.resource.oldValues?.approveStatus),
              getEnumByValue(ApproveStatusTitle, this.resource.newValues?.approveStatus),
            ]
          : undefined,
        isSensitive: this.resource.newValues?.isSensitive
          ? [
              'ข้อมูลอ่อนไหว',
              IsSensitiveTitle(this.resource.oldValues?.isSensitive),
              IsSensitiveTitle(this.resource.newValues?.isSensitive),
            ]
          : undefined,
        isComplex: this.resource.newValues?.isComplex
          ? [
              'ข้อมูลซับซ้อน',
              IsComplexTitle(this.resource.oldValues?.isComplex),
              IsComplexTitle(this.resource.newValues?.isComplex),
            ]
          : undefined,
      },
    }
  }
}
