import { AlertCircle } from 'lucide-react'
import { Label } from '~/components/ui/label'

const FieldGroup = ({
  label,
  required,
  error,
  full,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  full?: boolean
  children: React.ReactNode
}) => {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <Label className="text-xs font-bold text-foreground/80">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
      <FieldError msg={error} />
    </div>
  )
}

const FieldError = ({ msg }: { msg?: string }) => {
  if (!msg) return null
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#FF4D00]">
      <AlertCircle className="h-3 w-3" /> {msg}
    </p>
  )
}

export { FieldGroup, FieldError }
