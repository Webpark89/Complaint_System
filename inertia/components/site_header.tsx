// import { Link, useNavigate } from "@tanstack/react-router";
import { Phone, Mail } from 'lucide-react'
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/hooks/useAuth";
// import { useI18n } from "@/i18n/i18n";
import logoSmo1 from '/public/assets/images/logo-smo-1.png'
import { Link } from '@adonisjs/inertia/react'

export function SiteHeader() {
  // const { user, roles, signOut } = useAuth()
  // const { t } = useI18n()
  // const navigate = useNavigate()
  // const isAdmin = roles.includes('super-admin')

  return (
    <header className="w-full border-b border-border bg-white shadow-md">
      <div className="container relative mx-auto flex h-14 items-center justify-between px-4 bg-white">
        <Link href="/" className="flex items-center gap-3">
          <img src={logoSmo1} alt="SMO Logo" className="h-5 w-auto object-contain md:h-8" />
        </Link>

        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-1">
          <NavItem to="/">หน้าแรก</NavItem>

          <NavItem to="/complaint">แจ้งเรื่องร้องเรียน</NavItem>
          <NavItem to="/tracking">ติดตามสถานะ</NavItem>
          {/* {user && (
            <NavItem to="/process/dashboard">{t("nav.dashboard")}</NavItem>
          )} */}
        </nav>

        {/* ส่วนปุ่ม Action (ขวา) */}
        {/* <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden items-center gap-3 pr-2 md:flex">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-primary-foreground">
                    {(user.user_metadata?.full_name || user.email || "")
                      .split(" ")
                      .map((s: string) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">
                      สวัสดี, {user.user_metadata?.full_name ?? user.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="mr-1.5 h-4 w-4" /> {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="bg-accent text-white hover:bg-primary"
              onClick={() => navigate({ to: "/auth" })}
            >
              <LogIn className="mr-1.5 h-4 w-4" /> {t("nav.signIn")}
            </Button>
          )}
        </div> */}
        {/* Utility bar — light */}

        <div className="container mx-auto flex h-7 items-center justify-end px-4 text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Phone className="h-3 w-3" /> โทร XXX-XXXXXX-X
              {/* 077-951470-4 */}
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Mail className="h-3 w-3" /> XXXXX
              {/* compliance@smo.co.th */}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      href={to}
      className="relative inline-flex items-center justify-center text-center rounded-full px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-white"

      // activeOptions={{ exact: to === '/' }}
    >
      {children}
    </Link>
  )
}
