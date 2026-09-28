import { BaseTransformer } from '@adonisjs/core/transformers';
export default class ComplaintWitnessTransformer extends BaseTransformer {
    toObject() {
        return this.pick(this.resource, ['id', 'fullName', 'telephone']);
    }
}
//# sourceMappingURL=complaint_witness_transformer.js.map