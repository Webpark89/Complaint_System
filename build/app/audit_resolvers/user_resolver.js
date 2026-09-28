export default class UserResolverImpl {
    async resolve(ctx) {
        if (ctx === undefined)
            return { type: 'User', id: '' };
        const user = ctx.auth?.user;
        if (!user)
            return { type: 'User', id: '' };
        return { type: user.constructor.name, id: String(user.id) };
    }
}
//# sourceMappingURL=user_resolver.js.map