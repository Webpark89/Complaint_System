import { complaintTrackingFrontValidator } from '#validators/complaint';
import Complaint from '#models/complaint';
import ComplaintTransformer from '#transformers/complaint_transformer';
export default class HomeController {
    async index({ inertia }) {
        return inertia.render('home/index', {});
    }
    async tracking({ inertia }) {
        return inertia.render('home/tracking', {});
    }
    async trackingStatus({ inertia, request }) {
        const payload = await request.validateUsing(complaintTrackingFrontValidator);
        const data = await Complaint.query()
            .preload('formCategory')
            .preload('formSubject')
            .preload('organization')
            .preload('complaintTrackings', (q) => q.orderBy('id', 'desc'))
            .where('code', payload.code)
            .firstOrFail();
        const model = ComplaintTransformer.transform(data).useVariant('forTrackingFrontObject');
        return inertia.render('home/tracking', { model });
    }
}
//# sourceMappingURL=home_controller.js.map