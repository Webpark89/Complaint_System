export default class IpAddressResolver {
    async resolve(ctx) {
        return ctx.request.ip();
    }
}
//# sourceMappingURL=ip_address_resolver.js.map