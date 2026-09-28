import mail from '@adonisjs/mail/services/main';
import { appUrl } from '#config/app';
import UserGroup from '#models/user_group';
import Complaint from '#models/complaint';
import { urlFor } from '@adonisjs/core/services/url_builder';
import { ComplaintStatusTitle, getEnumByValue } from '#contracts/enum';
export class MailService {
    static async sendMailComplaint(complaint_id, userGroups) {
        const complaint = await Complaint.query()
            .preload('formCategory')
            .preload('formSubject')
            .preload('organization')
            .preload('complaintFiles')
            .where('id', complaint_id)
            .firstOrFail();
        const users = await UserGroup.query()
            .preload('users', (us) => us.select('email'))
            .whereIn('id', userGroups);
        const emails = [...new Set(users.flatMap((ug) => ug.users.flatMap((u) => u.email)))];
        if (emails.length > 0) {
            await mail.send((message) => {
                message
                    .to(emails.join(','))
                    .subject(`เรื่องร้องเรียน ${complaint.code} ${complaint.formCategory.title}`)
                    .htmlView('emails/complaint_html', {
                    code: complaint.code,
                    category: complaint.formCategory.title,
                    subject: complaint.formSubject.title,
                    subject_other: complaint.formSubjectOther,
                    location: complaint.organization.title,
                    incident_date: complaint.incidentAt.toFormat('dd/MM/yyyy'),
                    incident_time: complaint.incidentAt.toFormat('HH:mm'),
                    detail: complaint.detail,
                    file_count: complaint.complaintFiles?.length ?? 0,
                    update_date: (complaint.updatedAt ?? complaint.createdAt).toFormat('dd/MM/yyyy'),
                    update_time: (complaint.updatedAt ?? complaint.createdAt).toFormat('HH:mm'),
                    due_date: complaint.dueDate ? complaint.dueDate.toFormat('dd/MM/yyyy HH:mm') : null,
                    status: getEnumByValue(ComplaintStatusTitle, complaint.status),
                    linkUrl: urlFor('admin.complaints.edit', { id: complaint_id }, { prefixUrl: appUrl }),
                });
            });
        }
    }
    static async sendMailComplaintDueTomorrow(complaint, emails) {
        const recipients = [...new Set(emails.filter(Boolean))];
        if (recipients.length === 0)
            return;
        for (const email of recipients) {
            await mail.send((message) => {
                message
                    .to(email)
                    .subject(`แจ้งเตือนเรื่องร้องเรียนใกล้ครบกำหนด  ${complaint.code} ${complaint.formCategory.title}`)
                    .htmlView('emails/complaint_html', {
                    code: complaint.code,
                    category: complaint.formCategory.title,
                    subject: complaint.formSubject.title,
                    subject_other: complaint.formSubjectOther,
                    location: complaint.organization.title,
                    incident_date: complaint.incidentAt.toFormat('dd/MM/yyyy'),
                    incident_time: complaint.incidentAt.toFormat('HH:mm'),
                    detail: complaint.detail,
                    file_count: complaint.complaintFiles?.length ?? 0,
                    update_date: (complaint.updatedAt ?? complaint.createdAt).toFormat('dd/MM/yyyy'),
                    update_time: (complaint.updatedAt ?? complaint.createdAt).toFormat('HH:mm'),
                    due_date: complaint.dueDate ? complaint.dueDate.toFormat('dd/MM/yyyy HH:mm') : null,
                    status: `${getEnumByValue(ComplaintStatusTitle, complaint.status)} (ใกล้ครบกำหนด)`,
                    linkUrl: urlFor(complaint.isSensitive ? 'admin.complaints_sensitive.edit' : 'admin.complaints.edit', { id: complaint.id }, { prefixUrl: appUrl }),
                });
            });
        }
    }
}
//# sourceMappingURL=mail_service.js.map