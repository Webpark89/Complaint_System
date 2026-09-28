import { type InertiaProps } from '~/types'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { DeleteDialog, PageHeader } from '~/components/admin/crud'
import { Button } from '~/components/ui/button'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { router, useForm } from '@inertiajs/react'
import { type FC, useState } from 'react'
import { FormInput } from '~/components/admin/ui/form/input'
import { FormOptions } from '~/components/admin/ui/form/options'
import {
  OPTIONS_ACTIVE_STATUS,
  OPTIONS_COMPLAINT_QUESTION_TYPE,
} from '~/components/admin/crud/utils/enum'
import Modal from '~/components/ui/modal'

type Props = InertiaProps<{
  data?: any
  model?: any
  questions?: any
  sections?: any
}>

const FormsForm: FC<Props> = ({ model, questions, sections, ...page }) => {
  const isShowOnly = page.currentAction === 'show'
  const formAction = '/process/forms/' + (page.currentAction === 'create' ? '' : model?.id)
  const handleChange = (e: any) => {
    setData(e.target.name, e.target.value)
  }
  const handleCategoryChange = (e: any) => {
    const formCategoryId = e.target.value
    setData('form_category_id', formCategoryId)

    if (page.currentAction === 'create') {
      const category = page.data.form_categories.find(
        (option: any) => String(option.value) === formCategoryId
      )
      setData('version', String(category?.nextVersion ?? 1))
    }
  }
  const { data, setData, post, put, errors, processing } = useForm({
    form_category_id: model?.formCategoryId,
    title: model?.title,
    version: model?.version,
    status: model?.status ? String(model!.status) : '2',
    sequence: model?.sequence,
    questions:
      questions?.map((e: any) => ({
        id: e.id,
        type: e.type,
        title: e.title,
        hint: e.hint,
        sequence: e.sequence,
        temp_id: e.id,
      })) ?? [],
    question_id: null,
    question_type: '',
    question_title: '',
    question_hint: '',
    question_sequence: 0,
    question_temp_id: '',
  })
  // console.log(data)

  // useEffect(() => {
  //   if (!data.questions || data.questions.length === 0) {
  //     setData('questions', [])
  //   }
  // }, [data.questions, setData])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (isShowOnly) {
      return
    } else if (page.currentAction === 'create') {
      post(formAction)
    } else {
      put(formAction)
    }
  }
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleAddQuestion = () => {
    setModalMode('add')
    setSelectedQuestion(null)
    setData('question_temp_id', `n-${new Date().getTime()}`)
    setData('question_id', null)
    setData('question_type', 'string')
    setData('question_title', '')
    setData('question_hint', '')
    setData('question_sequence', data.questions.length + 1 || 1)
    setModalOpen(true)
  }

  const handleEditQuestion = (question: any) => {
    setModalMode('edit')
    setSelectedQuestion(question)
    setData('question_temp_id', question.temp_id)
    setData('question_id', question.id)
    setData('question_type', question.type)
    setData('question_title', question.title)
    setData('question_hint', question.hint)
    setData('question_sequence', question.sequence)
    setModalOpen(true)
  }

  const handleDeleteQuestion = (question: any) => {
    setSelectedQuestion(question)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    const updated = data.questions.filter((qs: any) => qs.temp_id !== selectedQuestion.temp_id)
    setData('questions', updated)
    setDeleteDialogOpen(false)
  }

  const handleSubmitQuestion = (e: any) => {
    e.preventDefault()
    let q = {
      temp_id: data.question_temp_id,
      id: data.question_id,
      type: data.question_type,
      title: data.question_title,
      hint: data.question_hint,
      sequence: Number(data.question_sequence),
    }
    // console.log(q, data.questions)
    const index = data.questions.findIndex((qs: any) => qs.temp_id === q.temp_id)
    let updated = [...(data.questions || [])]
    if (index === -1) {
      updated.push(q)
    } else {
      updated[index] = q
    }
    setData('questions', updated)
    setModalOpen(false)
  }

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="แบบฟอร์มร้องเรียน"
            description="กำหนดฟอร์มและช่องข้อมูล"
            breadcrumbs={[{ label: 'ตั้งค่าระบบ' }]}
            actionButtons={
              <Button
                variant="outline"
                onClick={() => router.visit('/process/forms')}
                className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 gap-2 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                ย้อนกลับ
              </Button>
            }
          />

          <Card className="w-full border-border bg-white shadow-soft">
            <CardContent className="p-6">
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  แก้ไขแบบฟอร์มร้องเรียน
                  {/* รหัส:{' '}
                  <span className="text-[#b08730]">{model?.id}</span> */}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-6">
                <FormOptions
                  type="select"
                  name="form_category_id"
                  label="ประเภทเรื่องร้องเรียน"
                  isRequired={true}
                  defaultValue={data?.form_category_id}
                  placeholder="เลือกประเภทเรื่องร้องเรียน"
                  onChange={handleCategoryChange}
                  errors={errors?.form_category_id}
                  isShowOnly={isShowOnly}
                  options={page.data.form_categories}
                />

                <FormInput
                  type="text"
                  name="title"
                  label="หัวข้อ"
                  isRequired={true}
                  defaultValue={data?.title}
                  placeholder="กรอกหัวข้อเรื่อง"
                  onChange={handleChange}
                  errors={errors?.title}
                  isShowOnly={isShowOnly}
                />

                <FormInput
                  type="number"
                  name="version"
                  label="เวอร์ชั่น"
                  isRequired={true}
                  defaultValue={data?.version}
                  placeholder="กรอกเวอร์ชั่น"
                  onChange={handleChange}
                  min={1}
                  step={1}
                  errors={errors?.version}
                  isShowOnly={isShowOnly}
                />

                <FormOptions
                  type="select"
                  name="status"
                  label="สถานะ"
                  isRequired={true}
                  defaultValue={data?.status}
                  placeholder="เลือกสถานะ"
                  onChange={handleChange}
                  errors={errors?.status}
                  isShowOnly={isShowOnly}
                  options={OPTIONS_ACTIVE_STATUS}
                />

                {data.questions && data.questions.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">คำถามเพิ่มเติม</label>
                    <table width="100%">
                      <thead>
                        <tr>
                          <th className="p-2 text-left">ประเภท</th>
                          <th className="p-2 text-left">คำถาม</th>
                          <th className="p-2 text-left">อธิบายคำถาม</th>
                          <th className="p-2 text-left">ลำดับ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.questions
                          ?.sort((a: any, b: any) => a.sequence - b.sequence)
                          .map((q: any, i: number) => {
                            return (
                              <tr key={`q-${i}`}>
                                <td className="p-2">
                                  {
                                    OPTIONS_COMPLAINT_QUESTION_TYPE.find((e) => e.value === q.type)
                                      ?.label
                                  }
                                </td>
                                <td className="p-2">{q.title}</td>
                                <td className="p-2">{q.hint}</td>
                                <td className="p-2">{q.sequence}</td>
                                {!isShowOnly && (
                                  <td className="p-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => handleEditQuestion(q)}
                                      className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                      แก้ไข
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => handleDeleteQuestion(q)}
                                      className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors ml-2"
                                    >
                                      ลบ
                                    </Button>
                                  </td>
                                )}
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                )}

                {!isShowOnly && (
                  <>
                    <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddQuestion}
                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        เพิ่มคำถาม
                      </Button>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => router.visit('/process/forms')}
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-2 transition-colors shadow-sm min-w-35"
                        disabled={processing}
                        // disabled={isLoading || !formData.id || !formData.title}
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        บันทึกการแก้ไข
                      </Button>
                    </div>
                    <DeleteDialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                      title="ยืนยันการลบข้อมูล"
                      description="ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้"
                      itemName={selectedQuestion?.title}
                      onConfirm={handleConfirmDelete}
                    />
                  </>
                )}
              </form>

              {isModalOpen && (
                <Modal onClose={() => setModalOpen(false)}>
                  <h2 className="text-lg font-bold text-slate-800">
                    {modalMode === 'add' ? 'เพิ่มคำถามใหม่' : 'แก้ไขคำถาม'}
                  </h2>
                  <form onSubmit={handleSubmitQuestion} className="w-full space-y-6 mt-4">
                    <FormOptions
                      type="select"
                      name="question_type"
                      label="ประเภท"
                      isRequired={true}
                      defaultValue={selectedQuestion?.type || 'string'}
                      onChange={(e) => setData('question_type', e.target.value)}
                      errors={errors?.question_type}
                      options={OPTIONS_COMPLAINT_QUESTION_TYPE}
                    />
                    <FormInput
                      type="text"
                      name="question_title"
                      label="คำถาม"
                      isRequired={true}
                      defaultValue={data.question_title}
                      onChange={(e) => setData('question_title', e.target.value)}
                      errors={errors?.question_title}
                    />
                    <FormInput
                      type="text"
                      name="question_hint"
                      label="อธิบายคำถาม"
                      isRequired={true}
                      defaultValue={data.question_hint}
                      onChange={(e) => setData('question_hint', e.target.value)}
                      errors={errors?.question_hint}
                    />
                    <FormInput
                      type="number"
                      name="question_sequence"
                      label="ลำดับ"
                      isRequired={true}
                      defaultValue={`${data.question_sequence}`}
                      onChange={(e) => setData('question_sequence', e.target.value)}
                      errors={errors?.question_sequence}
                    />
                    <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setModalOpen(false)}
                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-2 transition-colors shadow-sm min-w-35"
                        disabled={processing}
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        บันทึกคำถาม
                      </Button>
                    </div>
                  </form>
                </Modal>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  )
}

export default FormsForm
