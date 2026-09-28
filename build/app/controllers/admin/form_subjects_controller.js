import FormCategory from '#models/form_category';
import FormSubject from '#models/form_subject';
import FormSubjectTransformer from '#transformers/form_subject_transformer';
import { urlFor } from '@adonisjs/core/services/url_builder';
import { PaginationLimits } from '#constants/index';
import { formSubjectAdminStoreValidator, formSubjectAdminUpdateValidator, } from '#validators/form_subject';
import UserGroup from '#models/user_group';
import Complaint from '#models/complaint';
import auditing from '@filipebraida/adonis-auditing/services/main';
export default class FormSubjectsController {
    async index({ request, inertia }) {
        const search = request.input('search', '');
        const status = request.input('status', '');
        const formCategory = request.input('form_category', '');
        const page = request.input('page', 1);
        const createUrl = urlFor('admin.form_subjects.create');
        const props = {
            createUrl,
            filters: { search, status, formCategory, page },
            data: async () => {
                const data = await FormSubject.query()
                    .preload('formCategory')
                    .withCount('complaints')
                    .if(search, (query) => query.whereILike('title', `%${search}%`).orWhereHas('formCategory', (categoryQuery) => {
                    categoryQuery.whereILike('title', `%${search}%`);
                }))
                    .if(status, (query) => query.where('status', status))
                    .if(formCategory, (query) => query.where('formCategoryId', formCategory))
                    .orderBy('formCategoryId')
                    .orderBy('sequence')
                    .orderBy('title')
                    .paginate(page, PaginationLimits.DEFAULT_PAGE_SIZE);
                data.baseUrl(urlFor('admin.form_subjects.index'));
                data.queryString({
                    search: search || '',
                    status: status || '',
                    form_category: formCategory || '',
                });
                const modelData = FormSubjectTransformer.transform(data).useVariant('forAdminObject');
                return { meta: data.getMeta(), model: modelData };
            },
            formCategories: await this.getFormCategories(),
        };
        return inertia.render('admin/form_subjects/index', props);
    }
    async create({ inertia }) {
        const data = await this.getFormData();
        return inertia.render('admin/form_subjects/form', { data });
    }
    async store({ request, response, auth, session }) {
        const { userGroups1, userGroups2, userGroups2S, userGroups3, userGroups4, ...data } = await request.validateUsing(formSubjectAdminStoreValidator);
        const payload = {
            ...data,
            sequence: data.sequence ??
                Number((await FormSubject.query()
                    .where('formCategoryId', data.form_category_id)
                    .max('sequence as maxSequence')
                    .first())?.$extras.maxSequence ?? 0) + 1,
            createdBy: auth.user?.id,
            updatedBy: auth.user?.id,
            status: Number(data.status),
        };
        const model = await FormSubject.create(payload);
        const titles = await this.getUserGroupTitlesMap([
            userGroups1,
            userGroups2,
            userGroups2S,
            userGroups3,
            userGroups4,
        ]);
        await model.auditCustom('created', {
            new: {
                user_groups_1: JSON.stringify(userGroups1),
                user_groups_1_title: JSON.stringify(titles(userGroups1)),
                user_groups_2: JSON.stringify(userGroups2),
                user_groups_2_title: JSON.stringify(titles(userGroups2)),
                user_groups_2S: JSON.stringify(userGroups2S),
                user_groups_2S_title: JSON.stringify(titles(userGroups2S)),
                user_groups_3: JSON.stringify(userGroups3),
                user_groups_3_title: JSON.stringify(titles(userGroups3)),
                user_groups_4: JSON.stringify(userGroups4),
                user_groups_4_title: JSON.stringify(titles(userGroups4)),
            },
            tags: ['mutation'],
        });
        await auditing.withoutAuditing(async () => {
            await model.related('userGroups1').sync(this.getSyncWithStep('1', userGroups1));
            await model.related('userGroups2').sync(this.getSyncWithStep('2', userGroups2));
            await model.related('userGroups2S').sync(this.getSyncWithStep('25', userGroups2S));
            await model.related('userGroups3').sync(this.getSyncWithStep('3', userGroups3));
            await model.related('userGroups4').sync(this.getSyncWithStep('4', userGroups4));
        });
        session.flash('success', 'สร้างประเภทเรื่องเรียบร้อย');
        return response.redirect().toRoute('admin.form_subjects.index');
    }
    async show({ inertia, params }) {
        const model = await FormSubject.query()
            .where('id', params.id)
            .preload('formCategory')
            .preload('userGroups1')
            .preload('userGroups2')
            .preload('userGroups2S')
            .preload('userGroups3')
            .preload('userGroups4')
            .firstOrFail();
        const data = await this.getFormData();
        return inertia.render('admin/form_subjects/form', {
            data,
            model: FormSubjectTransformer.transform(model).useVariant('forAdminObject'),
        });
    }
    async edit({ inertia, params }) {
        const model = await FormSubject.query()
            .where('id', params.id)
            .preload('formCategory')
            .preload('userGroups1')
            .preload('userGroups2')
            .preload('userGroups2S')
            .preload('userGroups3')
            .preload('userGroups4')
            .firstOrFail();
        const data = await this.getFormData();
        return inertia.render('admin/form_subjects/form', {
            data,
            model: FormSubjectTransformer.transform(model).useVariant('forAdminObject'),
        });
    }
    async update({ params, request, response, auth, session }) {
        const model = await FormSubject.query()
            .where('id', params.id)
            .preload('userGroups1')
            .preload('userGroups2')
            .preload('userGroups2S')
            .preload('userGroups3')
            .preload('userGroups4')
            .firstOrFail();
        const { userGroups1, userGroups2, userGroups2S, userGroups3, userGroups4, ...data } = await request.validateUsing(formSubjectAdminUpdateValidator);
        await model.merge({ ...data, updatedBy: auth.user?.id, status: Number(data.status) }).save();
        const titles = await this.getUserGroupTitlesMap([
            userGroups1,
            userGroups2,
            userGroups2S,
            userGroups3,
            userGroups4,
        ]);
        await model.auditCustom('updated', {
            old: {
                user_groups_1: JSON.stringify(model.userGroups1.map((e) => e.id)),
                user_groups_1_title: JSON.stringify(model.userGroups1.map((e) => e.title)),
                user_groups_2: JSON.stringify(model.userGroups2.map((e) => e.id)),
                user_groups_2_title: JSON.stringify(model.userGroups2.map((e) => e.title)),
                user_groups_2S: JSON.stringify(model.userGroups2S.map((e) => e.id)),
                user_groups_2S_title: JSON.stringify(model.userGroups2S.map((e) => e.title)),
                user_groups_3: JSON.stringify(model.userGroups3.map((e) => e.id)),
                user_groups_3_title: JSON.stringify(model.userGroups3.map((e) => e.title)),
                user_groups_4: JSON.stringify(model.userGroups4.map((e) => e.id)),
                user_groups_4_title: JSON.stringify(model.userGroups4.map((e) => e.title)),
            },
            new: {
                user_groups_1: JSON.stringify(userGroups1),
                user_groups_1_title: JSON.stringify(titles(userGroups1)),
                user_groups_2: JSON.stringify(userGroups2),
                user_groups_2_title: JSON.stringify(titles(userGroups2)),
                user_groups_2S: JSON.stringify(userGroups2S),
                user_groups_2S_title: JSON.stringify(titles(userGroups2S)),
                user_groups_3: JSON.stringify(userGroups3),
                user_groups_3_title: JSON.stringify(titles(userGroups3)),
                user_groups_4: JSON.stringify(userGroups4),
                user_groups_4_title: JSON.stringify(titles(userGroups4)),
            },
            tags: ['mutation'],
        });
        await auditing.withoutAuditing(async () => {
            await model.related('userGroups1').sync(this.getSyncWithStep('1', userGroups1));
            await model.related('userGroups2').sync(this.getSyncWithStep('2', userGroups2));
            await model.related('userGroups2S').sync(this.getSyncWithStep('25', userGroups2S));
            await model.related('userGroups3').sync(this.getSyncWithStep('3', userGroups3));
            await model.related('userGroups4').sync(this.getSyncWithStep('4', userGroups4));
        });
        session.flash('success', 'แก้ไขประเภทเรื่องเรียบร้อย');
        return response.redirect().toRoute('admin.form_subjects.index');
    }
    async destroy({ params, response, session }) {
        const model = await FormSubject.findOrFail(params.id);
        const complaint = await Complaint.query().where('formSubjectId', model.id).first();
        if (complaint) {
            session.flash('error', 'This form subject cannot be deleted because it has complaints.');
            return response.redirect().toRoute('admin.form_subjects.index');
        }
        await model.delete();
        return response.redirect().toRoute('admin.form_subjects.index');
    }
    async getFormData() {
        const formCategories = await FormCategory.query()
            .orderBy('sequence')
            .orderBy('title')
            .select('id', 'title');
        const userGroups = await UserGroup.query().orderBy('title').select('id', 'title');
        const subjects = await FormSubject.query().select('formCategoryId', 'sequence');
        const nextSequences = {};
        subjects.forEach((subject) => {
            const categoryId = String(subject.formCategoryId);
            nextSequences[categoryId] = Math.max(nextSequences[categoryId] ?? 0, subject.sequence + 1);
        });
        return {
            form_categories: formCategories.map((e) => ({ label: e.title, value: e.id })),
            user_groups: userGroups.map((e) => ({ label: e.title, value: e.id })),
            next_sequences: nextSequences,
        };
    }
    async getUserGroupTitlesMap(idLists) {
        const ids = [...new Set(idLists.flat())];
        const userGroups = ids.length
            ? await UserGroup.query().whereIn('id', ids).select('id', 'title')
            : [];
        const titleById = new Map(userGroups.map((e) => [e.id, e.title]));
        return (list) => list.map((id) => titleById.get(id) ?? null);
    }
    getSyncWithStep(step, userGroups) {
        return userGroups.reduce((acc, e) => {
            acc[e.toString()] = { step };
            return acc;
        }, {});
    }
    async getFormCategories() {
        const formCategories = await FormCategory.query()
            .orderBy('sequence')
            .orderBy('title')
            .select('id', 'title');
        return formCategories.map((e) => ({ label: e.title, value: e.id }));
    }
}
//# sourceMappingURL=form_subjects_controller.js.map