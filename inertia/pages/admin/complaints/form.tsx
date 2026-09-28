import { type InertiaProps } from '~/types'
import { AdminLayout } from '~/components/admin/layouts/admin_layout'
import { PageHeader } from '~/components/admin/crud'
import { Button } from '~/components/ui/button'
import { ArrowLeft, CheckCircle, Loader2, Save, X } from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { router, useForm } from '@inertiajs/react'
import { type FC, useState } from 'react'
import { FormInput } from '~/components/admin/ui/form/input'
import { FormOptions } from '~/components/admin/ui/form/options'
import { ComplaintStatusVariant } from '~/components/admin/crud/utils/enum'
import {
  ComplaintStatusStyles,
  formatDate,
  formatDateTime,
  formatDateTimeSecond,
} from '~/lib/utils'
import { ComplaintStatus } from '~/../app/contracts/enum'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

type Props = InertiaProps<{
  data?: any
  model?: any
  isSensitive?: boolean
}>
const ComplaintsInfoRow = ({ label, content }: { label: string; content: string }) => {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
      <span className="font-bold">{label}</span>
      <span className="whitespace-pre-line">{content}</span>
    </div>
  )
}

const ComplaintsForm: FC<Props> = ({ model, isSensitive, ...page }) => {
  const getUserId = (e: Array<{ label: string; value: string }>) => {
    if (!e) return []
    return e.map((i: any) => i.value)
  }
  const [newUsers, setNewUsers] = useState<Array<{ label: string; value: string }>>(
    model?.user_groups || []
  )
  const [disabledUserGroup, setDisabledUserGroup] = useState(true)
  const [showUserGroup, setShowUserGroup] = useState(false)
  const [isShowOnly] = useState(page.currentAction === 'show')
  const [formAction] = useState(`${page.data.baseUrl}${model?.id}`) //+ (page.currentAction === 'create' ? '' : model?.id)
  const [isModalOpen, setModalOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ path: string; name: string; size: number; mime: string }>
  >([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleChange = (e: any) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    if (e.target.name === 'status') handleChangeStatus(val)
    setData(e.target.name, val)
  }
  const handleUsers = (e: any) => {
    setNewUsers(e)
  }
  const handleChangeStatus = (val: string) => {
    const status = Number(val)
    if (
      status === page.data.current_status ||
      status === ComplaintStatus.SCREENED ||
      status === ComplaintStatus.REJECTED
    ) {
      setShowUserGroup(false)
      setData('requireUserGroup', false)
      setData('userGroups', [])
      setDisabledUserGroup(true)
    } else {
      setShowUserGroup(true)
      if (page.data.next_user_groups && page.data.next_user_groups.length > 0) {
        setData('requireUserGroup', false)
        setDisabledUserGroup(true)
        setData('userGroups', getUserId(newUsers))
        setNewUsers(page.data.next_user_groups)
      } else {
        setData('requireUserGroup', true)
        setDisabledUserGroup(false)
      }
      //setDisabledUserGroup(val.includes(page.data.next_user_groups))
    }
  }
  const { data, setData, put, reset, errors, processing } = useForm<{
    userGroups: any
    remark: string
    detail: string
    summary: string
    file_1: string | null
    file_2: string | null
    file_3: string | null
    file_4: string | null
    file_5: string | null
    mime_1: string
    mime_2: string
    mime_3: string
    mime_4: string
    mime_5: string
    status: number
    isSensitive: string
    isComplex: string
    requireUserGroup: boolean
    isExtendDueDate: boolean
    isExtendDueDateApprove: boolean
    status_title: string
  }>({
    userGroups: getUserId(model?.user_group_id),
    remark: model?.remark ?? '',
    detail: '',
    summary: '',
    file_1: null,
    file_2: null,
    file_3: null,
    file_4: null,
    file_5: null,
    mime_1: '',
    mime_2: '',
    mime_3: '',
    mime_4: '',
    mime_5: '',
    status: model?.status ? Number(model!.status) : 0,
    isSensitive: model?.isSensitive ? '1' : '0',
    isComplex: model?.isComplex ? '1' : '0',
    requireUserGroup: false,
    isExtendDueDate: false,
    isExtendDueDateApprove: false,
    status_title: '',
  })
  // console.log(data)
  const handleSubmit = (e: any) => {
    e.preventDefault()
    setData('userGroups', getUserId(newUsers))
    if (isShowOnly) {
      return
      // } else if (page.currentAction === 'create') {
      // post(formAction)
    } else {
      put(formAction, {
        onSuccess: () => {
          reset('userGroups')
          reset('remark')
          reset('detail')
          reset('summary')
          reset('file_1')
          reset('file_2')
          reset('file_3')
          reset('file_4')
          reset('file_5')
          reset('mime_1')
          reset('mime_2')
          reset('mime_3')
          reset('mime_4')
          reset('mime_5')
          reset('status')
          reset('isSensitive')
          reset('requireUserGroup')
          reset('isExtendDueDate')
          reset('isExtendDueDateApprove')

          // document.forms[0].reset()
          setModalOpen(false)
        },
      })
    }
  }

  const getCsrfToken = () => {
    const match = document.cookie.match(/(^|; )XSRF-TOKEN=([^;]+)/)
    return match ? decodeURIComponent(match[2]) : ''
  }

  const uploadFiles = async (files: File[]) => {
    const existingFileNames = new Set(uploadedFiles.map((file) => file.name.toLowerCase()))
    const selectedFileNames = new Set<string>()
    const duplicateFileNames: string[] = []
    const filesToUpload = files.filter((file) => {
      const fileName = file.name.toLowerCase()
      if (existingFileNames.has(fileName) || selectedFileNames.has(fileName)) {
        duplicateFileNames.push(file.name)
        return false
      }
      selectedFileNames.add(fileName)
      return true
    })

    if (duplicateFileNames.length > 0) {
      setUploadError(`ไฟล์ชื่อซ้ำ: ${duplicateFileNames.join(', ')}`)
    }
    if (filesToUpload.length === 0) return

    setUploading(true)
    if (duplicateFileNames.length === 0) setUploadError(null)
    let uploadedCount = uploadedFiles.length
    try {
      for (const file of filesToUpload.slice(0, 5 - uploadedCount)) {
        const formData = new FormData()
        formData.append('files', file)
        const uploadUrl = `/process/${isSensitive ? 'complaint_sensitive' : 'complaint'}/files/upload`
        const response = await fetch(uploadUrl, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
          body: formData,
        })
        if (!response.ok) throw new Error('Upload failed')
        const uploaded = await response.json()
        uploadedCount += 1
        setUploadedFiles((current) => [...current, uploaded])
        setData(`file_${uploadedCount}` as keyof typeof data, uploaded.path)
        setData(`mime_${uploadedCount}` as keyof typeof data, uploaded.mime ?? '')
      }
    } catch (_error) {
      setUploadError('ไม่สามารถอัปโหลดไฟล์ได้ กรุณาตรวจสอบประเภทไฟล์')
    } finally {
      setUploading(false)
    }
  }

  const removeUploadedFile = async (file: { path: string }, index: number) => {
    const formData = new FormData()
    formData.append('path', file.path)
    const uploadUrl = `/process/${isSensitive ? 'complaint_sensitive' : 'complaint'}/files/upload/remove`
    await fetch(uploadUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': getCsrfToken() },
      body: formData,
    })
    const remaining = uploadedFiles.filter((_, fileIndex) => fileIndex !== index)
    setUploadedFiles(remaining)
    setData({
      ...data,
      file_1: remaining[0]?.path ?? null,
      file_2: remaining[1]?.path ?? null,
      file_3: remaining[2]?.path ?? null,
      file_4: remaining[3]?.path ?? null,
      file_5: remaining[4]?.path ?? null,
      mime_1: remaining[0]?.mime ?? '',
      mime_2: remaining[1]?.mime ?? '',
      mime_3: remaining[2]?.mime ?? '',
      mime_4: remaining[3]?.mime ?? '',
      mime_5: remaining[4]?.mime ?? '',
    })
  }
  // console.log(model)
  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title={`รายการเรื่องร้องเรียน${isSensitive ? 'ข้อมูลอ่อนไหว' : ''}`}
            description={`จัดการรายการเรื่องร้องเรียน${isSensitive ? 'ข้อมูลอ่อนไหว' : ''}`}
            breadcrumbs={[{ label: `เรื่องร้องเรียน${isSensitive ? 'ข้อมูลอ่อนไหว' : ''}` }]}
            actionButtons={
              <Button
                variant="outline"
                onClick={() => router.visit(page.data.baseUrl)}
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
                  ข้อมูลเรื่องร้องเรียน
                  {/* รหัส:{' '}
                  <span className="text-[#b08730]">{model?.id}</span> */}
                </h2>
              </div>
              <div className="p-1">
                <div className="space-y-3">
                  <ComplaintsInfoRow label="หมายเลขอ้างอิง :" content={model.code} />
                  <ComplaintsInfoRow label="หัวข้อ :" content={model.title} />
                  <ComplaintsInfoRow
                    label="หมวดหมู่เรื่องร้องเรียน :"
                    content={model.FormCategory?.title}
                  />
                  <ComplaintsInfoRow
                    label="ประเด็นเรื่องร้องเรียน :"
                    content={`${model.FormSubject?.title} ${model.formSubjectOther}`}
                  />
                  <ComplaintsInfoRow
                    label="เรื่องอ่อนไหว :"
                    content={`${model.isSensitive ? 'ใช่' : 'ไม่ใช่'}`}
                  />
                  <ComplaintsInfoRow
                    label="เรื่องซับซ้อน :"
                    content={`${model.isComplex ? 'ใช่' : 'ไม่ใช่'}`}
                  />
                  <ComplaintsInfoRow
                    label="วันที่และเวลาที่เกิดเหตุ :"
                    content={formatDateTime(model.incidentAt)}
                  />
                  <ComplaintsInfoRow
                    label="สาขาที่เกิดเหตุ :"
                    content={model.Organization?.title}
                  />
                  <ComplaintsInfoRow
                    label="มีพยานหรือไม่ :"
                    content={model.hasWitness ? 'มี' : 'ไม่มี'}
                  />

                  {model.hasWitness && model.Witnesses && (
                    <div className="items-baseline gap-x-2 text-sm text-slate-700 pl-5 pb-4">
                      <div className="font-bold mb-3">รายชื่อพยาน</div>
                      {model.Witnesses.map((e: any, i: number) => {
                        return (
                          <div
                            className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700"
                            key={`witness-${i}`}
                          >
                            <span className="font-bold">ชื่อ : </span>
                            <span>{e.fullName}</span>
                            <span className="font-bold">โทร : </span>
                            <span>{e.telephone}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <ComplaintsInfoRow label="รายละเอียดเพิ่มเติม :" content={model.detail} />

                  {model.Answers &&
                    model.Answers.map((e: any, i: number) => {
                      return (
                        <ComplaintsInfoRow
                          key={`answer-${i}`}
                          label={`${e.Question?.title} :`}
                          content={
                            e.answerDatetime ? formatDateTime(e.answerDatetime) : e.answerText
                          }
                        />
                      )
                    })}

                  {model.Files && model.Files.length > 0 && (
                    <div className="items-baseline gap-x-2 text-sm text-slate-700 pb-4">
                      <div className="font-bold mb-3">หลักฐานหรือเอกสารประกอบ</div>
                      <div className="pl-5">
                        {model.Files.map((e: any, i: number) => {
                          const extension =
                            (typeof e?.file === 'string' && e.file
                              ? e.file.split('/').pop()?.split('.').pop()?.split(/[?#]/)[0]
                              : e?.mime?.split('/')[1]) ?? ''
                          const fileName = `ไฟล์-${i + 1}${extension ? `.${extension}` : ''}`

                          return (
                            <div
                              className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700"
                              key={`file-${i}`}
                            >
                              <span>
                                -{` `}
                                <a
                                  href={e.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {fileName}
                                </a>
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {!model.isAnonymous && (
                    <div className="items-baseline gap-x-2 text-sm text-slate-700 pb-5">
                      <div className="font-bold mb-3">ผู้ร้องเรียน</div>
                      <div className="pl-5">
                        <ComplaintsInfoRow
                          label="ชื่อ-นามสกุล :"
                          content={model.complainantFullName}
                        />
                        <ComplaintsInfoRow label="อีเมล :" content={model.complainantEmail} />
                        <ComplaintsInfoRow
                          label="เบอร์โทรศัพท์ :"
                          content={model.complainantTelephone}
                        />
                      </div>
                    </div>
                  )}

                  <div className="my-8 border-t border-slate-200" />
                  <ComplaintsInfoRow
                    label="อัปเดตล่าสุด :"
                    content={`${formatDateTimeSecond(model.updatedAt)} ${model.updatedUser ? 'โดย ' + model.updatedUser.fullName : ''}`}
                  />

                  <ComplaintsInfoRow
                    label="กำหนดส่ง :"
                    content={model.dueDate ? formatDate(model.dueDate) : '-'}
                  />

                  <ComplaintsInfoRow
                    label="ผู้รับผิดชอบ :"
                    content={model.TrackingLast?.userGroups.map((e: any) => e.title).join(', ')}
                  />

                  {/* <ComplaintsInfoRow
                    label="ผู้รับผิดชอบ :"
                    content={model.ownedUser ? model.ownedUser.fullName : '-'}
                  /> */}
                </div>
                <div className="my-8 border-t border-slate-200" />
                <div>
                  <h3 className="text-sm font-bold text-slate-800">ประวัติการติดตาม:</h3>
                  <br />
                  <>
                    {model.Trackings &&
                      model.Trackings.map((e: any, i: number) => {
                        const statusColor = ComplaintStatusVariant(e.status_id)
                        const getStatusStyle = ComplaintStatusStyles(e.status_id)
                        const textColor = getStatusStyle[1]
                        const dotBorder = getStatusStyle[2]
                        const dotBg = getStatusStyle[3]
                        return (
                          <div key={`tracking-${i}`} className="ml-2">
                            <div className="flex transition-all duration-300 ease-in-out">
                              <div className="relative pl-8 pb-8 last:pb-0 animate-in fade-in duration-300 flex-2">
                                {i + 1 < model.Trackings.length && (
                                  <span className="absolute left-2 top-6 -bottom-2 w-0.5 bg-muted-foreground/20" />
                                )}
                                <span
                                  className={`absolute left-0 top-1.5 flex h-4.5 w-4.5 rounded-full border-2 border-${statusColor} bg-${statusColor} ${dotBorder} ${dotBg}`}
                                />
                                <div className={`font-bold text-[15px] ${textColor}`}>
                                  {e.status}
                                </div>
                                <div className={`text-[15px] ${textColor}`}>{e.mode}</div>
                                <div className="mt-1 text-[13px] text-muted-foreground/70">
                                  {formatDateTimeSecond(e.updatedAt)}
                                  <br />
                                  {e.updated_user?.organization?.title}
                                  <br />
                                  {e.updated_user?.fullName}
                                  <br />
                                  {e.updated_user?.email}
                                </div>
                              </div>
                              <div className="flex-10 text-[15px]">
                                {e.changes && Object.keys(e.changes).length > 0 && (
                                  <>
                                    {/* <div className="font-bold">ข้อมูลที่แก้ไข</div> */}
                                    <div className="">
                                      {Object.keys(e.changes).map((k: any) => {
                                        const c = e.changes[k]
                                        return (
                                          <div key={`change-${k}`} className="font-[14px]">
                                            <div>
                                              <span className="font-bold">{c[0]}:</span> {c[1]}{' '}
                                              <strong>&rArr;</strong> {c[2]}
                                            </div>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </>
                                )}
                                {e.detail && (
                                  <div>
                                    <strong>รายละเอียดการสอบสวน:</strong> {e.detail}
                                  </div>
                                )}
                                {e.summary && (
                                  <div>
                                    <strong>บทสรุปการสอบสวน:</strong> {e.summary}
                                  </div>
                                )}
                                {e.remark && (
                                  <div>
                                    <strong>หมายเหตุเพิ่มเติม:</strong>{' '}
                                    <span className="whitespace-pre-line">{e.remark}</span>
                                  </div>
                                )}
                                {e.dueDate && (
                                  <div>
                                    <strong>SLA:</strong> {formatDate(e.dueDate)}
                                  </div>
                                )}
                                {e.dueDateExtend && (
                                  <div>
                                    <strong>ขอขยายระยะเวลากำหนดส่ง:</strong>{' '}
                                    {formatDate(e.dueDateExtend)}
                                  </div>
                                )}
                                {e.files && e.files.length > 0 && (
                                  <div>
                                    <strong>ไฟล์แนบเพิ่มเติม:</strong>
                                    <div className="pl-5">
                                      {e.files.map((fileItem: any, fileIdx: number) => {
                                        const fileUrl =
                                          typeof fileItem === 'string' ? fileItem : fileItem.fileUrl
                                        const rawFileName =
                                          typeof fileItem === 'string'
                                            ? decodeURIComponent(fileItem.split('/').pop() ?? '')
                                            : fileItem.file || ''
                                        const extension =
                                          rawFileName.match(/\.([a-zA-Z0-9]+)$/)?.[1] ??
                                          (typeof fileItem === 'string'
                                            ? (fileItem.split('.').pop()?.split(/[?#]/)[0] ?? '')
                                            : (fileItem.mime?.split('/')[1] ?? ''))
                                        const fileName =
                                          // rawFileName ||
                                          `ไฟล์-${fileIdx + 1}${extension ? `.${extension}` : ''}`

                                        return (
                                          <div key={`tracking-file-${fileIdx}`}>
                                            -{' '}
                                            <a
                                              href={fileUrl}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-blue-600 hover:underline"
                                            >
                                              {fileName}
                                            </a>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )}
                                {e.approve_status_id !== 99 && (
                                  <div>
                                    <strong>สถานะการอนุมัติ:</strong> {e.approve_status}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </>
                </div>
              </div>
              {isShowOnly && (
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => router.visit(page.data.baseUrl)}
                  >
                    กลับไปก่อนหน้า
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          {!isShowOnly && (
            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
              {page.data?.status_list?.map((e: { value: string; label: string }, i: number) => {
                return (
                  <Button
                    key={`status-${i}`}
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setData('status', Number(e.value))
                      handleChangeStatus(e.value)
                      setData('status_title', e.label)
                      setModalOpen(true)
                    }}
                    className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-2 transition-colors shadow-sm min-w-35"
                  >
                    {e.label}
                  </Button>
                )
              })}
            </div>
          )}
          {/* <Card className="w-full border-[var(--border)] bg-white shadow-soft">
            <CardContent className="p-6">
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  ติดตามเรื่องร้องเรียน
                  {/* รหัส:{' '}
                  <span className="text-[#b08730]">{model?.id}</span> * /}
                </h2>
              </div> */}
          <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogTitle>ติดตามเรื่องร้องเรียน</DialogTitle>
              <DialogHeader>{data?.status_title}</DialogHeader>
              <form onSubmit={handleSubmit} className="w-full space-y-6">
                {data.status === ComplaintStatus.IN_PROGRESS && (
                  <FormOptions
                    type="radio"
                    name="isSensitive"
                    label="ข้อมูลอ่อนไหว"
                    isRequired={true}
                    defaultValue={data?.isSensitive}
                    onChange={handleChange}
                    errors={errors.isSensitive}
                    isShowOnly={isShowOnly}
                    options={[
                      { label: 'ปกติ', value: '0' },
                      { label: 'อ่อนไหว', value: '1' },
                    ]}
                  />
                )}
                {data.status === ComplaintStatus.INVESTIGATING && (
                  <FormOptions
                    type="radio"
                    name="isComplex"
                    label="ข้อมูลซับซ้อน"
                    isRequired={true}
                    defaultValue={data?.isComplex}
                    onChange={handleChange}
                    errors={errors.isComplex}
                    isShowOnly={isShowOnly}
                    options={[
                      { label: 'ปกติ', value: '0' },
                      { label: 'ซับซ้อน', value: '1' },
                    ]}
                  />
                )}
                {data.status === page.data.current_status && page.data.extend_days > 0 && (
                  <label className="flex rounded-md bg-white px-0 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all indent-1.5">
                    <input
                      type="checkbox"
                      name="isExtendDueDate"
                      checked={Boolean(data.isExtendDueDate)}
                      onChange={handleChange}
                    />
                    ขอขยายระยะเวลา{' '}
                    {data?.isComplex === '1'
                      ? page.data.extend_days_complex
                      : page.data.extend_days}{' '}
                    วัน
                  </label>
                )}
                {/* <FormOptions
                  type="select"
                  name="status"
                  label="สถานะ"
                  isRequired={true}
                  defaultValue={data?.status}
                  placeholder="เลือกสถานะ"
                  onChange={handleChange}
                  errors={errors?.status}
                  isShowOnly={isShowOnly}
                  options={OPTIONS_COMPLAINT_STATUS.filter(
                    (e) => Number(e.value) >= Number(data?.status)
                  )}
                /> */}
                {data.status === ComplaintStatus.INVESTIGATING && (
                  <>
                    <FormInput
                      type="textarea"
                      name="detail"
                      label="รายละเอียดการสอบสวน"
                      isRequired={false}
                      defaultValue={data?.detail}
                      placeholder="กรอกรายละเอียดการสอบสวน"
                      maxLength={100000}
                      onChange={handleChange}
                      errors={errors?.detail}
                      isShowOnly={isShowOnly}
                    />
                    <FormInput
                      type="textarea"
                      name="summary"
                      label="บทสรุปการสอบสวน"
                      isRequired={false}
                      defaultValue={data?.summary}
                      placeholder="กรอกบทสรุปการสอบสวน"
                      maxLength={100000}
                      onChange={handleChange}
                      errors={errors?.summary}
                      isShowOnly={isShowOnly}
                    />
                  </>
                )}
                <FormInput
                  type="textarea"
                  name="remark"
                  label="ข้อความเพิ่มเติม"
                  isRequired={false}
                  defaultValue={data?.remark}
                  placeholder="กรอกข้อความเพิ่มเติม"
                  maxLength={100000}
                  onChange={handleChange}
                  errors={errors?.remark}
                  isShowOnly={isShowOnly}
                />
                {!isShowOnly &&
                  (data.status === ComplaintStatus.IN_PROGRESS ||
                    data.status === ComplaintStatus.INVESTIGATING ||
                    data.status === ComplaintStatus.COMPLETED) && (
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700">
                        ไฟล์แนบเพิ่มเติม (สูงสุด 5 ไฟล์ ไม่เกินไฟล์ละ 1 GB)
                        <br />
                        (pdf, docx, doc, png, jpg, jpeg, mp4, mov, mp3, wav, flac, aac, alac, m4a,
                        xlsx, xls, zip)
                      </label>
                      <input
                        type="file"
                        // multiple
                        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.mp4,.mov,.mp3,.wav,.flac,.aac,.alac,.m4a,.xlsx,.xls,.zip"
                        name="files"
                        disabled={uploading}
                        onClick={(e) => {
                          if (uploadedFiles.length >= 5) {
                            e.preventDefault()
                            setUploadError('เลือกได้สูงสุด 5 ไฟล์')
                          }
                        }}
                        onChange={(e) => {
                          void uploadFiles(Array.from(e.target.files || []))
                          e.target.value = ''
                        }}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border border-slate-300 rounded-md p-1"
                      />
                      {uploadError && <span className="text-xs text-red-500">{uploadError}</span>}
                      {uploadedFiles.length > 0 && (
                        <ul className="space-y-1 pl-1">
                          {uploadedFiles.map((file, idx) => (
                            <li
                              key={`${file.path}-${idx}`}
                              className="text-xs text-slate-600 flex items-center justify-between gap-1.5 rounded bg-slate-50 px-2 py-1 border border-slate-200"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <CheckCircle className="h-4 w-4 flex-none text-green-500" />
                                <span className="">{file.name}</span>
                                <span className="text-slate-400">
                                  ({Math.round(file.size / 1024)} KB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => void removeUploadedFile(file, idx)}
                                className="text-slate-400 hover:text-red-500 p-0.5"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {(errors?.file_1 ||
                        errors?.file_2 ||
                        errors?.file_3 ||
                        errors?.file_4 ||
                        errors?.file_5) && (
                        <span className="text-xs text-red-500">
                          {errors?.file_1 ||
                            errors?.file_2 ||
                            errors?.file_3 ||
                            errors?.file_4 ||
                            errors?.file_5}
                        </span>
                      )}
                    </div>
                  )}
                {showUserGroup && (
                  <FormOptions
                    type="select_multiple"
                    name="userGroups"
                    label="กลุ่มผู้ใช้งาน"
                    isRequired={true}
                    defaultValue={page.data.next_user_groups}
                    placeholder="เลือกกลุ่มผู้ใช้งาน"
                    onChange={handleUsers}
                    errors={errors?.userGroups}
                    isShowOnly={isShowOnly}
                    options={page.data.user_groups}
                    disabled={disabledUserGroup}
                  />
                )}
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setModalOpen(false)}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#b08730] hover:bg-[#8e6c25] text-white gap-2 transition-colors shadow-sm min-w-35"
                    disabled={processing || uploading}
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
              </form>
            </DialogContent>
          </Dialog>
          {/* </CardContent>
          </Card> */}
        </div>
      </AdminLayout>
    </>
  )
}

export default ComplaintsForm
