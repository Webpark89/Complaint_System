import { Link } from '@adonisjs/inertia/react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  FileText,
  Plus,
  Send,
  Upload,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
// import { z } from 'zod'
import { PageContainer } from '~/components/page_container'
import { cn } from '~/lib/utils'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Textarea } from '~/components/ui/textarea'
import { Switch } from '~/components/ui/switch'
import { Checkbox } from '~/components/ui/checkbox'
import { FieldGroup, FieldError } from '~/components/ui/field'
import { HorizontalStepper } from '~/components/ui/horizontal_stepper'
import { Calendar as CalendarView } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { useEffect, useRef, useState } from 'react'
import { router, useForm } from '@inertiajs/react'
import { th } from 'date-fns/locale'
import { TimeSelect } from '~/components/ui/time_select'

type ComplaintFormProps = {
  model: any
  form: any
  organizationList: any
  currentStep: number
  maxStep: number
}

const allowedUploadExtensions = new Set([
  'pdf',
  'docx',
  'doc',
  'xls',
  'xlsx',
  'png',
  'jpg',
  'jpeg',
  'mp4',
  'mov',
  'mp3',
  'wav',
  'flac',
  'aac',
  'alac',
  'm4a',
])
const thaiBuddhistLocale = 'th-TH-u-ca-buddhist'

type ThaiDatePickerProps = {
  name: string
  value: Date | string | null
  onChange: (value: Date | null) => void
  error?: boolean
  includeTime?: boolean
}

function ThaiDatePicker({
  name,
  value,
  onChange,
  error,
  includeTime = false,
}: ThaiDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedDate = value instanceof Date ? value : value ? new Date(value) : undefined
  const displayOptions: Intl.DateTimeFormatOptions = includeTime
    ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' }

  function selectDate(date: Date | undefined) {
    onChange(date ?? null)
    setIsOpen(false)
  }

  function changeTime(time: string) {
    if (!selectedDate) return
    const [hours, minutes] = time.split(':').map(Number)
    const nextDate = new Date(selectedDate)
    nextDate.setHours(hours, minutes, 0, 0)
    onChange(nextDate)
  }
  return (
    <div className="flex w-full gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            aria-label={name}
            className={cn(
              'h-13 w-full justify-between rounded-lg border bg-white px-3 text-sm font-normal text-[#002856] hover:border-[#D29E0E] hover:bg-white text-center',
              error && 'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00]'
            )}
          >
            <span className="block mx-auto">
              {selectedDate
                ? selectedDate.toLocaleDateString(thaiBuddhistLocale, displayOptions)
                : '--/--/----'}
            </span>
            <Calendar className="h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarView
            mode="single"
            locale={th}
            selected={selectedDate}
            defaultMonth={selectedDate}
            onSelect={selectDate}
            disabled={{ after: new Date() }}
            formatters={{
              formatCaption: (date) =>
                date.toLocaleDateString(thaiBuddhistLocale, { month: 'long', year: 'numeric' }),
              formatYearDropdown: (date) =>
                date.toLocaleDateString(thaiBuddhistLocale, { year: 'numeric' }),
            }}
          />
        </PopoverContent>
      </Popover>
      {includeTime && (
        <Input
          type="time"
          aria-label={`${name} time`}
          value={
            selectedDate
              ? `${String(selectedDate.getHours()).padStart(2, '0')}:${String(selectedDate.getMinutes()).padStart(2, '0')}`
              : ''
          }
          onChange={(event) => changeTime(event.target.value)}
          disabled={!selectedDate}
          className="h-13 w-28 rounded-lg border-[#D6D7D9] bg-white px-2 text-[#002856] disabled:cursor-not-allowed"
        />
      )}
    </div>
  )
}

function getStepForError(errorKey: string, currentStep: number) {
  if (['formCategoryId', 'formSubjectId', 'formSubjectOther'].includes(errorKey)) {
    return 1
  }
  if (
    [
      'incidentDate',
      'incidentTime',
      'organizationId',
      'hasWitness',
      'witnesses',
      'detail',
      'files',
    ].includes(errorKey) ||
    errorKey.startsWith('witnesses.')
  ) {
    return 2
  }
  if (
    ['isAnonymous', 'complainantFullName', 'complainantEmail', 'complainantTelephone'].includes(
      errorKey
    )
  ) {
    return 3
  }
  if (errorKey === 'confirm') {
    return 4
  }
  return currentStep
}

