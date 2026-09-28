import { type InertiaProps } from '~/types'
import { type FC, useState, useCallback, useEffect } from 'react'
import { FileText, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { PageHeader, ActionToolbar } from '~/components/admin/crud'
import { useForm } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { FormInput } from '~/components/admin/ui/form/input'
import { toast } from 'sonner'

type SlaModel = {
  new: string
  in_progress: string
  in_progress_extend: string
  investigating_normal: string
  investigating_normal_extend: string
  investigating_complex: string
  investigating_complex_extend: string
}

type Props = InertiaProps<{
  model: SlaModel
}>

const TermForm: FC<Props> = (page) => {
  const { model } = page

  const [isEditingText, setIsEditingText] = useState(false)

  const { data, setData, put, errors, wasSuccessful } = useForm({
    ...model,
  })

  const handleChange = (e: any) => {
    setData(e.target.name, e.target.value)
  }

  const handleEditTextClick = useCallback(() => {
    setIsEditingText(true)
  }, [data])

  const handleSaveText = useCallback(() => {
    put('/process/sla/301')
  }, [put])

  useEffect(() => {
    if (wasSuccessful) {
      setIsEditingText(false)
      toast.success('บันทึกข้อมูลเรียบร้อย')
    }
  }, [wasSuccessful])

  const handleCancelText = useCallback(() => {
    setIsEditingText(false)
  }, [])

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="SLA"
            description="กำหนดระยะเวลามาตรฐานการตอบสนอง"
            breadcrumbs={[{ label: 'ตั้งค่าระบบ' }]}
            actionButtons={<ActionToolbar />}
          />

          <Card className="border-border bg-white shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-[#111827]">
                เนื้อหาข้อตกลงและนโยบาย
              </CardTitle>
              {!isEditingText && (
                <Button size="sm" variant="outline" onClick={handleEditTextClick} className="gap-2">
                  <FileText className="h-4 w-4" /> แก้ไขข้อมูล
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* เงื่อนไขการใช้งาน */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-slate-800 text-base">SLA</h3>
                </div>

                <FormInput
                  type="number"
                  name="new"
                  label="รับเรื่องร้องเรียน ตรวจสอบเบื้องต้น"
                  isRequired={true}
                  defaultValue={data?.new}
                  placeholder="กรอกจำนวนวัน"
                  onChange={handleChange}
                  errors={errors?.new}
                  isDisabled={!isEditingText}
                  className={`w-full ${
                    !isEditingText ? 'bg-(--surface-muted) text-slate-700 opacity-100' : ''
                  }`}
                />

                <FormInput
                  type="number"
                  name="in_progress"
                  label="ผู้รับผิดชอบต่อ"
                  isRequired={true}
                  defaultValue={data?.in_progress}
                  placeholder="กรอกจำนวนวัน"
                  onChange={handleChange}
                  errors={errors?.in_progress}
                  isDisabled={!isEditingText}
                  className={`w-full ${
                    !isEditingText ? 'bg-(--surface-muted) text-slate-700 opacity-100' : ''
                  }`}
                />

                <FormInput
                  type="number"
                  name="in_progress_extend"
                  label="ผู้รับผิดชอบต่อ ขยายเวลาได้ครั้งละ"
                  isRequired={true}
                  defaultValue={data?.in_progress_extend}
                  placeholder="กรอกจำนวนวัน"
                  onChange={handleChange}
                  errors={errors?.in_progress_extend}
                  isDisabled={!isEditingText}
                  className={`w-full ${
                    !isEditingText ? 'bg-(--surface-muted) text-slate-700 opacity-100' : ''
                  }`}
                />

                <FormInput
                  type="number"
                  name="investigating_normal"
                  label="อยู่ระหว่างสอบสวน (กรณีไม่ซับซ้อน)"
                  isRequired={true}
                  defaultValue={data?.investigating_normal}
                  placeholder="กรอกจำนวนวัน"
                  onChange={handleChange}
                  errors={errors?.investigating_normal}
                  isDisabled={!isEditingText}
                  className={`w-full ${
                    !isEditingText ? 'bg-(--surface-muted) text-slate-700 opacity-100' : ''
                  }`}
                />

                <FormInput
                  type="number"
                  name="investigating_normal_extend"
                  label="อยู่ระหว่างสอบสวน (กรณีไม่ซับซ้อน) ขยายเวลาได้ครั้งละ"
                  isRequired={true}
                  defaultValue={data?.investigating_normal_extend}
                  placeholder="กรอกจำนวนวัน"
                  onChange={handleChange}
                  errors={errors?.investigating_normal_extend}
                  isDisabled={!isEditingText}
                  className={`w-full ${
                    !isEditingText ? 'bg-(--surface-muted) text-slate-700 opacity-100' : ''
                  }`}
                />

                <FormInput
                  type="number"
                  name="investigating_complex"
                  label="อยู่ระหว่างสอบสวน (กรณีซับซ้อน)"
                  isRequired={true}
                  defaultValue={data?.investigating_complex}
                  placeholder="กรอกจำนวนวัน"
                  onChange={handleChange}
                  errors={errors?.investigating_complex}
                  isDisabled={!isEditingText}
                  className={`w-full ${
                    !isEditingText ? 'bg-(--surface-muted) text-slate-700 opacity-100' : ''
                  }`}
                />

                <FormInput
                  type="number"
                  name="investigating_complex_extend"
                  label="อยู่ระหว่างสอบสวน (กรณีซับซ้อน) ขยายเวลาได้ครั้งละ"
                  isRequired={true}
                  defaultValue={data?.investigating_complex_extend}
                  placeholder="กรอกจำนวนวัน"
                  onChange={handleChange}
                  errors={errors?.investigating_complex_extend}
                  isDisabled={!isEditingText}
                  className={`w-full ${
                    !isEditingText ? 'bg-(--surface-muted) text-slate-700 opacity-100' : ''
                  }`}
                />
              </div>

              {isEditingText && (
                <>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={handleCancelText} className="px-6">
                      ยกเลิก
                    </Button>
                    <Button onClick={handleSaveText} className="px-6 gap-2">
                      <Save className="h-4 w-4" /> บันทึกข้อความ
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  )
}

export default TermForm
