import type { ReactNode } from 'react'
import { Plus, ChevronDown } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { TABLE_LABELS } from '~/components/admin/constants/table_labels'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actionButtons?: ReactNode
  toolbar?: ReactNode
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actionButtons,
  toolbar,
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-slate-400">/</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-[#111827] transition-colors">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-[#111827]">{crumb.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">{title}</h1>
          {description && <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">{actionButtons}</div>
      </div>
      {toolbar && <div>{toolbar}</div>}
    </div>
  )
}

export interface ActionToolbarProps {
  onRefresh?: () => void
  onImport?: () => void
  onExportPDF?: () => void
  onExportCSV?: () => void
  onAddNew?: () => void
  addNewLabel?: string
  exportLabel?: string
  showAddNew?: boolean
  showImport?: boolean
  showExport?: boolean
  isLoading?: boolean
}

export function ActionToolbar({
  // onImport,
  onExportPDF,
  onExportCSV,
  onAddNew,
  addNewLabel = TABLE_LABELS.addNew,
  exportLabel = TABLE_LABELS.export,
  showAddNew = true,
  // showImport = true,
  showExport = true,
  // isLoading = false,
}: ActionToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {showExport && (onExportPDF || onExportCSV) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 border-border bg-white">
              {exportLabel}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onExportPDF && <DropdownMenuItem onClick={onExportPDF}>PDF</DropdownMenuItem>}
            {onExportCSV && <DropdownMenuItem onClick={onExportCSV}>Excel</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {showAddNew && onAddNew && (
        <Button className="gap-2 bg-gold text-white hover:opacity-95" onClick={onAddNew}>
          <Plus className="h-4 w-4" />
          {addNewLabel}
        </Button>
      )}
    </div>
  )
}
