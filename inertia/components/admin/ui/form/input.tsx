import { cn } from '~/lib/utils'

export function FormInput({
  type,
  name,
  label,
  isRequired,
  defaultValue,
  placeholder,
  onChange,
  className,
  labelClassName,
  wrapperClassName,
  isShowOnly,
  isDisabled,
  min,
  step,
  maxLength,
  errors,
}: {
  type?: string
  name: string
  label: string
  isRequired?: boolean
  defaultValue?: string
  placeholder?: string
  onChange?: (e: any) => void
  className?: string
  labelClassName?: string
  wrapperClassName?: string
  isShowOnly?: boolean
  isDisabled?: boolean
  min?: number
  step?: number
  maxLength?: number
  errors?: string
}) {
  return (
    <>
      <div className={cn(['space-y-1.5', wrapperClassName])}>
        <label
          className={cn(['text-sm font-semibold text-slate-700', labelClassName])}
          htmlFor={name}
        >
          {label} {isRequired ? <span className="text-red-500">*</span> : ''}
        </label>
        {type === 'text' || type === 'number' || type === 'email' || type === 'url' ? (
          <>
            <input
              id={name}
              type={type}
              name={name}
              value={defaultValue}
              onChange={onChange}
              min={min}
              step={step}
              maxLength={maxLength}
              className={cn([
                'w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all',
                className,
                errors
                  ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none'
                  : '',
                isShowOnly ? 'border-slate-100 bg-slate-50' : '',
              ])}
              placeholder={placeholder}
              {...(isRequired ? { required: true } : {})}
              {...(isDisabled ? { disabled: true } : {})}
              {...(isShowOnly ? { readOnly: true, disabled: true } : {})}
            />
            {errors && <p className="error-text">{errors}</p>}
          </>
        ) : type === 'textarea' ? (
          <>
            <textarea
              id={name}
              name={name}
              onChange={onChange}
              className={cn([
                'w-full flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all resize-none',
                className,
                errors
                  ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none'
                  : '',
                isShowOnly ? 'border-slate-100 bg-slate-50 focus:border-none focus:ring-0' : '',
              ])}
              placeholder={placeholder}
              defaultValue={defaultValue}
              maxLength={maxLength}
              {...(isRequired ? { required: true } : {})}
              {...(isDisabled ? { disabled: true } : {})}
              {...(isShowOnly ? { readOnly: true } : {})}
            />
            {errors && <p className="error-text">{errors}</p>}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
