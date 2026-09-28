import { type InertiaProps } from '~/types'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { PageHeader } from '~/components/admin/crud'
import { Button } from '~/components/ui/button'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { router, useForm } from '@inertiajs/react'
import { Fragment, type FC, useEffect, useMemo, useRef, useState } from 'react'
import { FormInput } from '~/components/admin/ui/form/input'
import { FormOptions } from '~/components/admin/ui/form/options'
import { OPTIONS_ACTIVE_STATUS } from '~/components/admin/crud/utils/enum'
import PermissionRow from '~/components/admin/ui/form/permission_row'

type Props = InertiaProps<{
  data?: any
  model?: any
  permissions?: number[]
}>

const UserRolesForm: FC<Props> = ({ model, permissions, ...page }) => {
  const allPermissionIds = useMemo(() => {
    const ids: number[] = []
    page.data.module_actions.forEach((module: any) => {
      module.actions?.forEach((a: any) => ids.push(a.id))
      module.chidren?.forEach((child: any) => {
        child.actions?.forEach((a: any) => ids.push(a.id))
      })
    })
    return ids
  }, [page.data.module_actions])
  // dashboard access is mandatory for every role, so its permission ids are always kept selected
  const mandatoryPermissionIds = useMemo(() => {
    const ids: number[] = []
    page.data.module_actions.forEach((module: any) => {
      if (module.module === 'dashboard') ids.push(...(module.actions?.map((a: any) => a.id) || []))
      module.chidren?.forEach((child: any) => {
        if (child.module === 'dashboard') ids.push(...(child.actions?.map((a: any) => a.id) || []))
      })
    })
    return ids
  }, [page.data.module_actions])
  const [newPermissions, setNewPermissions] = useState<number[]>(() =>
    Array.from(new Set([...(permissions || []), ...mandatoryPermissionIds]))
  )
  const [isShowOnly] = useState(page.currentAction === 'show')
  const [formAction] = useState(
    '/process/user_roles/' + (page.currentAction === 'create' ? '' : model?.id)
  )
  // bump to force checkboxes (uncontrolled) to remount with updated defaultChecked
  const [tableKey, setTableKey] = useState(0)
  const isAllPermissionsChecked =
    allPermissionIds.length > 0 && allPermissionIds.every((id) => newPermissions.includes(id))
  const handleChange = (e: any) => {
    setData(e.target.name, e.target.value)
  }
  const handlePermission = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    if (checked) {
      setNewPermissions((prev) => [...prev, Number(value)])
    } else {
      setNewPermissions((prev) => prev.filter((item) => item !== Number(value)))
    }
  }
  const handleCheckAllPermissions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setNewPermissions(checked ? allPermissionIds : mandatoryPermissionIds)
    setTableKey((prev) => prev + 1)
  }

  const { data, setData, post, put, errors, processing } = useForm({
    title: model?.title,
    description: model?.description,
    status: model?.status ? String(model!.status) : '2',
    permissions: permissions,
  })
  const submitAttemptedRef = useRef(false)
  const permissionsSectionRef = useRef<HTMLDivElement>(null)
  const handleSubmit = (e: any) => {
    e.preventDefault()

    setData('permissions', newPermissions)
    submitAttemptedRef.current = true
    if (isShowOnly) {
      return
    } else if (page.currentAction === 'create') {
      post(formAction)
    } else {
      put(formAction)
    }
  }

  useEffect(() => {
    if (!submitAttemptedRef.current || Object.keys(errors || {}).length === 0) {
      return
    }
    const firstKey = Object.keys(errors)[0]
    if (firstKey === 'permissions') {
      permissionsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      const element = document.querySelector<HTMLElement>(`[name="${firstKey}"]`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      element?.focus()
    }
  }, [errors])

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="สิทธิ์การใช้งาน (Roles & Departments)"
            description="กำหนดบทบาท สิทธิ์การเข้าถึง และฝ่าย/แผนกที่รับผิดชอบเรื่องร้องเรียน"
            breadcrumbs={[{ label: 'ตั้งค่าระบบ' }]}
            actionButtons={
              <Button
                variant="outline"
                onClick={() => router.visit('/process/user_roles')}
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
                <h2 className="text-lg font-bold text-slate-800">แก้ไขสิทธิ์การใช้งาน</h2>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-6">
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

                <div className="space-y-1.5" ref={permissionsSectionRef}>
                  <label className="text-sm font-semibold text-slate-700">
                    สิทธิ์การเข้าถึง <span className="text-red-500">*</span>
                  </label>
                  <table width="100%">
                    <thead>
                      <tr>
                        <th align="left" style={{ width: '360px' }}>
                          <label className="flex items-center gap-2 font-normal">
                            <input
                              type="checkbox"
                              checked={isAllPermissionsChecked}
                              onChange={handleCheckAllPermissions}
                              disabled={isShowOnly}
                            />{' '}
                            เลือกทั้งหมด
                          </label>
                        </th>
                        <th colSpan={6}>&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody key={tableKey}>
                      {page.data.module_actions.map((module: any) => {
                        return (
                          <Fragment key={module.id}>
                            <PermissionRow
                              data={module}
                              defaultValues={newPermissions}
                              disabled={isShowOnly}
                              onChange={handlePermission}
                            />
                            {module.chidren?.map((child: any) => {
                              return (
                                <PermissionRow
                                  key={child.id}
                                  data={child}
                                  defaultValues={newPermissions}
                                  disabled={isShowOnly}
                                  onChange={handlePermission}
                                />
                              )
                            })}
                          </Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {isShowOnly ? (
                  ''
                ) : (
                  <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => router.visit('/process/user_roles')}
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

export default UserRolesForm
