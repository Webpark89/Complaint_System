import { ArrowLeft, Shield } from 'lucide-react'
import { useEffect } from 'react'

export default function Login() {
  useEffect(() => {
    if (window.top && window.top !== window.self) {
      window.top.location.href = window.self.location.href
    }
  }, [])

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Left Form Panel */}
      <div
        className="relative hidden overflow-hidden bg-primary bg-cover bg-center md:flex md:flex-col md:justify-between md:p-12 text-primary-foreground"
        style={{ backgroundImage: "url('/assets/images/logo-smo-2.svg')" }}
      >
        <div className="absolute inset-0 opacity-[0.07] auth-hero-grid" />
        <a href="/" className="relative inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 backdrop-blur">
            {/* @svg('lucide:shield', { className: 'h-5 w-5' }) */}
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display font-bold">บริษัท กลุ่มสมอทอง จำกัด (มหาชน)</div>
            <div className="text-[10px] tracking-[0.12em] opacity-70">ระบบรับเรื่องร้องเรียน</div>
          </div>
        </a>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight">
            ระบบจัดการเรื่องร้องเรียนออนไลน์
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            เข้าสู่ระบบเพื่อจัดการเรื่องร้องเรียน ตรวจสอบรายงาน และติดตามผลการดำเนินการขององค์กร
          </p>
        </div>
        <div className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} บริษัท กลุ่มสมอทอง จำกัด (มหาชน)
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-col justify-center p-6 md:p-12">
        <div className="mx-auto w-full max-w-md">
          <a
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground md:hidden"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            ย้อนกลับ
          </a>

          <h1 className="mt-4 font-display text-3xl font-bold md:mt-0">ยินดีต้อนรับ</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            จัดการและตรวจสอบเรื่องร้องเรียนที่ได้รับมอบหมายให้กับทีมของท่าน
          </p>

          <div className="mt-5" id="sign-in-google-box">
            <form id="form-auth" action="/oauth/google/redirect">
              <button
                type="submit"
                // href="/oauth/google/redirect"
                className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full flex items-center justify-center gap-2 cursor-pointer"
              >
                <img src="/assets/images/google.svg" alt="Google" className="h-5 w-5" />
                Login with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
