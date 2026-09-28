import { type ReactNode } from 'react'
import { usePage } from '@inertiajs/react'
import { Sidebar } from './sidebar'
import {
  Bell,
  LayoutDashboard,
  ShieldCheck,
  Search,
  Users,
  ClipboardList,
  Layers,
  Layers3,
  Image as ImageIcon,
  FilePlus,
  FileText,
  FileSearch,
  CheckCircle,
  Clock3,
  ShieldAlert,
  FolderOpen,
  BarChart3,
  Timer,
  BriefcaseBusiness,
  ClipboardCheck,
  GitBranch,
  AlarmClock,
  Building2,
  History,
  LogOut,
} from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'

export function AdminLayout({ children }: { children: ReactNode }) {
  const { props } = usePage<{ user?: { fullName?: string; email?: string }; userRole?: string }>()
  return (
    <div className="h-screen overflow-hidden bg-background font-sans text-[#111827]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white/95 px-6 backdrop-blur">
        <div className="flex items-center gap-5">
          <Link href="/process/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-soft shadow-soft ring-1 ring-[rgba(176,141,87,0.25)]">
              <ShieldCheck className="h-5 w-5 text-[#111827]" />
            </span>
            <div className="leading-tight">
              <div className="text-[15px] font-bold tracking-wide text-[#111827]">
                Complaint Management
              </div>
              {/* <div className="text-[12px] font-medium text-slate-500">ผู้ดูแลระบบ (Admin)</div> */}
            </div>
          </Link>

          <div className="hidden h-5 w-px bg-[rgba(176,141,87,0.25)] sm:block" />

          <div className="hidden flex-col sm:flex">
            <div className="text-[13px] font-semibold text-[#111827]" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-[48px] items-center gap-3 rounded-full border border-border bg-white pl-4 pr-1.5 shadow-soft">
            <div className="flex flex-col justify-center leading-tight">
              <div className="text-[11px] font-bold tracking-wider text-slate-500">
                {props.user?.fullName} ({props.userRole ?? ''})
              </div>
              <div className="text-[11px] text-slate-400">{props.user?.email}</div>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gold-soft text-[#111827]">
              <ShieldCheck className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>
      </header>

      <div className="flex h-full">
        <Sidebar />
        <main
          // ref={mainRef}
          className="min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-8"
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          <div className="mx-auto max-w-375">{children}</div>
          <footer className="mt-10 border-t border-border py-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-medium text-slate-500">
                © {new Date().getFullYear()} Complaint Management
                {/* — ผู้ดูแลระบบ (Admin) */}
              </div>
              <div className="text-xs font-semibold tracking-wide text-slate-400">SMO</div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
