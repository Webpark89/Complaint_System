import {
  AlarmClock,
  BarChart3,
  BookAlert,
  Building2,
  BriefcaseBusiness,
  ChartArea,
  ChartColumnBig,
  ChartPie,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardClock,
  ClipboardList,
  ClipboardMinus,
  Clock3,
  DatabaseBackup,
  FileLock,
  FilePen,
  FilePlus,
  FileSearch,
  FileText,
  FolderOpen,
  History,
  Layers,
  Layers3,
  LayoutDashboard,
  LayoutList,
  LogOut,
  Megaphone,
  ShieldAlert,
  ShieldCheck,
  ShieldLock,
  Timer,
  User,
  Users,
  UserGroup,
  UserKey,
  UsersRound,
} from 'lucide-react'
import type UserModule from '#models/user_module'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { type PageProps } from '@adonisjs/inertia/types'
import { useEffect, useRef, useState } from 'react'

const IconMap = {
  AlarmClock: AlarmClock,
  BarChart3: BarChart3,
  BookAlert: BookAlert,
  Building2: Building2,
  BriefcaseBusiness: BriefcaseBusiness,
  ChartArea: ChartArea,
  ChartColumnBig: ChartColumnBig,
  ChartPie: ChartPie,
  CheckCircle: CheckCircle,
  ClipboardCheck: ClipboardCheck,
  ClipboardClock: ClipboardClock,
  ClipboardList: ClipboardList,
  ClipboardMinus: ClipboardMinus,
  Clock3: Clock3,
  DatabaseBackup,
  FileLock,
  FilePen,
  FilePlus: FilePlus,
  FileSearch: FileSearch,
  FileText: FileText,
  FolderOpen: FolderOpen,
  History: History,
  Layers: Layers,
  Layers3: Layers3,
  LayoutDashboard: LayoutDashboard,
  LayoutList,
  Megaphone: Megaphone,
  ShieldAlert: ShieldAlert,
  ShieldCheck: ShieldCheck,
  ShieldLock,
  Timer: Timer,
  User,
  Users: Users,
  UserGroup,
  UserKey: UserKey,
  UsersRound: UsersRound,
}

export type IconName = keyof typeof IconMap

interface DynamicIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: string
  size?: number
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = IconMap[name as IconName] ?? LayoutDashboard
  return <IconComponent {...props} />
}

export function Sidebar() {
  const { props } = usePage<PageProps>()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    const activeMenu = nav?.querySelector<HTMLElement>('[data-active-menu="true"]')

    if (!nav || !activeMenu) return

    nav.scrollTo({
      top: activeMenu.offsetTop - (nav.clientHeight - activeMenu.offsetHeight) / 2,
      behavior: 'auto',
    })
  }, [props.currentModule])

  return (
    <aside
      className={`hidden h-full shrink-0 overflow-hidden border-r border-border bg-white md:flex flex-col transition-all duration-200 relative ${
        isCollapsed ? 'w-22' : 'w-[320px]'
      }`}
    >
      <span className="flex items-center justify-end px-3 py-3 absolute right-2.5 top-2 z-50">
        <button
          type="button"
          onClick={() => setIsCollapsed((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-slate-600 shadow-sm transition hover:bg-(--surface-muted)"
          aria-label={isCollapsed ? 'เปิดเมนู' : 'ปิดเมนู'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </span>

      <nav ref={navRef} className="flex-1 overflow-auto px-3 py-2 pt-4 pb-14">
        {(props.adminMenu as any[])?.map((p: any) =>
          p !== null ? (
            <div key={p.module}>
              <h3
                className={
                  isCollapsed
                    ? 'hidden'
                    : 'px-6 text-[11px] font-bold tracking-wider text-slate-500'
                }
              >
                {p.title}
              </h3>
              <div className="mt-2 mb-5 space-y-2">
                {p.children.map((item: UserModule) => {
                  const isActive = item.module === props.currentModule
                  return (
                    <Link
                      key={item.module}
                      href={'/process/' + item.url}
                      data-active-menu={isActive || undefined}
                      className={
                        isActive
                          ? `group relative flex items-center rounded-2xl bg-(--gold)/10 px-3 py-3 text-sm font-semibold text-[#111827] shadow-soft ring-1 ring-[rgba(176,141,87,0.35)] ${
                              isCollapsed ? 'justify-center' : 'gap-3 px-4'
                            }`
                          : `group relative flex items-center rounded-2xl bg-white px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-(--surface-muted) hover:text-[#111827] ${
                              isCollapsed ? 'justify-center' : 'gap-3 px-4'
                            }`
                      }
                      onMouseEnter={(e) => {
                        if (!isCollapsed) return
                        const rect = e.currentTarget.getBoundingClientRect()
                        setTooltip({
                          text: item.title,
                          x: rect.right + 8,
                          y: rect.top + rect.height / 2,
                        })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 h-7 w-0.75 -translate-y-1/2 rounded-full bg-gold"
                          aria-hidden
                        />
                      )}
                      <DynamicIcon
                        name={item.icon}
                        key={item.module}
                        className="h-4 w-4 shrink-0"
                      />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                      {(item as any).count !== undefined &&
                        (item as any).count !== null &&
                        (item as any).count > 0 && (
                          <span
                            className={
                              isCollapsed
                                ? 'absolute top-1 right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#b08730] px-1 text-[10px] font-bold text-white shadow-xs'
                                : 'ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b08730] px-1.5 text-[11px] font-bold text-white shadow-xs'
                            }
                          >
                            {(item as any).count}
                          </span>
                        )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ) : null
        )}
      </nav>

      {/* Tooltip rendered outside the nav to avoid overflow clipping */}
      {tooltip && (
        <div
          className="fixed z-9999 pointer-events-none rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateY(-50%)',
          }}
        >
          {tooltip.text}
        </div>
      )}

      <div className="sticky bottom-16 z-10 border-t border-border bg-white p-2">
        <a
          key="logout"
          href="/process/logout"
          className={`flex w-full items-center text-sm font-medium text-accent-500 transition-colors hover:bg-accent-50 hover:text-accent-600 ${
            isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'
          }`}
        >
          <LogOut className="h-5 w-5 text-red-500" />
          <span className={isCollapsed ? 'hidden' : 'truncate text-red-500'}>ออกจากระบบ</span>
        </a>
      </div>
    </aside>
  )
}
