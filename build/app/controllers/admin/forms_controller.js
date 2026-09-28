import Form from '#models/form';
import FormCategory from '#models/form_category';
import FormTransformer from '#transformers/form_transformer';
import { urlFor } from '@adonisjs/core/services/url_builder';
import { PaginationLimits } from '#constants/index';
import { formAdminFormUpdateValidator, formAdminFormValidator } from '#validators/form';
import FormQuestion from '#models/form_question';
import FormQuestionTransformer from '#transformers/form_question_transformer';
import FormSection from '#models/form_section';
import FormSectionTransformer from '#transformers/form_section_transformer';
import { ActiveStatus } from "../../contracts/enum.js";
export default class FormsController {
    async index({ request, inertia }) {
        const search = request.input('search', '');
        const status = request.input('status', '');
        const formCategory = request.input('form_category', '');
        const page = request.input('page', 1);
        const createUrl = urlFor('admin.forms.create');
        const props = {
            createUrl,
            filters: { search, status, formCategory, page },
            data: async () => {
                const data = await Form.query()
                    .preload('formCategory')
                    .if(search, (query) => query.whereILike('title', `%${search}%`).orWhereHas('formCategory', (categoryQuery) => {
                    categoryQuery.whereILike('title', `%${search}%`);
                }))
                    .if(status, (query) => query.where('status', status))
                    .if(formCategory, (query) => query.where('formCategoryId', formCategory))
                    .orderBy('id', 'desc')
                    .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE);
                data.baseUrl(urlFor('admin.forms.index'));
                data.queryString({
                    search: search || '',
                    status: status || '',
                    form_category: formCategory || '',
                });
                const modelData = FormTransformer.transform(data).useVariant('forAdminObject');
                return { meta: data.getMeta(), model: modelData };
            },
            formCategories: await this.getFormCategories(),
        };
        return inertia.render('admin/forms/index', props);
    }
    async create({ inertia }) {
        const data = await this.getFormData();
        return inertia.render('admin/forms/form', { data });
    }
    async store({ request, response, auth, session }) {
        const { questions = [], ...data } = await request.validateUsing(formAdminFormValidator);
        const payload = {
            ...data,
            createdBy: auth.user?.id,
            updatedBy: auth.user?.id,
            status: Number(data.status),
        };
        const model = await Form.create(payload);
        model.related('formQuestions').createMany(questions.map((e) => {
            const { id, ...questionData } = e;
            return {
                ...questionData,
                form_section_id: 2,
                status: ActiveStatus.ACTIVE,
                createdBy: auth.user?.id,
            };
        }));
        session.flash('success', 'สร้างแบบฟอร์มเรียบร้อย');
        return response.redirect().toRoute('admin.forms.index');
    }
    async show({ inertia, params }) {
        const model = await Form.findOrFail(params.id);
        const data = await this.getFormData();
        return inertia.render('admin/forms/form', { data, model: model.$attributes });
    }
    async edit({ inertia, params }) {
        const model = await Form.findOrFail(params.id);
        const questions = await FormQuestion.query().where('form_id', params.id).preload('formSection');
        const sections = await FormSection.query();
        const data = await this.getFormData();
        return inertia.render('admin/forms/form', {
            data,
            model: model.$attributes,
            questions: FormQuestionTransformer.transform(questions).useVariant('forAdminObject'),
            sections: FormSectionTransformer.transform(sections).useVariant('forAdminObject'),
        });
    }
    async update({ params, request, response, auth, session }) {
        const model = await Form.findOrFail(params.id);
        const { questions = [], ...data } = await request.validateUsing(formAdminFormUpdateValidator);
        await model.merge({ ...data, updatedBy: auth.user?.id, status: Number(data.status) }).save();
        let updateQuestions = [];
        let newQuestions = [];
        questions.forEach((p) => {
            const { id, ...questionData } = p;
            if (id) {
                updateQuestions.push(p);
            }
            else {
                newQuestions.push({
                    form_section_id: 2,
                    status: ActiveStatus.ACTIVE,
                    created_by: auth.user?.id ?? 0,
                    ...questionData,
                });
            }
        });
        await FormQuestion.query()
            .where('formId', model.id)
            .whereNotIn('id', questions.map((e) => Number(e.id ?? 0)))
            .delete();
        model.related('formQuestions').updateOrCreateMany(updateQuestions, 'id');
        model.related('formQuestions').createMany(newQuestions);
        session.flash('success', 'แก้ไขแบบฟอร์มเรียบร้อย');
        return response.redirect().toRoute('admin.forms.index');
    }
    async destroy({ params, response }) {
        const model = await Form.findOrFail(params.id);
        await model.delete();
        return response.redirect().toRoute('admin.forms.index');
    }
    async getFormData() {
        const categories = await FormCategory.query()
            .orderBy('sequence')
            .orderBy('title')
            .select('id', 'title');
        const forms = await Form.query().select('formCategoryId', 'version');
        return {
            form_categories: categories.map((category) => {
                const highestVersion = forms
                    .filter((form) => form.formCategoryId === category.id)
                    .reduce((highest, form) => Math.max(highest, Number(form.version) || 0), 0);
                return {
                    label: category.title,
                    value: category.id,
                    nextVersion: Math.floor(highestVersion) + 1,
                };
            }),
        };
    }
    async getFormCategories() {
        const formCategories = await FormCategory.query()
            .orderBy('sequence')
            .orderBy('title')
            .select('id', 'title');
        return formCategories.map((e) => ({ label: e.title, value: e.id }));
    }
}
//# sourceMappingURL=forms_controller.js.map