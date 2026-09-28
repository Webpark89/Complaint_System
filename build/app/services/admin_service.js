import User from '#models/user';
export default class AdminService {
    ctx;
    constructor(ctx) {
        this.ctx = ctx;
    }
    get user() {
        return this.ctx.auth.user;
    }
    async nav() {
        if (!this.user)
            return {};
        const user = await User.findOrFail(this.user.id);
        return user.load('permissions');
    }
}
//# sourceMappingURL=admin_service.js.map