import Config, { ConfigID } from '#models/config';
import { configSLAAdminFormValidator } from '#validators/config';
export default class SlasController {
    async index({ inertia }) {
        const data = await Config.query()
            .whereIn('id', [
            ConfigID.ID_SLA_NEW,
            ConfigID.ID_SLA_IN_PROGRESS,
            ConfigID.ID_SLA_IN_PROGRESS_EXTEND,
            ConfigID.ID_SLA_INVESTIGATING_NORMAL,
            ConfigID.ID_SLA_INVESTIGATING_NORMAL_EXTEND,
            ConfigID.ID_SLA_INVESTIGATING_COMPLEX,
            ConfigID.ID_SLA_INVESTIGATING_COMPLEX_EXTEND,
        ])
            .orderBy('id')
            .select('value');
        const model = {
            new: data[0].$attributes.value,
            in_progress: data[1].$attributes.value,
            in_progress_extend: data[2].$attributes.value,
            investigating_normal: data[3].$attributes.value,
            investigating_normal_extend: data[4].$attributes.value,
            investigating_complex: data[5].$attributes.value,
            investigating_complex_extend: data[6].$attributes.value,
        };
        return inertia.render('admin/sla/index', { model });
    }
    async update({ request, response, auth }) {
        const data = await request.validateUsing(configSLAAdminFormValidator);
        const updates = [
            { id: ConfigID.ID_SLA_NEW, value: data.new },
            { id: ConfigID.ID_SLA_IN_PROGRESS, value: data.in_progress },
            { id: ConfigID.ID_SLA_IN_PROGRESS_EXTEND, value: data.in_progress_extend },
            { id: ConfigID.ID_SLA_INVESTIGATING_NORMAL, value: data.investigating_normal },
            {
                id: ConfigID.ID_SLA_INVESTIGATING_NORMAL_EXTEND,
                value: data.investigating_normal_extend,
            },
            { id: ConfigID.ID_SLA_INVESTIGATING_COMPLEX, value: data.investigating_complex },
            {
                id: ConfigID.ID_SLA_INVESTIGATING_COMPLEX_EXTEND,
                value: data.investigating_complex_extend,
            },
        ];
        await Promise.all(updates.map(async ({ id, value }) => {
            const model = await Config.findOrFail(id);
            if (model.value !== value.toString()) {
                model.merge({ value: value.toString(), updatedBy: auth.user?.id });
                await model.save();
            }
        }));
        return response.redirect().toRoute('admin.sla.index');
    }
}
//# sourceMappingURL=slas_controller.js.map