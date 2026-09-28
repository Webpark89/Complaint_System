import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Save, Trash2, Eye, Edit } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Checkbox } from '@radix-ui/react-checkbox'
// import { Checkbox } from '@mui/material'

// ========== Create / Edit Modal ==========
export interface FormField {
  key: string
  label: string
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'date'
    | 'datetime'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  rows?: number
}

export interface CreateEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields: FormField[]
  values: Record<string, unknown>
  onValuesChange: (values: Record<string, unknown>) => void
  onSubmit: () => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export function CreateEditModal({
  open,
  onOpenChange,
  title,
  description,
  fields,
  values,
  onValuesChange,
  onSubmit,
  submitLabel = 'บันทึก',
  cancelLabel = 'ยกเลิก',
  isLoading = false,
  mode = 'create',
}: CreateEditModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'edit' ? (
              <Edit className="h-5 w-5 text-gold" />
            ) : (
              <PlusIcon className="h-5 w-5 text-gold" />
            )}
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
          className="space-y-4"
        >
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </Label>

              {field.type === 'textarea' ? (
                <Textarea
                  id={field.key}
                  value={(values[field.key] as string) || ''}
                  onChange={(e) => onValuesChange({ ...values, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  rows={field.rows || 3}
                  required={field.required}
                  className="border-border"
                />
              ) : field.type === 'select' ? (
                // ✅ เปลี่ยนจาก <select> เป็น Shadcn Select Component
                <Select
                  value={(values[field.key] as string) || ''}
                  onValueChange={(val: any) => onValuesChange({ ...values, [field.key]: val })}
                >
                  <SelectTrigger className="w-full border-border rounded-xl">
                    <SelectValue placeholder={field.placeholder || 'เลือก...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={field.key}
                    checked={(values[field.key] as boolean) || false}
                    onChange={(e) =>
                      onValuesChange({
                        ...values,
                        [field.key]: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-slate-400"
                  />
                  <Label htmlFor={field.key} className="text-sm text-slate-600">
                    {field.placeholder || 'เปิดใช้งาน'}
                  </Label>
                </div>
              ) : (
                <Input
                  id={field.key}
                  type={field.type || 'text'}
                  value={(values[field.key] as string) || ''}
                  onChange={(e) => onValuesChange({ ...values, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="border-border"
                />
              )}
            </div>
          ))}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border"
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              className="bg-gold text-[#111827] hover:opacity-95"
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" />
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ========== Delete Dialog ==========
export interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  itemName?: string
  onConfirm: () => void
  isLoading?: boolean
}

export function DeleteDialog({
  open,
  onOpenChange,
  title = 'ยืนยันการลบ',
  description = 'การดำเนินการนี้ไม่สามารถย้อนกลับได้',
  itemName,
  onConfirm,
  isLoading = false,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {itemName ? `คุณต้องการลบ "${itemName}" หรือไม่?` : 'คุณต้องการลบรายการนี้หรือไม่?'}
            {description && ` ${description}`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="border-border">ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            className="bg-red-500 text-white hover:bg-red-600"
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            ลบ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ========== Detail Drawer ==========
export interface DetailField {
  key: string
  label: string
  render?: (value: unknown) => ReactNode
}

export interface DetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  item: Record<string, unknown> | null
  fields: DetailField[]
  actions?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function DetailDrawer({
  open,
  onOpenChange,
  title,
  item,
  fields,
  actions,
  size = 'md',
}: DetailDrawerProps) {
  const sizeClass = {
    sm: 'sm:max-w-[400px]',
    md: 'sm:max-w-[560px]',
    lg: 'sm:max-w-[720px]',
    xl: 'sm:max-w-[900px]',
  }[size]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={sizeClass}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-gold" />
            {title}
          </SheetTitle>
          <SheetDescription className="sr-only">รายละเอียด</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4 overflow-y-auto">
          {item &&
            fields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {field.label}
                </div>
                <div className="text-sm font-medium text-[#111827]">
                  {field.render
                    ? field.render(item[field.key])
                    : ((item[field.key] as ReactNode) ?? '—')}
                </div>
              </div>
            ))}
          {actions && <div className="pt-4 border-t border-border">{actions}</div>}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ========== Status Badge ==========
export type StatusVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'gold'

export interface StatusBadgeProps {
  status: string
  variant: StatusVariant
}

const variantClasses: Record<StatusVariant, string> = {
  success: 'border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.12)] text-[var(--success)]',
  warning: 'border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] text-[var(--warning)]',
  danger: 'border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] text-red-500',
  neutral:
    'border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)]',
  gold: 'border border-[rgba(176,141,87,0.25)] bg-[rgba(176,141,87,0.12)] text-[var(--gold)]',
}

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2 py-1 text-xs font-semibold ${variantClasses[variant]}`}
    >
      {status}
    </span>
  )
}

// ========== Filter Tabs ==========
export interface FilterOption {
  value: string
  label: string
}

interface SingleFilterTabsProps {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  multiple?: false
}

interface MultipleFilterTabsProps {
  options: FilterOption[]
  value: string[]
  onChange: (value: string[]) => void
  multiple: true
}

export type FilterTabsProps = SingleFilterTabsProps | MultipleFilterTabsProps

export function FilterTabs({ options, value, onChange, multiple = false }: FilterTabsProps) {
  const selectedValues: string[] = multiple ? (value as string[]) : [value as string]
  const singleOnChange = onChange as SingleFilterTabsProps['onChange']
  const multipleOnChange = onChange as MultipleFilterTabsProps['onChange']

  const handleChange = (optionValue: string) => {
    if (!multiple) {
      singleOnChange(optionValue)
      return
    }

    if (!optionValue) {
      multipleOnChange([])
      return
    }

    const nextValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
      : [...selectedValues, optionValue]

    multipleOnChange(nextValues)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Button
          key={opt.value}
          type="button"
          variant={
            (multiple ? opt.value === '' && selectedValues.length === 0 : value === opt.value) ||
            selectedValues.includes(opt.value)
              ? 'default'
              : 'outline'
          }
          size="sm"
          className={
            (multiple ? opt.value === '' && selectedValues.length === 0 : value === opt.value) ||
            selectedValues.includes(opt.value)
              ? 'border-gold bg-gold text-white hover:opacity-95'
              : 'border-border bg-white text-slate-600'
          }
          onClick={() => handleChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}

// ========== Search Input ==========
export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'ค้นหา...',
  className = 'w-70',
}: SearchInputProps) {
  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border-border pl-9 ${className}`}
      />
    </div>
  )
}

// ========== Local Icon Components ==========
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}
