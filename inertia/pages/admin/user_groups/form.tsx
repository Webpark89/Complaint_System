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
  users?: any
  // user_lists?: Array<{ label: string; value: string }>
}>

const UserGroupsForm: FC<Props> = ({ model, users, ...page }) => {
  const [newUsers, setNewUsers] = useState<Array<string>>(users.map((i: any) => i.value) || [])
  const [isShowOnly] = useState(page.currentAction === 'show')
  const [formAction] = useState(
    '/process/user_groups/' + (page.currentAction === 'create' ? '' : model?.id)
  )
  const handleChange = (e: any) => {
    setData(e.target.name, e.target.value)
  }
  const handleUsers = (e: any) => {
    setNewUsers(e.map((i: any) => i.value))
    // const { value, checked } = e.target
    // if (checked) {
    //   setNewUsers((prev) => [...prev, Number(value)])
    // } else {
    //   setNewUsers((prev) => prev.filter((item) => item !== Number(value)))
    // }
    // console.log(e)
    // console.log(value, checked, newPermissions)
  }

  const { data, setData, post, put, errors, processing } = useForm({
    title: model?.title,
    description: model?.description,
    status: model?.status ? String(model!.status) : '2',
    users: users,
  })
  const handleSubmit = (e: any) => {
    e.preventDefault()

    setData('users', newUsers)
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
            title="กลุ่มผู้ใช้งาน"
            description="กำหนดกลุ่มผู้ใช้งาน"
            breadcrumbs={[{ label: 'ตั้งค่าระบบ' }]}
            actionButtons={
              <Button
                variant="outline"
                onClick={() => router.visit('/process/user_groups')}
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
                <h2 className="text-lg font-bold text-slate-800">แก้ไขกลุ่มผุ้ใช้งาน</h2>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>
                <FormInput
                  type="text"
                  name="title"
                  label="ชื่อกลุ่ม"
                  isRequired={true}
                  defaultValue={data?.title}
                  placeholder="กรอกชื่อกลุ่ม"
                  onChange={handleChange}
                  errors={errors?.title}
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
                  name="users"
                  label="ผู้ใช้งาน"
                  isRequired={true}
                  defaultValue={data?.users}
                  placeholder="เลือกผู้ใช้งาน"
                  onChange={handleUsers}
                  errors={errors?.users}
                  isShowOnly={isShowOnly}
                  disabled={isShowOnly}
                  options={page.data.user_lists}
                />

                {isShowOnly ? (
                  ''
                ) : (
                  <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => router.visit('/process/user_groups')}
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

export default UserGroupsForm