export default function ComplaintForm({
  model: initialModel,
  form: initialForm,
  organizationList,
  currentStep: initialCurrentStep,
  maxStep: initialMaxStep,
}: ComplaintFormProps) {
  const [currentStep, setCurrentStep] = useState(initialCurrentStep)
  const [maxVisibleStep, setMaxVisibleStep] = useState(initialMaxStep)
  const topOfFormRef = useRef<HTMLDivElement | null>(null)
  const initializedOnFirstLoadRef = useRef(false)
  const [model] = useState(initialModel)
  const [form] = useState(initialForm)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [errorFocusTarget, setErrorFocusTarget] = useState<string | null>(null)
  const submitAttemptedRef = useRef(false)
  const { data, setData, post, errors, processing, clearErrors } = useForm({
    step: currentStep,
    formCategoryId: model?.formCategoryId,
    formSubjectId: model?.formSubjectId,
    formSubjectOther: model?.formSubjectOther,
    incidentDate: model?.incidentDate ?? null,
    incidentTime: model?.incidentTime ?? null,
    organizationId: model?.organizationId ?? '',
    hasWitness: model?.hasWitness ?? true,
    witnesses: model?.witnesses || [],
    detail: model?.detail ?? '',
    fileNames: model?.fileNames ?? [],
    files: model?.files || [],
    mimes: model?.mimes || [],
    isAnonymous: model?.isAnonymous ?? false,
    complainantFullName: model?.complainantFullName ?? '',
    complainantEmail: model?.complainantEmail ?? '',
    complainantTelephone: model?.complainantTelephone ?? '',
    confirm: model?.confirm ?? false,
    answers: model?.answers || [],
  })
  useEffect(() => {
    if (initializedOnFirstLoadRef.current) return
    initializedOnFirstLoadRef.current = true

    // Reset user-entered fields only once on first load of this page.
    // Keep category context from step 1 so user flow remains intact.
    setData({
      step: initialCurrentStep,
      formCategoryId: model?.formCategoryId,
      formSubjectId: model?.formSubjectId,
      formSubjectOther: model?.formSubjectOther,
      incidentDate: null,
      incidentTime: null,
      organizationId: '',
      hasWitness: true,
      witnesses: [{ name: '', phone: '' }],
      detail: '',
      fileNames: [],
      files: [],
      mimes: [],
      isAnonymous: false,
      complainantFullName: '',
      complainantEmail: '',
      complainantTelephone: '',
      confirm: false,
      answers: [],
    })
  }, [initialCurrentStep, model, setData])

  useEffect(() => {
    if (data.hasWitness && (!data.witnesses || data.witnesses.length === 0)) {
      setData('witnesses', [{ name: '', phone: '' }])
    }
  }, [data.hasWitness, data.witnesses, setData])
  // console.log(data)
  useEffect(() => {
    topOfFormRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [currentStep])

  useEffect(() => {
    if (errorFocusTarget) {
      const element =
        document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          `[name="${errorFocusTarget}"][value=""]`
        ) ?? document.querySelector<HTMLSelectElement>(`select[name="${errorFocusTarget}"]`)

      if (element) {
        element.focus()
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      // setErrorFocusTarget(null)
    }
  }, [errorFocusTarget])

  useEffect(() => {
    if (submitAttemptedRef.current && Object.keys(errors || {}).length > 0) {
      let firstKey = Object.keys(errors || {})[0]
      const step = getStepForError(firstKey, currentStep)
      setCurrentStep(step)
      setMaxVisibleStep((value) => Math.max(value, step))
      if (firstKey.startsWith('witnesses.')) {
        const parts = firstKey.split('.')
        // const index = parts[1]
        const field = parts[2]
        // firstKey = `witnesses[${index}].${field}`
        firstKey = `witness_${field}`
      } else if (firstKey === 'incidentDate') {
        firstKey = 'day'
      } else if (firstKey === 'incidentTime') {
        firstKey = 'incidentTimeHour'
      }
      setErrorFocusTarget(firstKey)
      submitAttemptedRef.current = false
    }
  }, [currentStep, errors])

  function handleNextStep(stepToValidate: number) {
    submitAttemptedRef.current = true
    if (stepToValidate === 2) {
      post('/complaint/form/2', { preserveState: true, onSuccess: () => openStep(3) })
    } else if (stepToValidate === 3) {
      post('/complaint/form/3', { preserveState: true, onSuccess: () => openStep(4) })
    } else if (stepToValidate === 4) {
      post('/complaint/form/confirm', { preserveState: true })
    }
  }

  function getCsrfToken() {
    const match = document.cookie.match(/(^|; )XSRF-TOKEN=([^;]+)/)
    return match ? decodeURIComponent(match[2]) : ''
  }

  function clearValidationErrors(...fields: string[]) {
    ;(clearErrors as (...fieldList: string[]) => void)(...fields)
  }

  function hasValidationError(field: string) {
    return Boolean((errors as Record<string, unknown> | undefined)?.[field])
  }

  function setDynamicField(field: string, value: any) {
    ;(setData as (key: string, value: any) => void)(field, value)
  }

  function getFileName(file: File | string) {
    const fileName = typeof file === 'string' ? (file.split('/').pop() ?? file) : file.name
    // Uploaded files are stored as `${timestamp}-${originalName}`. Remove only
    // that generated prefix so hyphens in the original filename are preserved.
    return fileName.replace(/^\d+-/, '')
  }

  function addFiles(list: FileList | null) {
    if (!list) return
    // if (data.files?.length >= 5) {
    //   toast.error(`เลือกได้สูงสุด 5 ไฟล์`)
    //   return
    // }

    const existingFileNames = new Set((data.files ?? []).map(getFileName))
    const selectedFileNames = new Set<string>()
    const duplicateFileNames: string[] = []
    const invalidFileNames: string[] = []
    const next = Array.from(list).filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
      if (!allowedUploadExtensions.has(extension)) {
        invalidFileNames.push(file.name)
        return false
      }
      const fileName = getFileName(file)
      if (existingFileNames.has(fileName) || selectedFileNames.has(fileName)) {
        duplicateFileNames.push(fileName)
        return false
      }
      selectedFileNames.add(fileName)
      return true
    })
    // .slice(0, 5 - data.files?.length)

    if (duplicateFileNames.length > 0) {
      toast.error(`ไฟล์ชื่อซ้ำ: ${duplicateFileNames.join(', ')}`)
    }
    if (invalidFileNames.length > 0) {
      toast.error(`ไม่รองรับไฟล์: ${invalidFileNames.join(', ')}`)
    }
    if (next.length === 0) return

    setUploadError(null)
    setUploading(true)
    const formData = new FormData()
    next.forEach((file) => formData.append('files', file))

    fetch('/complaint/form/upload', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      body: formData,
    })
      .then(async (response) => {
        const text = await response.text()
        if (!response.ok) {
          throw new Error('Upload failed')
        }
        try {
          const payload = JSON.parse(text)
          setData('files', payload.files ?? [])
          setData('mimes', payload.mimes ?? [])
          toast.success('อัปโหลดไฟล์สำเร็จ')
        } catch (error) {
          throw error
        }
      })
      .catch((_error: unknown) => {
        setUploadError('ไม่สามารถอัปโหลดไฟล์ได้ กรุณาตรวจสอบประเภทไฟล์')
        toast.error('ไม่สามารถอัปโหลดไฟล์ได้ กรุณาตรวจสอบประเภทไฟล์')
      })
      .finally(() => {
        setUploading(false)
      })
  }

  function removeFile(filePath: string) {
    const formData = new FormData()
    formData.append('path', filePath)

    fetch('/complaint/form/upload/remove', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
      },
      body: formData,
    })
      .then(async (response) => {
        const text = await response.text()
        if (!response.ok) {
          console.error('Remove response error:', text)
          throw new Error('Remove failed')
        }
        try {
          const payload = JSON.parse(text)
          setData('files', payload.files ?? [])
          setData('mimes', payload.mimes ?? [])
        } catch (error) {
          console.error('Remove response was not valid JSON:', text)
          throw error
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  function openStep(step: number) {
    if (step === 1) router.visit('/complaint/category')
    setCurrentStep(step)
    setMaxVisibleStep((value) => Math.max(value, step))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    submitAttemptedRef.current = true
    post('/complaint/form/confirm', { preserveState: true })
  }

  function formatReviewDate(value: Date | string | null | undefined) {
    if (!value) return '-'
    const date = value instanceof Date ? value : new Date(value)
    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  function reviewValue(value: unknown) {
    return value === null || value === undefined || value === '' ? '-' : String(value)
  }

  const handleChange = (e: any) => {
    const fieldName = e.target.name as keyof typeof data
    setData(fieldName, e.target.value)
    clearValidationErrors(String(fieldName))
  }

  const handleDateChange = (inputName: keyof typeof data, e: any) => {
    setData(inputName, e)
    clearValidationErrors(String(inputName))
  }

  const handleAnswerDateChange = (questionId: number, value: Date | null) => {
    const updated = [...data.answers!]
    updated[questionId] = value
    setData('answers', updated)
    setDynamicField(`answers_${questionId}`, value)
    clearValidationErrors(`answers_${questionId}`)
  }

  const handleAnswerTimeChange = (questionId: number, value: string | null) => {
    const currentValue = data.answers[questionId]
    const currentDate =
      currentValue instanceof Date ? new Date(currentValue) : new Date(currentValue)
    if (!value || Number.isNaN(currentDate.getTime())) return

    const [hours, minutes] = value.split(':').map(Number)
    currentDate.setHours(hours, minutes, 0, 0)
    handleAnswerDateChange(questionId, currentDate)
  }

  const getAnswerTime = (questionId: number) => {
    const value = data.answers[questionId]
    const date = value instanceof Date ? value : value ? new Date(value) : null
    return date && !Number.isNaN(date.getTime())
      ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
      : null
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
            onStepClick={(step) => openStep(step)}
          />

          {/* เริ่มฟอร์มหลัก */}
          <form onSubmit={onSubmit} className="mt-8 transition-all duration-300">
            {/* ==========================================
                STEP 2: รายละเอียดเหตุการณ์ (แนบไฟล์อยู่ท้ายสุด)
            ========================================== */}
            {currentStep === 2 && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
                <h2 className="mb-6 border-b pb-4 text-lg font-bold text-[#002856]">
                  ข้อมูลและรายละเอียดเหตุการณ์ (Incident Information & Details){' '}
                  <span className="text-destructive">*</span>
                  <p className="mt-2 text-sm text-muted-foreground">
                    กรุณาเลือกหมวดหมู่การแจ้งเรื่องและประเด็นที่เกี่ยวข้อง
                    เพื่อให้บริษัทสามารถจัดประเภทและดำเนินการตรวจสอบได้อย่างเหมาะสม
                  </p>
                </h2>

                <div className="space-y-8">
                  {/* แถวที่ 1: วันที่เวลา และ สาขา */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* คอลัมน์ซ้าย: วันที่และเวลาที่เกิดเหตุ */}
                    <div className="flex flex-col h-full">
                      <Label className="text-sm font-semibold text-foreground block mb-0">
                        วันที่และเวลาที่เกิดเหตุ (Date and Time of Incident){' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="grid gap-4 md:grid-cols-2 mt-3">
                        <div className="flex flex-col">
                          <ThaiDatePicker
                            name="incidentDate"
                            value={data.incidentDate}
                            onChange={(value) => handleDateChange('incidentDate', value)}
                            error={Boolean(errors?.incidentDate)}
                          />
                        </div>
                        <div className="flex flex-col">
                          <TimeSelect
                            name="incidentTime"
                            value={data.incidentTime}
                            onChange={(value) => handleDateChange('incidentTime', value)}
                            error={Boolean(errors?.incidentTime)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* คอลัมน์ขวา: สาขา (Branch Location) */}
                    <div className="flex flex-col h-full">
                      <Label className="text-sm font-semibold text-foreground block mb-0">
                        สาขาที่เกิดเหตุ (Branch Location){' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="mt-3 flex flex-col">
                        <select
                          name="organizationId"
                          value={data.organizationId}
                          onChange={handleChange}
                          required={true}
                          className={cn(
                            'w-full h-13 rounded-lg bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border',
                            errors?.organizationId
                              ? 'border-[#FF4D00] bg-[#FF4D00]/10 text-foreground'
                              : 'border-border text-foreground'
                          )}
                        >
                          <option value="">-- กรุณาเลือกสาขา (Select Branch) --</option>
                          {organizationList.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="min-h-6 mt-1">
                          <FieldError msg={errors?.organizationId} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* แถวที่ 2: พยาน */}
                  <div className="rounded-xl border border-border bg-slate-50 dark:bg-(--surface-muted) p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <Label className="text-sm font-semibold text-foreground">
                          มีพยานหรือไม่? (Are there witnesses?)
                          <span className="text-destructive">*</span>
                        </Label>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-sm">
                          ระบุได้หากมีผู้เห็นเหตุการณ์หรือผู้เกี่ยวข้องเพิ่มเติม
                        </p>
                      </div>

                      <RadioGroup
                        className="flex items-center gap-6 shrink-0 p-2"
                        value={data.hasWitness ? 'true' : 'false'}
                        onValueChange={(v) => {
                          const hasW = v === 'true'
                          setData('hasWitness', hasW)
                          clearValidationErrors('hasWitness')
                          if (!hasW) {
                            setData('witnesses', [])
                            clearValidationErrors('witnesses')
                          } else {
                            clearValidationErrors('witnesses')
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="true" id="witness_yes" />
                          <Label
                            htmlFor="witness_yes"
                            className="text-sm font-medium cursor-pointer text-[#002856] border-slate-300 hover:border-[#D29E0E] data-[state=checked]:border-[#002856] hover:data-[state=checked]:border-[#D29E0E]"
                          >
                            มี{' '}
                            <span className="text-muted-foreground font-normal ml-0.5">(Yes)</span>
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="false" id="witness_no" />
                          <Label
                            htmlFor="witness_no"
                            className="text-sm font-medium cursor-pointer text-[#002856] border-slate-300 hover:border-[#D29E0E] data-[state=checked]:border-[#002856] hover:data-[state=checked]:border-[#D29E0E]"
                          >
                            ไม่มี{' '}
                            <span className="text-muted-foreground font-normal ml-0.5">(No)</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div
                      className={cn(
                        'grid transition-all duration-300 ease-in-out',
                        data.hasWitness
                          ? 'grid-rows-[1fr] opacity-100 mt-5 pt-5 border-t border-border'
                          : 'grid-rows-[0fr] opacity-0 mt-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="mb-3 text-sm font-medium text-foreground">
                          รายชื่อพยาน{' '}
                          <span className="text-xs text-muted-foreground ml-1">(Witness List)</span>
                        </div>
                        <div className="space-y-3 pb-1 px-1">
                          {data.witnesses?.map(
                            (witness: { name: string; phone: string }, index: any) => (
                              <div
                                key={index}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
                              >
                                <Input
                                  name="witness_name"
                                  maxLength={30}
                                  className={cn(
                                    // โครงสร้างหลัก
                                    'flex-1 rounded-lg transition-all outline-none',
                                    'border-[#D6D7D9] bg-white text-[#002856]',
                                    'hover:border-[#D29E0E]',
                                    'focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]',
                                    'disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]',

                                    // เงื่อนไข Error ของ ชื่อพยาน (Name)
                                    hasValidationError(`witnesses.${index}.name`)
                                      ? 'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]'
                                      : ''
                                  )}
                                  value={witness.name ?? ''}
                                  onChange={(e) => {
                                    const updated = [...data.witnesses!]
                                    updated[index] = { ...updated[index], name: e.target.value }
                                    setData('witnesses', updated)
                                    clearValidationErrors(`witnesses.${index}.name`)
                                  }}
                                  placeholder="ชื่อ-นามสกุล (Name)"
                                />
                                <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                                  <Input
                                    name="witness_phone"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    className={cn(
                                      // โครงสร้างหลัก
                                      'w-full rounded-lg transition-all outline-none',
                                      'border-[#D6D7D9] bg-white text-[#002856]',
                                      'hover:border-[#D29E0E]',
                                      'focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]',
                                      'disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]',

                                      // เงื่อนไข Error ของ เบอร์โทรศัพท์พยาน (Phone)
                                      hasValidationError(`witnesses.${index}.phone`)
                                        ? 'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]'
                                        : ''
                                    )}
                                    value={witness.phone ?? ''}
                                    onChange={(e) => {
                                      const updated = [...data.witnesses!]
                                      updated[index] = {
                                        ...updated[index],
                                        phone: e.target.value.replace(/\D/g, ''),
                                      }
                                      setData('witnesses', updated)
                                      clearValidationErrors(`witnesses.${index}.phone`)
                                    }}
                                    placeholder="เบอร์โทรศัพท์ (Phone)"
                                  />
                                  {index === 0 ? (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="shrink-0 w-10 sm:w-24 bg-[#D29E0E] text-white hover:bg-[#002856]/90 hover:text-white"
                                      onClick={() => {
                                        setData('witnesses', [
                                          ...(data.witnesses || []),
                                          { name: '', phone: '' },
                                        ])
                                        clearValidationErrors('witnesses')
                                      }}
                                    >
                                      <Plus className="h-4 w-4 sm:mr-2" />
                                      <span className="hidden sm:inline">เพิ่ม</span>
                                    </Button>
                                  ) : (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className="shrink-0 w-10 sm:w-24 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                      onClick={() => {
                                        setData(
                                          'witnesses',
                                          data.witnesses!.filter((_: any, i: number) => i !== index)
                                        )
                                        clearValidationErrors('witnesses')
                                      }}
                                    >
                                      <X className="h-4 w-4 sm:mr-2" />
                                      <span className="hidden sm:inline">ลบ</span>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* แถวที่ 3: รายละเอียดเพิ่มเติม */}
                  <div>
                    <Label className="text-sm font-semibold text-foreground block mb-0">
                      รายละเอียดเพิ่มเติม (Additional Information)
                    </Label>

                    <Textarea
                      className="mt-2 min-h-30 resize-y rounded-xl bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      maxLength={3000}
                      placeholder="กรุณาระบุรายละเอียดเหตุการณ์ เช่น ลำดับเหตุการณ์ บุคคลที่เกี่ยวข้อง สถานที่ หรือข้อมูลอื่น ๆ ที่เป็นประโยชน์"
                      value={data.detail ?? ''}
                      name="detail"
                      onChange={handleChange}
                    />
                    <div className="mt-2 flex items-center justify-end">
                      <span
                        className={cn(
                          'text-xs font-medium',
                          data.detail?.length === 0 ? 'text-muted-foreground/60' : 'text-primary/70'
                        )}
                      >
                        {data.detail?.length} / 3000
                      </span>
                    </div>
                  </div>

                  {/* --- questions --- */}
                  {form.questions.map((question: any) => {
                    const inputName = `answers_${question.id}`
                    return (
                      <div key={inputName}>
                        <Label className="text-sm font-semibold text-foreground block mb-0">
                          {question.title} ({question.hint})
                        </Label>

                        {question.type === 'string' ? (
                          <Input
                            type="text"
                            name={inputName}
                            className={cn(
                              'w-full rounded-lg transition-all outline-none',
                              'border-[#D6D7D9] bg-white text-[#002856]',
                              'hover:border-[#D29E0E]',
                              'focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]',
                              'disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]',
                              hasValidationError(inputName)
                                ? 'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]'
                                : ''
                            )}
                            maxLength={100}
                            placeholder={`กรุณาระบุ${question.title}`}
                            value={data.answers[question.id] ?? ''}
                            onChange={(e) => {
                              const updated = [...data.answers!]
                              updated[question.id] = e.target.value
                              setData('answers', updated)
                              setDynamicField(`answers_${question.id}`, e.target.value)
                              clearValidationErrors(inputName)
                            }}
                          />
                        ) : question.type === 'text' ? (
                          <Textarea
                            name={inputName}
                            className={cn(
                              'w-full rounded-lg transition-all outline-none',
                              'border-[#D6D7D9] bg-white text-[#002856]',
                              'hover:border-[#D29E0E]',
                              'focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]',
                              'disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]',
                              hasValidationError(inputName)
                                ? 'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]'
                                : ''
                            )}
                            maxLength={100}
                            placeholder={`กรุณาระบุ${question.title}`}
                            value={data.answers[question.id] ?? ''}
                            onChange={(e) => {
                              const updated = [...data.answers!]
                              updated[question.id] = e.target.value
                              setData('answers', updated)
                              setDynamicField(`answers_${question.id}`, e.target.value)
                              clearValidationErrors(inputName)
                            }}
                          />
                        ) : question.type === 'date' ? (
                          <ThaiDatePicker
                            name={inputName}
                            value={data.answers[question.id] ?? ''}
                            onChange={(value) => handleAnswerDateChange(question.id, value)}
                            error={hasValidationError(inputName)}
                          />
                        ) : question.type === 'datetime' ? (
                          <div className="grid gap-4 md:grid-cols-2">
                            <ThaiDatePicker
                              name={inputName}
                              value={data.answers[question.id] ?? ''}
                              onChange={(value) => handleAnswerDateChange(question.id, value)}
                              error={hasValidationError(inputName)}
                            />
                            <TimeSelect
                              name={`${inputName}Time`}
                              value={getAnswerTime(question.id)}
                              onChange={(value) => handleAnswerTimeChange(question.id, value)}
                              error={hasValidationError(inputName)}
                              disabled={!data.answers[question.id]}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    )
                  })}

                  <hr className="border-border" />

                  {/* --- ฟังก์ชั่นแนบไฟล์ --- */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-[#002856]">
                      แนบหลักฐานหรือเอกสารประกอบ (ถ้ามี) (Attach Supporting Files, if any)
                    </h3>
                    <label
                      onDragOver={(e) => {
                        e.preventDefault()
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        addFiles(e.dataTransfer.files)
                      }}
                      className={cn(
                        'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 text-center transition',
                        'border-border bg-(--surface-muted) hover:border-primary/40'
                      )}
                    >
                      <Upload className="h-7 w-7 text-muted-foreground" />
                      <div className="mt-3 text-sm font-medium">
                        ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือก
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        Drag and drop files here, or click to select
                      </div>
                      <div className="mt-2 text-xs text-[#002856]">
                        รองรับ PDF, DOCX, XLS, XLSX, PNG, JPG, MP4, MOV, MP3, WAV, FLAC, AAC, ALAC,
                        M4A
                        <br />
                        ไฟล์ขนาดไม่เกิน 1 GB
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {uploading ? 'กำลังอัปโหลดไฟล์...' : 'เลือกไฟล์เพื่ออัปโหลดทันทีหลังเลือก'}
                      </div>
                      {uploadError && (
                        <div role="alert" className="mt-2 text-xs font-medium text-destructive">
                          {uploadError}
                        </div>
                      )}
                      <input
                        type="file"
                        // multiple
                        accept=".pdf,.docx,.doc,.xls,.xlsx,.png,.jpg,.jpeg,.mp4,.mov,.mp3,.wav,.flac,.aac,.alac,.m4a,video/mp4,video/quicktime,audio/*"
                        className="hidden"
                        onChange={(e) => addFiles(e.target.files)}
                      />
                    </label>
                    {data.files.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {data.files.map((file: File | string, index: number) => {
                          const fileName =
                            typeof file === 'string' ? (file.split('/').pop() ?? file) : file.name
                          const fileSize =
                            typeof file === 'string' ? null : Math.round(file.size / 1024)
                          return (
                            <li
                              key={`${fileName}-${index}`}
                              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <CheckCircle className="h-4 w-4 flex-none text-green-500" />
                                <FileText className="h-4 w-4 flex-none text-primary" />
                                <span>{fileName.substring(fileName.indexOf('-') + 1)}</span>
                                {fileSize !== null && (
                                  <span className="text-xs text-muted-foreground">
                                    ({fileSize} KB)
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  typeof file === 'string'
                                    ? removeFile(file)
                                    : setData(
                                        'files',
                                        data.files.filter(
                                          (_: any, itemIndex: number) => itemIndex !== index
                                        )
                                      )
                                }
                                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                                aria-label="ลบไฟล์"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                {/* --- ปุ่ม ถัดไป / ย้อนกลับ --- */}
                <div className="mt-10 flex flex-col-reverse justify-between gap-4 pt-6 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full px-8 sm:w-auto"
                    onClick={() => openStep(1)}
                    disabled={uploading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> ย้อนกลับ
                  </Button>

                  <Button
                    type="button"
                    className="h-11 w-full bg-[#D29E0E] px-8 text-white hover:bg-[#002856] disabled:bg-[#B8BBBF] sm:w-auto"
                    onClick={() => handleNextStep(2)}
                    disabled={uploading}
                  >
                    ถัดไป <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ==========================================
                STEP 3: ข้อมูลผู้ร้องเรียน
            ========================================== */}
            {currentStep === 3 && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
                <h2 className="mb-6 border-b pb-4 text-lg font-bold text-[#002856]">
                  ข้อมูลผู้ร้องเรียน (Reporter Information)
                </h2>

                <div className="space-y-4">
                  <label className="group flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-slate-50 dark:bg-(--surface-muted) p-4 transition-colors hover:border-primary/40">
                    <div className="flex items-center gap-3">
                      {/* 1. เพิ่ม shrink-0 เพื่อไม่ให้กลายเป็นวงรีบนมือถือ */}
                      {/* 2. นำ mt-0.5 ออก และเพิ่ม flex items-center justify-center เพื่อให้รูปอยู่ตรงกลางวงกลมเป๊ะๆ */}
                      <div className="flex shrink-0 items-center justify-center rounded-full border border-border bg-[#D29E0E] p-1.5 text-slate-700 shadow-sm">
                        <img
                          src="/assets/images/anonymous.svg"
                          alt="Anonymous Icon"
                          // 3. เอา bg กับ rounded ออกจาก img เพราะตัวกรอบ (div ด้านบน) จัดการให้หมดแล้ว
                          className="h-4 w-4 object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          ไม่เปิดเผยตัวตน (Anonymous)
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          หากเปิดใช้งาน ระบบจะข้ามการกรอกข้อมูลส่วนตัวทั้งหมดทันที
                        </div>
                      </div>
                    </div>
                    <Switch
                      className="mt-1 data-[state=checked]:bg-[#002856] hover:data-[state=checked]:bg-[#D29E0E] hover:data-[state=unchecked]:bg-[#898F98]"
                      checked={data.isAnonymous}
                      onCheckedChange={(v: any) => {
                        setData('isAnonymous', v)
                        clearValidationErrors('isAnonymous')
                        if (v) {
                          setData('complainantFullName', '')
                          setData('complainantEmail', '')
                          setData('complainantTelephone', '')
                          clearValidationErrors(
                            'complainantFullName',
                            'complainantEmail',
                            'complainantTelephone'
                          )
                        }
                      }}
                    />
                  </label>

                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {!data.isAnonymous && (
                      <>
                        <FieldGroup
                          label="ชื่อ-นามสกุล (Full Name)"
                          required
                          full
                          error={errors?.complainantFullName}
                        >
                          <Input
                            name="complainantFullName"
                            maxLength={30}
                            className={cn(
                              'flex-1 rounded-lg transition-all outline-none',
                              // สถานะปกติ: กรอบเทา พื้นขาว ข้อความตอนพิมพ์สีน้ำเงิน และ Placeholder สีเทา #D6D7D9
                              'border-[#D6D7D9] bg-white text-[#002856]',
                              'hover:border-[#D29E0E]',
                              'focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]',
                              'disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]',
                              // สถานะ Error
                              errors?.complainantFullName &&
                                'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]'
                            )}
                            value={data.complainantFullName ?? ''}
                            onChange={handleChange}
                            placeholder="ระบุชื่อ-สกุล"
                          />
                        </FieldGroup>

                        <FieldGroup
                          label="อีเมล (Email Address)"
                          required
                          error={errors?.complainantEmail}
                        >
                          <Input
                            name="complainantEmail"
                            maxLength={100}
                            type="email"
                            className={cn(
                              'flex-1 rounded-lg transition-all outline-none',
                              // สถานะปกติ: กรอบเทา พื้นขาว ข้อความตอนพิมพ์สีน้ำเงิน และ Placeholder สีเทา #D6D7D9
                              'border-[#D6D7D9] bg-white text-[#002856]',
                              'hover:border-[#D29E0E]',
                              'focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]',
                              'disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]',
                              // สถานะ Error
                              errors?.complainantEmail &&
                                'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]'
                            )}
                            value={data.complainantEmail ?? ''}
                            onChange={handleChange}
                            placeholder="ระบุอีเมล"
                            autoComplete="email"
                          />
                        </FieldGroup>

                        <FieldGroup
                          label="เบอร์โทรศัพท์ (Phone Number)"
                          error={errors?.complainantTelephone}
                          required
                        >
                          <Input
                            name="complainantTelephone"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            className={cn(
                              'flex-1 rounded-lg transition-all outline-none',
                              'border-[#D6D7D9] bg-white text-[#002856]',
                              'hover:border-[#D29E0E]',
                              'focus-visible:border-[#002856] focus-visible:ring-1 focus-visible:ring-[#002856]',
                              'disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#898F98] disabled:border-[#D6D7D9]',
                              errors?.complainantTelephone &&
                                'border-[#FF4D00] bg-[#FF4D00]/10 text-[#FF4D00] hover:border-[#FF4D00] focus-visible:border-[#FF4D00] focus-visible:ring-[#FF4D00]'
                            )}
                            value={data.complainantTelephone ?? ''}
                            onChange={(e) => {
                              setData('complainantTelephone', e.target.value.replace(/\D/g, ''))
                              clearValidationErrors('complainantTelephone')
                            }}
                            placeholder="ระบุเบอร์โทรศัพท์"
                          />
                        </FieldGroup>
                      </>
                    )}
                  </div>
                </div>

                {/* --- ปุ่ม ถัดไป / ย้อนกลับ --- */}
                <div className="mt-10 flex flex-col-reverse justify-between gap-4 pt-6 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full px-8 sm:w-auto"
                    onClick={() => openStep(2)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> ย้อนกลับ
                  </Button>

                  <Button
                    type="button"
                    className="h-11 w-full bg-[#D29E0E] px-8 text-white hover:bg-[#002856] disabled:bg-[#B8BBBF] sm:w-auto"
                    onClick={() => handleNextStep(3)}
                  >
                    ถัดไป <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ==========================================
                STEP 4: ตรวจสอบและยืนยันข้อมูล
            ========================================== */}
            {currentStep === 4 && (
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
                {/* หัวข้อหลัก */}
                <div className="mb-6 border-b border-border pb-4">
                  <h2 className="text-xl font-bold text-[#002856]">
                    ตรวจสอบและยืนยันข้อมูล (Review & Confirmation){' '}
                    <span className="text-destructive">*</span>
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    กรุณาตรวจสอบความถูกต้องของข้อมูลแจ้งเรื่อง
                    และยืนยันว่าข้อมูลดังกล่าวเป็นความจริงและถูกต้องครบถ้วน
                  </p>
                </div>

                {/* กล่องสีฟ้าตามดีไซน์ (ใช้สีเทา 50 เป็นกรอบ) */}
                <div className="rounded-xl border border-[#D6D7D9] p-6 md:p-8">
                  <h3 className="mb-4 text-base font-bold text-[#002856]">
                    การยืนยัน (Confirmation) <span className="text-destructive">*</span>
                  </h3>

                  {/* กล่องสรุปข้อมูลสีเทาอ่อน (System BG) */}
                  <div className="mb-6 rounded-xl border border-slate-200 bg-[#F9FAFB] p-6 text-sm text-slate-700 leading-relaxed">
                    <div className="flex flex-col gap-3">
                      <div>
                        <span className="font-bold text-[#002856]">หัวข้อ : </span>
                        {reviewValue(model.title)}
                      </div>
                      <div>
                        <span className="font-bold text-[#002856]">หมวดหมู่การแจ้งเรื่อง : </span>
                        {reviewValue(model.FormCategory?.title)}{' '}
                        {model.FormSubject ? `> ${model.FormSubject.title}` : ''}{' '}
                        {model.formSubjectOther ? `(${model.formSubjectOther})` : ''}
                      </div>
                      <div>
                        <span className="font-bold text-[#002856]">สาขาที่เกิดเหตุ : </span>
                        {
                          organizationList.find((e: any) => e.value === Number(data.organizationId))
                            ?.label
                        }
                      </div>
                      <div>
                        <span className="font-bold text-[#002856]">
                          วันที่และเวลาที่เกิดเหตุ :{' '}
                        </span>
                        วันที่ {formatReviewDate(data.incidentDate)} เวลา{' '}
                        {reviewValue(data.incidentTime)} น.
                      </div>
                      <div>
                        <span className="font-bold text-[#002856]">พยาน : </span>
                        {data.hasWitness ? `มี (${data.witnesses?.length || 0} คน)` : 'ไม่มี'}
                      </div>
                      {data.hasWitness &&
                        data.witnesses?.map((witness: any, index: number) => (
                          <div key={index} className="pl-4">
                            <span className="font-bold text-[#002856]">
                              พยานคนที่ {index + 1} :{' '}
                            </span>
                            {reviewValue(witness.name)} / {reviewValue(witness.phone)}
                          </div>
                        ))}
                      <div>
                        <span className="font-bold text-[#002856]">รายละเอียดเหตุการณ์ : </span>
                        <span className="whitespace-pre-wrap">{reviewValue(data.detail)}</span>
                      </div>
                      {form.questions.map((question: any) => (
                        <div key={question.id}>
                          <span className="font-bold text-[#002856]">{question.title} : </span>
                          {question.type === 'date' || question.type === 'datetime'
                            ? formatReviewDate(data.answers?.[question.id])
                            : reviewValue(data.answers?.[question.id])}
                          {question.type === 'datetime' && data.answers?.[question.id]
                            ? ` เวลา ${getAnswerTime(question.id) ?? '-'} น.`
                            : ''}
                        </div>
                      ))}
                      <div>
                        <span className="font-bold text-[#002856]">จำนวนไฟล์แนบ : </span>
                        {data.files && data.files.length > 0
                          ? `${data.files?.length || 0} ไฟล์`
                          : '-'}
                      </div>
                      {data.files?.map((file: string, index: number) => (
                        <div key={file} className="pl-4">
                          <span className="font-bold text-[#002856]">ไฟล์ที่ {index + 1} : </span>
                          {getFileName(file)}
                        </div>
                      ))}
                      <div>
                        <span className="font-bold text-[#002856]">ข้อมูลผู้ร้องเรียน : </span>
                        {data.isAnonymous
                          ? 'ไม่ประสงค์ออกนาม'
                          : reviewValue(data.complainantFullName)}
                      </div>
                      {!data.isAnonymous && (
                        <>
                          <div>
                            <span className="font-bold text-[#002856]">อีเมล : </span>
                            {reviewValue(data.complainantEmail)}
                          </div>
                          <div>
                            <span className="font-bold text-[#002856]">เบอร์โทรศัพท์ : </span>
                            {reviewValue(data.complainantTelephone)}
                          </div>
                        </>
                      )}
                      <div>
                        <span className="font-bold text-[#002856]">
                          วันที่และเวลาที่ร้องเรียน :{' '}
                        </span>
                        วันที่ {new Date().toLocaleDateString('th-TH')} เวลา{' '}
                        {new Date().toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        น.
                      </div>
                    </div>
                  </div>

                  {/* Checkbox ยืนยัน */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      className="mt-0.5 border-slate-400 data-[state=checked]:bg-[#002856] hover:border-[#D29E0E] data-[state=checked]:border-[#002856]"
                      checked={data.confirm}
                      onCheckedChange={(v) => {
                        setData('confirm', v === true)
                        clearValidationErrors('confirm')
                      }}
                    />
                    <div className="text-sm">
                      ข้าพเจ้ายืนยันว่า{' '}
                      <span className="font-bold text-black">ข้อมูลที่ให้เป็นความจริง</span>{' '}
                      และส่งด้วยเจตนาสุจริต
                    </div>
                  </label>

                  {/* Error Message */}
                  {!data.confirm && (
                    <div className="mt-2 ml-7 flex items-center gap-1.5 text-xs text-[#FF4D00] font-medium">
                      <AlertCircle className="h-3.5 w-3.5" /> กรุณายืนยันความถูกต้องของข้อมูล
                    </div>
                  )}

                  {/* ปุ่ม Submit */}
                  <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full px-8 sm:w-auto"
                      onClick={() => openStep(3)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปแก้ไข
                    </Button>

                    <Button
                      type="submit"
                      disabled={processing || !data.confirm}
                      className="w-full h-11 bg-[#D29E0E] px-8 text-white hover:bg-[#002856] disabled:bg-[#B8BBBF] sm:w-auto"
                    >
                      {processing ? 'กำลังส่ง...' : 'ส่งเรื่องร้องเรียน'}{' '}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </PageContainer>
  )
}
