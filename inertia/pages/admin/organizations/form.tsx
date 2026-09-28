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

const OrganizationsForm: FC<Props> = ({ model, ...page }) => {
  const [parents] = useState(page.data.parents)
  const [types] = useState(page.data.types)
  const [isShowOnly] = useState(page.currentAction === 'show')
  const [formAction] = useState(
    '/process/organizations/' + (page.currentAction === 'create' ? '' : model?.id)
  )
  const handleChange = (e: any) => {
    setData(e.target.name, e.target.value)
  }
  const { data, setData, post, put, errors, processing } = useForm({
    parent_organization_id: model?.parentOrganizationId || null,
    code: model?.code || '',
    title: model?.title || '',
    type: model?.type || null,
    status: model?.status ? String(model!.status) : '2',
  })
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

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="หน่วยงานและโครงเพิ่มองค์กร"
            description="จัดการโครงเพิ่มองค์กร"
            breadcrumbs={[{ label: 'ตั้งค่าระบบ' }]}
            actionButtons={
              <Button
                variant="outline"
                onClick={() => router.visit('/process/organizations')}
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

              <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>
                <FormOptions
                  type="select"
                  name="parent_organization_id"
                  label="หน่วยงานแม่"
                  isRequired={false}
                  defaultValue={data?.parent_organization_id}
                  placeholder="เลือกหน่วยงานแม่"
                  onChange={handleChange}
                  errors={errors?.parent_organization_id}
                  isShowOnly={isShowOnly}
                  options={parents}
                  allowEmpty={true}
                />

                <FormOptions
                  type="select"
                  name="type"
                  label="ประเภท"
                  isRequired={true}
                  defaultValue={data?.type}
                  placeholder="เลือกประเภท"
                  onChange={handleChange}
                  errors={errors?.type}
                  isShowOnly={isShowOnly}
                  options={types}
                  allowEmpty={true}
                />

                <FormInput
                  type="text"
                  name="code"
                  label="รหัสหน่วยงาน"
                  isRequired={true}
                  defaultValue={data?.code}
                  placeholder="กรอกรหัสหน่วยงาน"
                  onChange={handleChange}
                  errors={errors?.code}
                  isShowOnly={isShowOnly}
                />

                <FormInput
                  type="text"
                  name="title"
                  label="ชื่อหน่วยงาน"
                  isRequired={true}
                  defaultValue={data?.title}
                  placeholder="กรอกชื่อหน่วยงาน"
                  onChange={handleChange}
                  errors={errors?.title}
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

                {isShowOnly ? (
                  ''
                ) : (
                  <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => router.visit('/process/organizations')}
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

export default OrganizationsForm
