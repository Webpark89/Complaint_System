export default class UserAgentResolver {
    async resolve(ctx) {
        return ctx.request.header('user-agent') ?? null;
    }
}
//# sourceMappingURL=user_agent_resolver.js.map