import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PageContainer } from '~/components/page_container'
import { cn } from '~/lib/utils'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { FieldError } from '~/components/ui/field'
import { HorizontalStepper } from '~/components/ui/horizontal_stepper'
import { useRef, useState } from 'react'
import { useForm } from '@inertiajs/react'

type ComplaintCategoryProps = {
  categoryList: any[]
  model: any
}

export default function ComplaintCategory({ categoryList, model }: ComplaintCategoryProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [maxVisibleStep, setMaxVisibleStep] = useState(1)
  const [currentCategory, setCurrentCategory] = useState<{ form_subjects?: any[] } | null>(null)
  const [currentSubject, setCurrentSubject] = useState<any>(null)
  const topOfFormRef = useRef<HTMLDivElement | null>(null)

  function openStep(step: number) {
    setCurrentStep(step)
    setMaxVisibleStep((value) => Math.max(value, step))
  }

  const { data, setData, post, errors, processing } = useForm({
    title: model?.title ?? '',
    formCategoryId: model?.formCategoryId,
    formSubjectId: model?.formSubjectId,
    formSubjectOther: model?.formSubjectOther,
  })
  const onSubmit = (e: any) => {
    e.preventDefault()
    post('/complaint/category')
  }

  const onChange = (
    categoryId: number,
    subjectId: number,
    subjectOther: string,
    selectedCategory: any,
    selectedSubject: any
  ) => {
    setData('formCategoryId', categoryId)
    setData('formSubjectId', subjectId)
    setData('formSubjectOther', subjectOther)
    setCurrentCategory(selectedCategory)
    setCurrentSubject(selectedSubject)
  }

  return (
    <PageContainer>
      <section className="py-12 md:py-8 bg-white">
        <div ref={topOfFormRef} className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          {/* ส่วนหัว: ปุ่มกลับหน้าแรก */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-[#002856] hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> กลับสู่หน้าแรก
            </Link>
          </div>

          {/* แถบ Stepper */}
          <HorizontalStepper
            currentStep={currentStep}
            maxVisibleStep={maxVisibleStep}
            onStepClick={(step: number) => openStep(step)}
          />

          {/* เริ่มฟอร์มหลัก */}
          <form onSubmit={onSubmit} className="mt-8 transition-all duration-300">
            {/* ==========================================
                STEP 1: หมวดหมู่และประเด็น
            ========================================== */}
            {currentStep === 1 && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
                <div className="mb-2 border-b border-border pb-4">
                  <h2 className="text-lg font-bold text-[#002856]">
                    หมวดหมู่และประเด็นที่เกี่ยวข้อง (Category & Related Issue){' '}
                    <span className="text-destructive">*</span>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    กรุณาเลือกหมวดหมู่การแจ้งเรื่องและประเด็นที่เกี่ยวข้อง
                    เพื่อให้บริษัทสามารถจัดประเภทและดำเนินการตรวจสอบได้อย่างเหมาะสม
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="border-b-2 border-border pb-4">
                    <Label htmlFor="title" className="text-sm font-normal text-[#002856]">
                      หัวข้อ (Complaint Title) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      maxLength={20}
                      className={cn(
                        'mt-3 h-12 w-full rounded-lg border-[#D6D7D9] bg-white text-[#002856] transition-all outline-none',
                        'hover:border-[#D29E0E] focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]',
                        errors.title &&
                          'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]'
                      )}
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="ระบุหัวข้อ (สูงสุด 20 ตัวอักษร)"
                      required
                    />
                    <div className="mt-1 flex items-start justify-between gap-3">
                      <FieldError msg={errors.title} />
                      <span className="ml-auto text-xs text-muted-foreground">
                        {data.title.length}/20
                      </span>
                    </div>
                  </div>

                  {/* เลือกหมวดหมู่หลัก */}
                  <div className="border-b-2 border-border">
                    <Label className="text-sm font-normal text-[#002856]">
                      เลือกหมวดหมู่การแจ้งเรื่อง (Select Reporting Category){' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-3 mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                      {categoryList.map((category: any) => {
                        const active = category.id === data.formCategoryId
                        return (
                          <Button
                            key={category.id}
                            type="button"
                            variant="ghost"
                            onClick={() => onChange(category.id, 0, '', category, null)}
                            className={cn(
                              'h-auto w-full flex-col items-start justify-start whitespace-normal rounded-xl border p-4 text-left transition-all',
                              active
                                ? 'border-[#002856] bg-[#002856] text-white shadow-md hover:bg-[#002856] hover:text-white'
                                : 'border-border bg-card text-foreground hover:border-[#002856]/30 hover:bg-slate-50'
                            )}
                          >
                            <div className="font-bold text-sm md:text-base">{category.title}</div>
                            {category.subTitle && (
                              <div className="mt-0 text-xs font-medium opacity-80">
                                {category.subTitle}
                              </div>
                            )}

                            {category.description && (
                              <div className="mt-0 text-[11px] md:text-xs opacity-90 leading-relaxed">
                                {category.description}
                              </div>
                            )}
                          </Button>
                        )
                      })}
                    </div>
                    <FieldError msg={errors.formCategoryId} />
                  </div>

                  {/* เลือกประเด็น (หัวข้อย่อย) */}
                  <div
                    className={cn(
                      'transition-opacity',
                      !data.formCategoryId && 'pointer-events-none opacity-50'
                    )}
                  >
                    <Label className="text-sm font-normal text-[#002856]">
                      เลือกประเด็นที่เกี่ยวข้อง (Select Related Issue){' '}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {currentCategory?.form_subjects?.map((subject: any) => {
                        const active = subject.id === data.formSubjectId
                        return (
                          <Button
                            key={subject.id}
                            type="button"
                            variant="ghost"
                            onClick={() =>
                              onChange(
                                data.formCategoryId,
                                subject.id,
                                '',
                                currentCategory,
                                subject
                              )
                            }
                            className={cn(
                              'h-auto w-full flex-col items-start justify-start whitespace-normal rounded-xl border p-4 text-left transition-all',
                              active
                                ? 'border-[#002856] bg-[#002856] text-white shadow-md hover:bg-[#002856] hover:text-white'
                                : 'border-border bg-card text-foreground hover:border-[#002856]/30 hover:bg-slate-50'
                            )}
                          >
                            <div className="font-bold text-sm">{subject.title}</div>

                            {subject.subTitle && (
                              <div className="mt-1 text-[11px] md:text-xs font-medium opacity-80">
                                {subject.subTitle}
                              </div>
                            )}
                          </Button>
                        )
                      })}
                    </div>
                    <FieldError msg={errors.formSubjectId} />

                    {/* ==========================================
                        เพิ่มช่องกรอกข้อความสำหรับ "อื่นๆ" ตรงนี้
                    ========================================== */}
                    {currentSubject?.isOther && (
                      <div className="mt-4 animate-[fadeIn_0.2s_ease-out_both] rounded-xl border border-border bg-[#FFFFFF] p-4 md:p-5">
                        <Label className="text-sm font-bold text-[#002856]">
                          โปรดระบุรายละเอียดเพิ่มเติม (Please specify additional details){' '}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          name="formSubjectOther"
                          maxLength={200}
                          className={cn(
                            'mt-3 w-full h-12 rounded-lg transition-all outline-none',
                            'border-[#D6D7D9] bg-white text-[#002856]',
                            'hover:border-[#D29E0E]',
                            'focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]',
                            errors.formSubjectOther &&
                              'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]'
                          )}
                          value={data.formSubjectOther}
                          onChange={(e) => {
                            onChange(
                              data.formCategoryId,
                              data.formSubjectId,
                              e.target.value,
                              currentCategory,
                              currentSubject
                            )
                          }}
                          placeholder="ระบุรายละเอียดเพิ่มเติม..."
                        />
                        <div className="mt-1">
                          <FieldError msg={errors.formSubjectOther} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#D29E0E] hover:bg-[#002856] disabled:bg-[#B8BBBF] text-white px-8 h-11"
                    // onClick={() => handleNextStep(1)}
                    disabled={processing}
                  >
                    ถัดไป <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </PageContainer>
  )
}
