import { BaseTransformer } from '@adonisjs/core/transformers';
export default class UserModuleActionTransformer extends BaseTransformer {
    toObject() {
        return this.pick(this.resource, ['id', 'userModuleId', 'action', 'code']);
    }
}
//# sourceMappingURL=user_module_action_transformer.js.map