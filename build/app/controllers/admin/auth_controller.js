export default class AuthController {
    async index({ inertia }) {
        return inertia.render('auth/login', {});
    }
    async logout({ auth, request, response }) {
        await auth.user?.auditCustom('logout', {
            new: { email: auth.user.email },
            tags: ['authen'],
            metadata: { status: 'success' },
        });
        await auth.use('admin').logout();
        if (request.header('referer', '')?.includes('/process')) {
            return response.redirect().toRoute('admin.login');
        }
        return response.redirect().back();
    }
}
//# sourceMappingURL=auth_controller.js.map