import { type InertiaProps } from '~/types'
import { type FC, useState, useCallback, type FormEvent, useEffect } from 'react'
import { FileText, Save, Upload, ShieldCheck, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Input } from '~/components/ui/input'
import { PageHeader, ActionToolbar } from '~/components/admin/crud'
import { useForm } from '@inertiajs/react'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { toast } from 'sonner'

type Props = InertiaProps<{
  model: {
    term: string
    pdpa: string
    pdpa_file_name: string
  }
}>

const TermForm: FC<Props> = ({ model }) => {
  // const [model] = useState(page.model)
  const [isLoading, setIsLoading] = useState(false)

  // --- State สำหรับส่วนแก้ไขข้อความ ---
  const [isEditingText, setIsEditingText] = useState(false)
  const [editValues, setEditValues] = useState(model)

  // --- State สำหรับส่วนอัปโหลดไฟล์ ---
  // const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleRefresh = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  // const handleImport = useCallback(() => alert('นำเข้าเอกสาร Terms & Privacy (จำลอง)'), [])

  const { data, setData, put, errors, wasSuccessful } = useForm({
    term: model?.term,
    pdpa: model?.pdpa,
  })
  const {
    data: fileData,
    setData: setFileData,
    post,
    errors: fileErrors,
    wasSuccessful: wasFileSuccessful,
  } = useForm<{ pdpa_file_name: string; file: File | null }>({
    pdpa_file_name: model?.pdpa_file_name ?? '',
    file: null,
  })

  // --- Handlers สำหรับส่วนข้อความ ---
  const handleEditTextClick = useCallback(() => {
    setIsEditingText(true)
  }, [])

  const handleSaveText = useCallback(() => {
    setData('term', editValues.term)
    setData('pdpa', editValues.pdpa)
    setIsEditingText(false)
    put('/process/terms/301')
  }, [editValues, setData, put])

  useEffect(() => {
    if (wasSuccessful) {
      toast.success('บันทึกข้อมูลเนื้อหาเรียบร้อย')
    }
  }, [wasSuccessful])

  const handleCancelText = useCallback(() => {
    setIsEditingText(false)
  }, [])

  // --- Handlers สำหรับส่วนไฟล์อัปโหลด ---
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // if (e.target.files?.[0]) setUploadedFile(e.target.files[0])
      if (e.target.files?.[0]) setFileData('file', e.target.files[0])
    },
    [setFileData]
  )

  const handleFileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!fileData.file) return
    setFileData('file', fileData.file)
    post('/process/terms')
  }

  useEffect(() => {
    if (wasFileSuccessful) {
      setFileData('file', null)
      toast.success('อัปโหลดไฟล์เอกสารเรียบร้อย')
    }
  }, [setFileData, wasFileSuccessful])

  const handleCancelFile = useCallback(() => {
    setFileData('file', null)
  }, [setFileData])

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="เงื่อนไขดำเนินการ"
            description="จัดการเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัวของแพลตฟอร์ม"
            breadcrumbs={[{ label: 'ตั้งค่าระบบ' }]}
            actionButtons={
              <ActionToolbar
                onRefresh={handleRefresh}
                // onImport={handleImport}
                exportLabel="ส่งออก"
                isLoading={isLoading}
              />
            }
          />

          {/* =========================================================
          ส่วนที่ 1: จัดการข้อความ (Terms & Privacy)
          ========================================================= */}
          <Card className="border-border bg-white shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-[#111827]">
                เนื้อหาข้อตกลงและนโยบาย
              </CardTitle>
              {!isEditingText && (
                <Button size="sm" variant="outline" onClick={handleEditTextClick} className="gap-2">
                  <FileText className="h-4 w-4" /> แก้ไขข้อความ
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* เงื่อนไขการใช้งาน */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-slate-800 text-base">เงื่อนไขการใช้งาน</h3>
                </div>
                <div className="space-y-3 pl-7">
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1 block">
                      รายละเอียด
                    </label>
                    <Textarea
                      value={isEditingText ? editValues.term : data.term}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          term: e.target.value,
                        })
                      }
                      disabled={!isEditingText}
                      className={`h-28 w-full ${
                        !isEditingText ? 'bg-(--surface-muted) text-slate-700 opacity-100' : ''
                      }`}
                    />
                    {errors.term && <p className="error-text">{errors.term}</p>}
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* การรักษาความปลอดภัยของข้อมูลส่วนบุคคล (Text Only) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-slate-800 text-base">
                    การรักษาความปลอดภัยของข้อมูลส่วนบุคคล
                  </h3>
                </div>
                <div className="space-y-4 pl-7">
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1 block">
                      รายละเอียด
                    </label>
                    <Textarea
                      value={isEditingText ? editValues.pdpa : data.pdpa}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          pdpa: e.target.value,
                        })
                      }
                      disabled={!isEditingText}
                      className={`h-28 w-full ${
                        !isEditingText ? 'bg-(--surface-muted) text-slate-700 opacity-100' : ''
                      }`}
                    />
                    {errors.pdpa && <p className="error-text">{errors.pdpa}</p>}
                  </div>
                </div>
              </div>

              {/* ปุ่ม Action สำหรับ Text */}
              {isEditingText && (
                <>
                  <hr className="border-slate-100 mt-6 mb-4" />
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

          {/* =========================================================
          ส่วนที่ 2: อัปโหลดไฟล์เอกสาร (Privacy Policy)
          ========================================================= */}
          <div>
            <h2 className="font-display text-lg font-semibold text-primary mb-3 pl-1">
              เอกสารแนบ: การรักษาความปลอดภัยของข้อมูลส่วนบุคคล
            </h2>
            <Card className="border-border bg-white shadow-soft">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-slate-700">ไฟล์ Privacy Policy ปัจจุบัน</h3>
                    <p className="text-sm text-muted-foreground mt-1">รองรับ PDF</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* แสดงชื่อไฟล์ */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-md w-full sm:w-auto">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span
                        className={`text-sm ${
                          fileData.file ? 'text-success font-medium' : 'text-slate-600'
                        }`}
                      >
                        {fileData.file
                          ? fileData.file.name
                          : (model && model!.pdpa_file_name && (
                              <a href={model!.pdpa_file_name} target="_blank" rel="noreferrer">
                                {model!.pdpa_file_name.split('/').pop()}
                              </a>
                            )) ||
                            'ยังไม่มีไฟล์เอกสาร'}
                      </span>
                      {fileData.file && (
                        <Button
                          onClick={handleCancelFile}
                          className="ml-2 text-slate-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* กลุ่มปุ่ม Action ไฟล์ */}
                    <form
                      action="/process/terms"
                      method="post"
                      encType="mulipart/form-data"
                      onSubmit={handleFileSubmit}
                    >
                      <div className="flex gap-2 w-full sm:w-auto">
                        {!fileData.file ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById('term-privacy-file-upload')?.click()
                            }
                            className="gap-2 w-full sm:w-auto"
                          >
                            <Upload className="h-4 w-4" />
                            {model.pdpa_file_name ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                          </Button>
                        ) : (
                          <Button type="submit" className="gap-2 w-full sm:w-auto">
                            <Save className="h-4 w-4" /> บันทึกไฟล์
                          </Button>
                        )}
                      </div>

                      {/* Hidden File Input */}
                      <Input
                        id="term-privacy-file-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {fileErrors.file && <div className="error-text">{fileErrors.file}</div>}
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}

export default TermForm
