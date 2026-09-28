import { type InertiaProps } from '~/types'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { PageHeader } from '~/components/admin/crud'
import { Button } from '~/components/ui/button'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { router, useForm } from '@inertiajs/react'
import { type FC, useState } from 'react'
import { FormInput } from '~/components/admin/ui/form/input'
import { FormOptions } from '~/components/admin/ui/form/options'
import { OPTIONS_ACTIVE_STATUS } from '~/components/admin/crud/utils/enum'

type Props = InertiaProps<{
  data?: any
  model?: any
}>
const FormSubjectsForm: FC<Props> = ({ model, ...page }) => {
  const getUserId = (e: Array<{ label: string; value: string }>) => {
    if (!e) return []
    return e.map((i: any) => i.value)
  }
  const [newUsers1, setNewUsers1] = useState<Array<{ label: string; value: string }>>(
    model?.user_groups_1 || []
  )
  const [newUsers2, setNewUsers2] = useState<Array<{ label: string; value: string }>>(
    model?.user_groups_2 || []
  )
  const [newUsers2S, setNewUsers2S] = useState<Array<{ label: string; value: string }>>(
    model?.user_groups_2S || []
  )
  const [newUsers3, setNewUsers3] = useState<Array<{ label: string; value: string }>>(
    model?.user_groups_3 || []
  )
  const [newUsers4, setNewUsers4] = useState<Array<{ label: string; value: string }>>(
    model?.user_groups_4 || []
  )
  const [isShowOnly] = useState(page.currentAction === 'show')
  const [formAction] = useState(
    '/process/form_subjects/' + (page.currentAction === 'create' ? '' : model?.id)
  )
  const handleChange = (e: any) => {
    setData(e.target.name, e.target.value)
    if (e.target.name === 'form_category_id' && page.data?.next_sequences) {
      setData('sequence', page.data.next_sequences[String(e.target.value)] ?? 1)
    }
  }

  const handleUsers1 = (e: any) => {
    setNewUsers1(e)
  }

  const handleUsers2 = (e: any) => {
    setNewUsers2(e)
  }

  const handleUsers2S = (e: any) => {
    setNewUsers2S(e)
  }

  const handleUsers3 = (e: any) => {
    setNewUsers3(e)
  }

  const handleUsers4 = (e: any) => {
    setNewUsers4(e)
  }

  const { data, setData, post, put, errors, processing } = useForm({
    form_category_id: model?.formCategoryId,
    title: model?.title,
    sub_title: model?.subTitle,
    description: model?.description,
    is_other: model?.isOther ? '1' : '0',
    status: model?.status_id ? String(model!.status_id) : '2',
    sequence: model?.sequence,
    userGroups1: getUserId(model?.user_groups_1),
    userGroups2: getUserId(model?.user_groups_2),
    userGroups2S: getUserId(model?.user_groups_2S),
    userGroups3: getUserId(model?.user_groups_3),
    userGroups4: getUserId(model?.user_groups_4),
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()

    setData('userGroups1', getUserId(newUsers1))
    setData('userGroups2', getUserId(newUsers2))
    setData('userGroups2S', getUserId(newUsers2S))
    setData('userGroups3', getUserId(newUsers3))
    setData('userGroups4', getUserId(newUsers4))
    // console.log(data)
    if (isShowOnly) {
      return
    } else if (page.currentAction === 'create') {
      post(formAction)
    } else {
      put(formAction)
    }
  }

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="ประเด็นเรื่องร้องเรียน"
            description="จัดการประเด็นเรื่องร้องเรียน"
            breadcrumbs={[{ label: 'ตั้งค่าระบบ' }]}
            actionButtons={
              <Button
                variant="outline"
                onClick={() => router.visit('/process/form_subjects')}
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
                  แก้ไขข้อมูลเรื่องร้องเรียน
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
                  onChange={handleChange}
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
                  type="text"
                  name="sub_title"
                  label="อธิบายหัวข้อ"
                  isRequired={true}
                  defaultValue={data?.sub_title}
                  placeholder="กรอกอธิบายหัวข้อ"
                  onChange={handleChange}
                  errors={errors?.sub_title}
                  isShowOnly={isShowOnly}
                />

                <FormInput
                  type="textarea"
                  name="description"
                  label="คำอธิบาย"
                  isRequired={true}
                  defaultValue={data?.description}
                  placeholder="กรอกคำอธิบาย"
                  onChange={handleChange}
                  errors={errors?.description}
                  isShowOnly={isShowOnly}
                />

                <FormInput
                  type="number"
                  name="sequence"
                  label="ลำดับการแสดงผล (น้อยไปมาก)"
                  isRequired={true}
                  defaultValue={data?.sequence}
                  placeholder="กรอกลำดับการแสดงผล"
                  onChange={handleChange}
                  errors={errors?.sequence}
                  isShowOnly={isShowOnly}
                />

                <FormOptions
                  type="select"
                  name="is_other"
                  label="ประเภทประเด็น"
                  isRequired={true}
                  defaultValue={data?.is_other}
                  placeholder="ประเภทประเด็น"
                  onChange={handleChange}
                  errors={errors?.status}
                  isShowOnly={isShowOnly}
                  options={[
                    { value: '0', label: 'ประเด็นปกติ' },
                    { value: '1', label: 'ประเด็นอื่นๆ (ต้องระบุ)' },
                  ]}
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

                <FormOptions
                  type="select_multiple"
                  name="userGroups1"
                  label="กลุ่มผู้ใช้งาน Step 1 (รับเรื่องร้องเรียน)"
                  isRequired={true}
                  defaultValue={model?.user_groups_1}
                  placeholder="เลือกกลุ่มผู้ใช้งาน"
                  onChange={handleUsers1}
                  errors={errors?.userGroups1}
                  isShowOnly={isShowOnly}
                  options={page.data.user_groups}
                  disabled={isShowOnly}
                />

                <FormOptions
                  type="select_multiple"
                  name="userGroups2"
                  label="กลุ่มผู้ใช้งาน Step 2 (ผู้รับผิดชอบ ต่อ)"
                  isRequired={false}
                  defaultValue={model?.user_groups_2}
                  placeholder="เลือกกลุ่มผู้ใช้งาน"
                  onChange={handleUsers2}
                  errors={errors?.userGroups2}
                  isShowOnly={isShowOnly}
                  options={page.data.user_groups}
                  disabled={isShowOnly}
                />

                <FormOptions
                  type="select_multiple"
                  name="userGroups2S"
                  label="กลุ่มผู้ใช้งาน Step 2 (ผู้รับผิดชอบ ต่อ Sensitive Case)"
                  isRequired={false}
                  defaultValue={model?.user_groups_2S}
                  placeholder="เลือกกลุ่มผู้ใช้งาน"
                  onChange={handleUsers2S}
                  errors={errors?.userGroups2S}
                  isShowOnly={isShowOnly}
                  options={page.data.user_groups}
                  disabled={isShowOnly}
                />

                <FormOptions
                  type="select_multiple"
                  name="userGroups3"
                  label="กลุ่มผู้ใช้งาน Step 3 (ดำเนินการสอบสวนและสรุปผล)"
                  isRequired={false}
                  defaultValue={model?.user_groups_3}
                  placeholder="เลือกกลุ่มผู้ใช้งาน"
                  onChange={handleUsers3}
                  errors={errors?.userGroups3}
                  isShowOnly={isShowOnly}
                  options={page.data.user_groups}
                  disabled={isShowOnly}
                />

                <FormOptions
                  type="select_multiple"
                  name="userGroups4"
                  label="กลุ่มผู้ใช้งาน Step 4 (ผู้อนุมัติตรวจสอบอีกครั้ง)"
                  isRequired={false}
                  defaultValue={model?.user_groups_4}
                  placeholder="เลือกกลุ่มผู้ใช้งาน"
                  onChange={handleUsers4}
                  errors={errors?.userGroups4}
                  isShowOnly={isShowOnly}
                  options={page.data.user_groups}
                  disabled={isShowOnly}
                />

                {isShowOnly ? (
                  ''
                ) : (
                  <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => router.visit('/process/form_subjects')}
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
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  )
}

export default FormSubjectsForm
