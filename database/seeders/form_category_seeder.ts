import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { formCategories, formRefs, formSections } from '../data/form_category.js'
import FormCategory from '#models/form_category'
import FormSubject from '#models/form_subject'
import FormSection from '#models/form_section'
import Form from '#models/form'
import FormQuestion from '#models/form_question'

export default class extends BaseSeeder {
  async run() {
    await this.#createFormCategory()
  }

  async #createFormCategory() {
    await FormSection.createMany(formSections)
    const forms = formRefs.reduce<Record<number, (typeof formRefs)[number]>>((res, c) => {
      res[c.ref] = c
      return res
    }, {})

    let index = 0
    for (const element of formCategories) {
      const { subjects, form, ...item } = element
      index++
      const formCategory = await FormCategory.create({
        createdBy: 0,
        updatedBy: 0,
        ...item,
      })
      if (form !== undefined) {
        const refF = forms[form.ref]
        const f = await Form.create({
          formCategoryId: formCategory.id,
          title: `ฟอร์ม${element.title}`,
          version: '1.0',
          status: element.status,
          createdBy: 0,
          updatedBy: 0,
        })
        if (refF.questions) {
          for (const q of refF.questions) {
            await FormQuestion.create({
              formId: f.id,
              createdBy: 0,
              updatedBy: 0,
              ...q,
            })
          }
        }
      }
      if (subjects) {
        let actionIndex = 1
        for (const subject of subjects) {
          await FormSubject.create({
            formCategoryId: formCategory.id,
            createdBy: 0,
            updatedBy: 0,
            ...subject,
          })
          actionIndex++
        }
      }
    }
  }
}
