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

const UsersForm: FC<Props> = (page) => {
  const [model] = useState(page.model)
  const [roles] = useState(page.data.roles)
  const [organizations] = useState(page.data.organizations)
  const [isShowOnly] = useState(page.currentAction === 'show')
  const [formAction] = useState(
    '/process/users/' + (page.currentAction === 'create' ? '' : model?.id)
  )

  const handleChange = (e: any) => {
    setData(e.target.name, e.target.value)
  }
  const { data, setData, post, put, errors, processing } = useForm({
    user_role_id: model?.userRoleId,
    organization_id: model?.organizationId,
    full_name: model?.fullName,
    email: model?.email,
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
            title="ผู้ใช้งาน"
            description="จัดการผู้ใช้งานระบบ"
            breadcrumbs={[{ label: 'ตั้งค่าระบบ' }]}
            actionButtons={
              <Button
                variant="outline"
                onClick={() => router.visit('/process/users')}
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
                  แก้ไขข้อมูลผู้ใช้งาน
                  {/* รหัส:{' '}
                  <span className="text-[#b08730]">{model?.id}</span> */}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-6">
                <FormOptions
                  type="select"
                  name="user_role_id"
                  label="สิทธิ์"
                  isRequired={true}
                  defaultValue={data?.user_role_id}
                  placeholder="เลือกสิทธิ์"
                  onChange={handleChange}
                  errors={errors?.user_role_id}
                  isShowOnly={isShowOnly}
                  options={roles}
                />

                <FormOptions
                  type="select"
                  name="organization_id"
                  label="หน่วยงาน"
                  isRequired={true}
                  defaultValue={data?.organization_id}
                  placeholder="เลือกหน่วยงาน"
                  onChange={handleChange}
                  errors={errors?.organization_id}
                  isShowOnly={isShowOnly}
                  options={organizations}
                  optGroup={true}
                />

                <FormInput
                  type="text"
                  name="full_name"
                  label="ชื่อ-นามสกุล"
                  isRequired={true}
                  defaultValue={data?.full_name}
                  placeholder="กรอกชื่อ-นามสกุล"
                  onChange={handleChange}
                  errors={errors?.full_name}
                  isShowOnly={isShowOnly}
                />

                <FormInput
                  type="email"
                  name="email"
                  label="อีเมล (ใช้ Login)"
                  isRequired={true}
                  defaultValue={data?.email}
                  placeholder="กรอกอีเมล"
                  onChange={handleChange}
                  errors={errors?.email}
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

                {!isShowOnly && (
                  <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => router.visit('/process/users')}
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

export default UsersForm
