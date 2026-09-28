import { defineConfig } from '@filipebraida/adonis-auditing';
export default defineConfig({
    userResolver: () => import('#audit_resolvers/user_resolver'),
    resolvers: {
        ip_address: () => import('#audit_resolvers/ip_address_resolver'),
        user_agent: () => import('#audit_resolvers/user_agent_resolver'),
        url: () => import('#audit_resolvers/url_resolver'),
    },
    hiddenFields: ['password'],
    auditExclude: ['updatedAt', 'createdAt', 'deletedAt', 'createdBy', 'updatedBy', 'deletedBy'],
    skipIfOnlyChanged: ['loginAt'],
});
//# sourceMappingURL=auditing.js.map