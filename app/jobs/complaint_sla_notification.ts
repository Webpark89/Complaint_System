import { Job } from '@adonisjs/queue'
import type { JobOptions } from '@adonisjs/queue/types'
import Complaint from '#models/complaint'
import { MailService } from '#services/mail_service'
import { DateTime } from 'luxon'

interface ComplaintSlaNotificationPayload {
  // Define your payload type here
}

export default class ComplaintSlaNotification extends Job<ComplaintSlaNotificationPayload> {
  static options: JobOptions = {
    queue: 'default',
    maxRetries: 3,
  }

  async execute() {
    const dueDate = DateTime.now().startOf('day').plus({ days: 1 }).toSQLDate()!
    const complaints = await Promise.all(
      [false, true].map((isSensitive) =>
        Complaint.query()
          .where('isSensitive', isSensitive)
          .where('dueDate', dueDate)
          .preload('formCategory')
          .preload('formSubject')
          .preload('organization')
          .preload('complaintFiles')
          .preload('complaintTrackingLast', (trackingQuery) =>
            trackingQuery.preload('userGroups', (userGroupsQuery) =>
              userGroupsQuery.preload('users', (usersQuery) => {
                if (isSensitive) {
                  usersQuery.whereHas('userRole', (roleQuery) =>
                    roleQuery.whereHas('userRolePermissions', (permissionQuery) =>
                      permissionQuery.whereHas('userModuleActions', (moduleActionQuery) =>
                        moduleActionQuery
                          .where('code', 'view')
                          .whereHas('userModule', (moduleQuery) =>
                            moduleQuery.where('module', 'complaint_sensitive')
                          )
                      )
                    )
                  )
                }
              })
            )
          )
      )
    )

    for (const complaint of complaints.flat()) {
      const emails = [
        ...new Set(
          (complaint.complaintTrackingLast?.userGroups ?? []).flatMap((userGroup) =>
            userGroup.users.map((user) => user.email)
          )
        ),
      ]

      await MailService.sendMailComplaintDueTomorrow(complaint, emails)
    }
  }

  async failed(error: Error) {
    console.error('ComplaintSlaNotification failed:', error.message)
  }
}
