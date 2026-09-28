import ComplaintSlaNotification from '#jobs/complaint_sla_notification';
ComplaintSlaNotification.schedule({})
    .id('complaint-sla-notification')
    .cron('0 8 * * *')
    .timezone('Asia/Bangkok')
    .run();
//# sourceMappingURL=scheduler.js.map