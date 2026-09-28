import { Link } from '@adonisjs/inertia/react'
import MainLayout from '~/components/main_layout'
import { PageContainer } from '~/components/page_container'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  ArrowLeft,
  FileSearch,
  AlertTriangle,
  // ChevronDown,
  // ChevronUp,
  AlertCircle,
} from 'lucide-react'
import { Head, useForm } from '@inertiajs/react'
import { ComplaintStatusStyles, formatDateTime, formatDateTimeSecond } from '~/lib/utils'
import { useEffect, useState } from 'react'

type TrackingProps = {
  model: any | null
}

export default function Tracking({ model: InitialModel }: TrackingProps) {
  const [model, setModel] = useState(InitialModel)
  // const [hasSubmit, setHasSubmit] = useState(false)
  // const [isTimelineExpanded, setIsTimelineExpanded] = useState(false)
  const { data, setData, post, errors, reset, processing, wasSuccessful } = useForm({
    code: '',
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    // setHasSubmit(true)
    post('/tracking')
  }

  const handleBackToSearch = () => {
    setModel(null)
    reset()
  }

  useEffect(() => {
    if (wasSuccessful) {
      setModel(InitialModel)
    }
  }, [InitialModel, wasSuccessful])

  return (
    <>
      <Head>
        <title>ติดตามสถานะเรื่องร้องเรียน — บริษัท กลุ่มสมอทอง จำกัด (มหาชน)</title>
        <meta name="description" content="ตรวจสอบสถานะเรื่องร้องเรียนด้วยหมายเลขอ้างอิง" />
      </Head>

      <PageContainer>
        <section className="py-3 md:py-8">
          <MainLayout>
            {!model && (
              <div className="mb-6">
                <Link
                  route="home"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#002856] hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>กลับสู่หน้าแรก</span>
                </Link>
              </div>
            )}

            {/* =======================
              VIEW 1: หน้าฟอร์มค้นหา
              ======================= */}
            {!model && (
              <>
                <h1 className="mt-4 font-display text-3xl font-bold text-primary md:text-4xl">
                  ติดตามสถานะเรื่องร้องเรียน
                </h1>
                <div className="mt-3 h-0.5 w-48 rounded-full bg-[#D29E0E]" />
                <p className="mt-4 text-sm leading-relaxed text-[#002856]">
                  กรุณากรอกหมายเลขอ้างอิงที่ได้รับเมื่อส่งเรื่อง (รูปแบบ{' '}
                  <span className="font-mono">CMP-XXXXXXXX</span>) เพื่อความเป็นส่วนตัว
                  ระบบจะแสดงเฉพาะข้อมูลสรุปเท่านั้น
                </p>

                <div className="mt-6">
                  <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
                    <h1 className="font-display text-lg font-semibold text-primary">
                      ติดตามสถานะเรื่องร้องเรียน
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      กรุณากรอกหมายเลขอ้างอิงที่ได้รับเมื่อส่งเรื่อง
                    </p>
                    <form onSubmit={handleSubmit} className="mt-4">
                      <Label
                        htmlFor="ref"
                        className="text-xs font-semibold tracking-wide text-muted-foreground"
                      >
                        หมายเลขอ้างอิง
                      </Label>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          placeholder=""
                          maxLength={12}
                          value={data?.code}
                          onChange={(e) => setData('code', e.target.value)}
                          className="font-mono uppercase"
                        />
                        <Button type="submit" className="rounded-sm" disabled={processing}>
                          <FileSearch className="mr-1.5 h-4 w-4" />{' '}
                          {processing ? 'กำลังตรวจสอบ…' : 'ตรวจสอบสถานะ'}
                        </Button>
                      </div>
                      {errors.code && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FF4D00]">
                          <AlertCircle className="h-3 w-3" />
                          หมายเลขอ้างอิงไม่ถูกต้อง
                        </p>
                      )}
                    </form>
                  </div>
                </div>

                {errors.code && !model && (
                  <div className="mt-6 flex items-start gap-3 border border-warning/40 bg-warning/10 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-warning-foreground" />
                    <div>
                      <div className="font-semibold">ไม่พบเรื่องร้องเรียน</div>
                      <div className="text-sm text-muted-foreground">
                        ไม่พบเรื่องร้องเรียนที่ตรงกับหมายเลขอ้างอิง โปรดตรวจสอบและลองใหม่อีกครั้ง
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* =======================
              VIEW 2: หน้าแสดงผลลัพธ์
              ======================= */}
            {model && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <button
                  onClick={handleBackToSearch}
                  className="inline-flex items-center text-sm font-normal text-[#002856] hover:text-white transition-colors rounded-full px-3 py-1.5 hover:bg-[#002856]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> กลับสู่หน้าติดตามสถานะเรื่องร้องเรียน
                </button>

                <h1 className="mt-6 font-display text-3xl font-bold text-primary md:text-4xl">
                  ติดตามสถานะเรื่องร้องเรียน
                </h1>
                <div className="mt-3 h-0.5 w-48 rounded-full bg-[#D29E0E]" />
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  กรุณากรอกหมายเลขอ้างอิงที่ได้รับเมื่อส่งเรื่อง (รูปแบบ CMP-XXXXXXXX)
                  เพื่อความเป็นส่วนตัว ระบบจะแสดงเฉพาะข้อมูลสรุปเท่านั้น
                </p>

                <div className="mt-8 rounded-lg border border-border bg-white shadow-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-border bg-[#F4F4F4]">
                    <h2 className="text-xl font-bold text-[#002856]">สถานะเรื่องร้องเรียน</h2>
                    <div
                      className={`mt-3 sm:mt-0 px-4 py-1.5 rounded-md text-sm font-semibold text-white ${ComplaintStatusStyles(model.status)[0]}`}
                    >
                      {model.status_title}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* กรอบรายละเอียด */}
                    <div className="bg-[#F9FAFB] border border-[#D6D7D9] rounded-lg p-5 space-y-3">
                      <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
                        <span className="font-bold">หมายเลขอ้างอิง :</span>
                        <span>{model.code}</span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
                        <span className="font-bold">ประเภทเรื่องร้องเรียน :</span>
                        <span>
                          {model.FormCategory?.title} &gt;
                          {model.FormSubject?.title} {model.FormSubjectOther}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
                        <span className="font-bold">สาขาที่เกิดเหตุ :</span>
                        <span>{model.Organization?.title}</span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
                        <span className="font-bold">วันที่และเวลาที่เกิดเหตุ :</span>
                        <span>{formatDateTime(model.incidentAt)}</span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-x-2 text-sm text-slate-700">
                        <span className="font-bold">อัปเดตล่าสุด :</span>
                        <span>{formatDateTime(model.updatedAt)}</span>
                      </div>
                    </div>

                    {/* เส้นกั้น */}
                    <div className="my-8 border-t border-slate-200" />

                    {/* --- ส่วนแสดงผล Timeline --- */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">ลำดับสถานะ:</h3>

                      <div className="mt-6 ml-2">
                        {model.Trackings?.length === 0 ? (
                          <div className="text-sm text-muted-foreground">
                            ยังไม่มีการอัปเดตสถานะ
                          </div>
                        ) : (
                          <div className="flex flex-col transition-all duration-300 ease-in-out">
                            {model.Trackings?.filter(
                              (tracking: any, index: number, trackings: any[]) =>
                                index === 0 || tracking.status !== trackings[index - 1].status
                            ).map((h: any, i: number, trackings: any[]) => {
                              const isLastVisible = i === trackings.length - 1

                              // จัดการสีของจุด
                              let textColor = 'text-muted-foreground'
                              let dotBorder = 'border-muted-foreground/30'
                              let dotBg = 'bg-card'

                              // ให้จุดแรกสุด (index 0) ของทั้งหมดเป็นสีเด่น
                              if (i === 0) {
                                const getStatusStyle = ComplaintStatusStyles(h.status)
                                textColor = getStatusStyle[1]
                                dotBorder = getStatusStyle[2]
                                dotBg = getStatusStyle[3]
                              } else {
                                // ถ้าเป็นจุดเก่า (ไม่อันดับ 1) สีเทา
                                textColor = 'text-muted-foreground/70'
                                dotBg = 'bg-transparent'
                              }

                              return (
                                <div
                                  key={i}
                                  className="relative pl-8 pb-8 last:pb-0 animate-in fade-in duration-300"
                                >
                                  {/* เส้นเชื่อม (สีเทาเสมอ) */}
                                  {!isLastVisible && (
                                    <span className="absolute left-2 top-6 -bottom-2 w-0.5 bg-muted-foreground/20" />
                                  )}

                                  {/* จุด (Node) */}
                                  <span
                                    className={`absolute left-0 top-1.5 flex h-4.5 w-4.5 rounded-full border-2 ${dotBorder} ${dotBg}`}
                                  />

                                  <div className={`font-bold text-[15px] ${textColor}`}>
                                    {h.status_title}
                                  </div>

                                  <div className="mt-1 text-[13px] text-muted-foreground/70">
                                    {h.createdAt
                                      ? formatDateTimeSecond(h.createdAt)
                                      : 'ยังไม่มีข้อมูลเวลา'}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* ปุ่มดูเพิ่มเติม / ย่อกลับ */}
                        {/* {hasMoreHistory && (
                          <div className="mt-2 flex justify-center w-full">
                            <button
                              onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
                              className="flex flex-col items-center justify-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer group"
                            >
                              <span>{isTimelineExpanded ? 'ย่อกลับ' : 'ดูเพิ่มเติม'}</span>
                              {isTimelineExpanded ? (
                                <ChevronUp className="h-4 w-4 mt-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              ) : (
                                <ChevronDown className="h-4 w-4 mt-0.5 group-hover:translate-y-0.5 transition-transform" />
                              )}
                            </button>
                          </div>
                        )} */}
                      </div>
                    </div>

                    {/* --- ส่วนแสดงผลแบบมีเงื่อนไข (Card 3 กล่อง) เมื่อปิดเรื่อง --- */}
                    {/* {model.status === 'ปิดเรื่อง' && (
                      <div className="mt-8">
                        <div className="border-t border-slate-200 mb-8" />
                        <div className="space-y-4">
                          <ResolutionCard
                            title="มาตรการแก้ไขเฉพาะหน้า :"
                            items={mockResolutionData.immediateAction}
                          />
                          <ResolutionCard title="สาเหตุ :" items={mockResolutionData.cause} />
                          <ResolutionCard
                            title="มาตรการแก้ไขและป้องกันไม่ให้เกิดซ้ำ :"
                            items={mockResolutionData.preventiveAction}
                          />
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            )}
          </MainLayout>
        </section>
      </PageContainer>
    </>
  )
}
