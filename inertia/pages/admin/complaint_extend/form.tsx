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
import { ComplaintStatusVariant } from '~/components/admin/crud/utils/enum'
import {
  ComplaintStatusStyles,
  formatDate,
  formatDateTime,
  formatDateTimeSecond,
} from '~/lib/utils'
// import { ComplaintStatus } from '~/../app/contracts/enum'

type Props = InertiaProps<{
  data?: any
  tracking?: any
  model?: any
}>
const ComplaintsInfoRow = ({ label, content }: { label: string; content: string }) => {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
      <span className="font-bold">{label}</span>
      <span>{content}</span>
    </div>
  )
}

const ComplaintsForm: FC<Props> = ({ model, tracking, ...page }) => {
  const [isShowOnly] = useState(page.currentAction === 'show')
  const [formAction] = useState(`/process/complaint_extend/${tracking?.id}`) //+ (page.currentAction === 'create' ? '' : model?.id)

  const handleChange = (e: any) => {
    setData(e.target.name, e.target.value)
  }

  const { data, setData, put, reset, errors, processing } = useForm({
    approveStatus: model?.approveStatus ? String(model!.approveStatus) : '0',
    remark: model?.remark ?? '',
  })
  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (isShowOnly) {
      return
      // } else if (page.currentAction === 'create') {
      // post(formAction)
    } else {
      put(formAction, {
        onSuccess: () => {
          reset('remark')
          reset('approveStatus')

          document.forms[0].reset()
        },
      })
    }
  }

  return (
    <>
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader
            title="รายการเรื่องร้องเรียน"
            description="จัดการรายการเรื่องร้องเรียน"
            breadcrumbs={[{ label: 'เรื่องร้องเรียน' }]}
            actionButtons={
              <Button
                variant="outline"
                onClick={() => router.visit('/process/complaint_extend')}
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
                      // console.log(e)
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
                                <a href={e.fileUrl} target="_blank" rel="noreferrer">
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
                    content={`${formatDateTime(model.updatedAt)} ${model.updatedUser ? 'โดย ' + model.updatedUser.fullName : ''}`}
                  />

                  <ComplaintsInfoRow
                    label="กำหนดส่ง :"
                    content={model.dueDate ? formatDateTime(model.dueDate) : '-'}
                  />

                  <ComplaintsInfoRow
                    label="ผู้รับผิดชอบ :"
                    content={model.ownedUser ? model.ownedUser.fullName : '-'}
                  />
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
                        // const textColor = getStatusStyle[1]
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
                                  className={`absolute left-0 top-1.5 flex h-4.5 w-4.5 rounded-full border-2 border-${statusColor} border-${statusColor} bg-${statusColor} ${dotBorder} ${dotBg}`}
                                />
                                <div className={`font-bold text-[15px] text-${statusColor}`}>
                                  {e.status}
                                </div>
                                <div className={`text-[15px] text-${statusColor}`}>{e.mode}</div>
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
            </CardContent>
          </Card>

          {!isShowOnly && (
            <Card className="w-full border-border bg-white shadow-soft">
              <CardContent className="p-6">
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    ติดตามเรื่องร้องเรียน
                    {/* รหัส:{' '}
                  <span className="text-[#b08730]">{model?.id}</span> */}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                  <FormOptions
                    type="radio"
                    name="approveStatus"
                    label="สถานะ"
                    isRequired={true}
                    defaultValue={data?.approveStatus}
                    onChange={handleChange}
                    errors={errors.approveStatus}
                    isShowOnly={isShowOnly}
                    options={page.data.approve_status_list}
                  />

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

                  <FormInput
                    type="textarea"
                    name="remark"
                    label="ข้อความเพิ่มเติม"
                    isRequired={false}
                    defaultValue={data?.remark}
                    placeholder="กรอกข้อความเพิ่มเติม"
                    onChange={handleChange}
                    errors={errors?.remark}
                    isShowOnly={isShowOnly}
                  />

                  {isShowOnly ? (
                    <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => router.visit('/process/complaint_extend')}
                      >
                        กลับไปก่อนหน้า
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => router.visit('/process/complaint_extend')}
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
          )}
        </div>
      </AdminLayout>
    </>
  )
}

export default ComplaintsForm
