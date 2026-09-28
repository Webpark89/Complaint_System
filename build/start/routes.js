import { middleware } from '#start/kernel';
import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';
router.on('/').renderInertia('home/index', {}).as('home');
router.get('/tracking', [controllers.front.Home, 'tracking']).as('tracking');
router.post('/tracking', [controllers.front.Home, 'trackingStatus']).as('tracking_status');
router
    .group(() => {
    router.get('/', [controllers.front.Complaint, 'index']);
    router.post('/', [controllers.front.Complaint, 'indexConsent']);
    router.get('/category', [controllers.front.Complaint, 'category']);
    router
        .post('/category', [controllers.front.Complaint, 'formCategory'])
        .as('complaint.form.category.post');
    router.get('/form', [controllers.front.Complaint, 'form']);
    router.post('/form/upload', [controllers.front.Complaint, 'uploadFiles']);
    router.post('/form/upload/remove', [controllers.front.Complaint, 'removeUploadedFile']);
    router.post('/form/2', [controllers.front.Complaint, 'formIncident']);
    router.post('/form/3', [controllers.front.Complaint, 'formComplainant']);
    router.post('/form/confirm', [controllers.front.Complaint, 'formConfirm']);
    router.get('/thank', [controllers.front.Complaint, 'thank']);
})
    .prefix('/complaint')
    .as('complaint');
router.get('/oauth/google/redirect', [controllers.admin.Oauths, 'redirect']);
router.get('/oauth/google/callback', [controllers.admin.Oauths, 'callback']);
router
    .group(() => {
    router.get('/login', [controllers.admin.Auth, 'index']).as('login');
})
    .prefix('/process')
    .as('admin');
router
    .group(() => {
    router.on('/').redirect('admin.dashboard').as('admin-home');
    router.get('/dashboard', [controllers.admin.Dashboard, 'index']).as('dashboard');
    router.post('/dashboard', [controllers.admin.Dashboard, 'data']).as('dashboard-data');
    router
        .resource('/complaint', controllers.admin.Complaints)
        .only(['index', 'show', 'edit', 'update'])
        .as('complaints');
    router.post('/complaint/files/upload', [controllers.admin.Complaints, 'uploadFile']);
    router.post('/complaint/files/upload/remove', [
        controllers.admin.Complaints,
        'removeUploadedFile',
    ]);
    router.post('/complaint_sensitive/files/upload', [
        controllers.admin.ComplaintsSensitive,
        'uploadFile',
    ]);
    router.post('/complaint_sensitive/files/upload/remove', [
        controllers.admin.ComplaintsSensitive,
        'removeUploadedFile',
    ]);
    router
        .resource('/complaint_sensitive', controllers.admin.ComplaintsSensitive)
        .only(['index', 'show', 'edit', 'update'])
        .as('complaints_sensitive');
    router
        .resource('/complaint_extend', controllers.admin.ComplaintsExtend)
        .only(['index', 'show', 'edit', 'update'])
        .as('complaints_extend');
    router
        .get('/complaints/file/:filename', [controllers.admin.Complaints, 'stream'])
        .as('complaints.file');
    router.resource('/form_categories', controllers.admin.FormCategories).as('form_categories');
    router.resource('/form_subjects', controllers.admin.FormSubjects).as('form_subjects');
    router.resource('/forms', controllers.admin.Forms).as('forms');
    router
        .resource('/terms', controllers.admin.Terms)
        .as('terms')
        .only(['index', 'store', 'update']);
    router.resource('/sla', controllers.admin.Slas).as('sla').only(['index', 'update']);
    router.resource('/organizations', controllers.admin.Organizations).as('organizations');
    router.resource('/users', controllers.admin.Users).as('users');
    router.resource('/user_roles', controllers.admin.UserRoles).as('user_roles');
    router.resource('/user_groups', controllers.admin.UserGroups).as('user_groups');
    router
        .get('/report_complaint_summary', [controllers.admin.ReportComplaintSummaries, 'index'])
        .as('report_complaint_summary');
    router
        .get('/report_complaint_summary/export', [
        controllers.admin.ReportComplaintSummaries,
        'export',
    ])
        .as('report_complaint_summary-export');
    router.get('/report_sla', [controllers.admin.ReportSla, 'index']).as('report_sla');
    router
        .get('/report_sla/export', [controllers.admin.ReportSla, 'export'])
        .as('report_sla-export');
    router
        .get('/report_investigation', [controllers.admin.ReportInvestigation, 'index'])
        .as('report_investigation');
    router
        .get('/report_investigation/export', [controllers.admin.ReportInvestigation, 'export'])
        .as('report_investigation-export');
    router
        .get('/report_executive_summary', [controllers.admin.ReportExecutiveSummaries, 'index'])
        .as('report_executive_summary');
    router
        .get('/report_executive_summary/export', [
        controllers.admin.ReportExecutiveSummaries,
        'export',
    ])
        .as('report_executive_summary-export');
    router.get('/report_audit_log', [controllers.admin.ReportAuditLog, 'index']).as('report_audit');
    router
        .get('/report_audit_log/export', [controllers.admin.ReportAuditLog, 'export'])
        .as('report_audit_log-export');
    router.get('/audit_logs', [controllers.admin.AuditLogs, 'index']).as('audit_logs');
    router
        .get('/audit_logs/export', [controllers.admin.AuditLogs, 'export'])
        .as('audit_logs-export');
    router.get('/logout', [controllers.admin.Auth, 'logout']).as('logout');
})
    .prefix('/process')
    .use([middleware.adminAuth()])
    .as('admin');
//# sourceMappingURL=routes.js.map