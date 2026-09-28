import { CheckCircle2, Copy } from 'lucide-react'
import { PageContainer } from '~/components/page_container'
import MainLayout from '~/components/main_layout'
import { toast } from 'sonner'
import { Link } from '@adonisjs/inertia/react'

type ComplaintThankProps = {
  model: any
}

export default function ComplaintThank({ model }: ComplaintThankProps) {
  function saveTextAsImage(text: string) {
    // 1. Create a hidden canvas element
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 2. Set dimensions and background
    canvas.width = 400
    canvas.height = 100
    ctx.fillStyle = '#ffffff' // White background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 3. Configure text styles and draw text
    ctx.fillStyle = '#000000' // Black text color
    ctx.font = '30px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Render the text in the center of the canvas
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    // 4. Convert canvas content to a Data URL
    const dataUrl = canvas.toDataURL('image/png')

    // 5. Create a temporary anchor element to trigger the download
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'complaint-code.png'

    // 6. Programmatically trigger click event
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('ดาวน์โหลดแล้ว')
  }
  return (
    <PageContainer>
      <section className="min-h-[80vh] py-16 flex flex-col items-center justify-center">
        <MainLayout narrow>
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8 animate-[fadeIn_0.3s_ease-out_both]">
            {/* ไอคอน Check วงกลมสีเขียวอ่อน */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#09A129]/10 text-[#09A129] shadow-sm md:h-20 md:w-20">
              <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10" />
            </div>

            {/* หัวข้อหลัก */}
            <h1 className="mt-6 text-center font-display text-2xl font-bold text-[#002856] md:text-3xl">
              ระบบได้รับเรื่องของท่านเรียบร้อยแล้ว
            </h1>

            {/* คำอธิบาย */}
            <p className="mt-3 text-center text-sm text-[#002856] md:text-base">
              เจ้าหน้าที่จะดำเนินการตามนโยบายคุ้มครองผู้แจ้งเบาะแส
            </p>

            {/* การ์ดแสดงหมายเลขอ้างอิง (กล่องสีขาว) */}
            <div className="mx-auto mt-8 w-full max-w-[600px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="text-xs font-bold text-center tracking-wide text-[#002856] md:text-sm">
                หมายเลขอ้างอิง / Reference Number
              </div>

              {/* ตัวเลขหมายเลขอ้างอิง (ขยายให้ใหญ่และหนาขึ้น) */}
              <div className="mt-4 font-display text-center text-3xl font-black tracking-wider text-[#002856] md:text-4xl">
                {model.code}
              </div>

              {/* กลุ่มปุ่ม คัดลอก / บันทึกภาพ แบบ Responsive */}
              <div className="mt-6 flex w-full flex-row gap-3 sm:justify-center">
                <button
                  type="button"
                  className="flex h-11 flex-1 sm:flex-none sm:w-28 items-center justify-center gap-2 rounded-lg border border-[#D29E0E] bg-white text-sm font-medium text-[#002856] transition-colors hover:bg-slate-50"
                  onClick={() => {
                    navigator.clipboard.writeText(model.code)
                    toast.success('คัดลอกแล้ว')
                  }}
                >
                  <Copy className="h-4 w-4 text-slate-500" /> คัดลอก
                </button>
                <button
                  type="button"
                  className="flex h-11 flex-1 sm:flex-none sm:w-32 items-center justify-center gap-2 rounded-lg border border-[#D29E0E] bg-white text-sm font-medium text-[#002856] transition-colors hover:bg-slate-50"
                  onClick={() => {
                    saveTextAsImage(model.code)
                    navigator.clipboard.writeText(model.code)
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-500"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  บันทึกภาพ
                </button>
              </div>

              {/* ข้อความแจ้งเตือนสีส้ม */}
              <div className="mt-6 space-y-1 items-center justify-center text-center">
                <p className="text-xs font-medium text-[#FF4D00] md:text-sm">
                  โปรดเก็บหมายเลขนี้ไว้สำหรับติดตามสถานะ
                </p>
                <p className="text-[11px] text-[#FF4D00] md:text-xs">
                  Please keep this number for status tracking.
                </p>
              </div>
            </div>

            {/* ปุ่มกลับหน้าแรก (ปุ่มสีทอง) */}
            <div className="mt-8 flex w-full justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow py-2 h-12 w-auto px-8 sm:w-auto sm:px-12 rounded-lg bg-[#D29E0E] text-base font-medium text-white hover:bg-[#002856] disabled:bg-[#B8BBBF]"
              >
                กลับสู่หน้าแรก
              </Link>
            </div>
          </div>
        </MainLayout>
      </section>
    </PageContainer>
  )
}
