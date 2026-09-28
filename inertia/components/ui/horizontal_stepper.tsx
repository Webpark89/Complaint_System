import { Check, FileText, ShieldCheck, SquarePen, User } from 'lucide-react'
import { cn } from '~/lib/utils'

const HorizontalStepper = ({
  currentStep,
  maxVisibleStep,
  onStepClick,
}: {
  currentStep: number
  maxVisibleStep: number
  onStepClick: (step: number) => void
}) => {
  const STEPS = [
    { id: 1, labelTh: 'หมวดหมู่และประเด็น', labelEn: '(Category & Related Issue)', icon: FileText },
    {
      id: 2,
      labelTh: 'รายละเอียดเหตุการณ์',
      labelEn: '(Incident Information & Details)',
      icon: SquarePen,
    },
    { id: 3, labelTh: 'ข้อมูลผู้ร้องเรียน', labelEn: '(Reporter Information)', icon: User },
    {
      id: 4,
      labelTh: 'ตรวจสอบและยืนยันข้อมูล',
      labelEn: '(Review & Confirmation)',
      icon: ShieldCheck,
    },
  ]

  return (
    // เปลี่ยนพื้นหลังเป็นสี #D6D7D9 และปรับ Padding
    <div className="mb-8 rounded-2xl bg-[#F9FAFB] px-2 py-8 sm:px-5 shadow-sm">
      <div className="relative z-0 flex w-full justify-between items-start">
        {/* เส้นเชื่อม (Connector Line) */}
        <div className="absolute top-[42px] md:top-14 left-[12.5%] right-[12.5%] h-[5px] -translate-y-1/2 z-0 pointer-events-none">
          {/* เส้นสีเทา (Inactive) */}
          <div className="absolute inset-0 w-full h-full bg-slate-300" />
          {/* เส้นสีเขียว (Active/Completed) */}
          <div
            className="absolute left-0 top-0 h-full bg-[#09A129] transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((step) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          const isClickable = step.id <= maxVisibleStep

          return (
            <div
              key={step.id}
              className={cn(
                'relative z-10 flex flex-col items-center flex-1',
                isClickable ? 'cursor-pointer' : 'cursor-default'
              )}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              {/* ข้อความ "ขั้นตอนที่ x" ด้านบนสุด */}
              <div
                className={cn(
                  'mb-2 text-[10px] md:text-sm font-bold transition-colors',
                  isActive || isCompleted ? 'text-slate-700' : 'text-slate-500'
                )}
              >
                ขั้นตอนที่ {step.id}
              </div>

              {/* วงกลม Icon */}
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[2px] transition-colors duration-300 md:h-14 md:w-14 md:border-[3px]',
                  isCompleted || isActive
                    ? 'border-[#09A129] bg-[#09A129] text-white'
                    : 'border-slate-400 bg-white text-slate-400'
                )}
              >
                {/* เพิ่มเงื่อนไขตรงนี้: ถ้าเสร็จแล้วให้แสดง Check ถ้ายังให้แสดง Icon ประจำ Step */}
                {isCompleted ? (
                  <Check className="h-5 w-5 md:h-7 md:w-7" strokeWidth={3} />
                ) : (
                  <step.icon className="h-5 w-5 md:h-7 md:w-7" />
                )}
              </div>

              {/* ข้อความกำกับด้านล่าง */}
              <div className="mt-3 flex flex-col items-center w-full px-1">
                <div className="text-center">
                  <div
                    className={cn(
                      'text-[9px] sm:text-[10px] md:text-xs font-bold leading-tight',
                      isActive || isCompleted ? 'text-slate-800' : 'text-slate-500'
                    )}
                  >
                    {step.labelTh}
                  </div>
                  <div className="text-[8px] md:text-[10px] font-medium opacity-70 mt-0.5 text-slate-600 leading-tight">
                    {step.labelEn}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { HorizontalStepper }
