import { cn } from '~/lib/utils'
import Select from 'react-select'

export function FormOptions({
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
  options,
  isShowOnly,
  errors,
  allowEmpty,
  optGroup,
  disabled,
}: {
  type?: string
  name: string
  label: string
  isRequired?: boolean
  defaultValue?: string | string[] | number[]
  placeholder?: string
  onChange?: (e: any) => void
  className?: string
  labelClassName?: string
  wrapperClassName?: string
  options: Array<{ label: string; value: string }>
  isShowOnly?: boolean
  errors?: string
  allowEmpty?: boolean
  optGroup?: boolean
  disabled?: boolean
}) {
  let groupedOptions
  if (optGroup) {
    groupedOptions = options.reduce(
      (acc, option: any) => {
        const accOptionGroup = acc[option.group] || []

        return {
          ...acc,
          [option.group]: [...accOptionGroup, option],
        }
      },
      {} as Record<string, any>
    )
  }

  return (
    <>
      <div className={cn(['space-y-1.5', wrapperClassName])}>
        <label
          className={cn(['text-sm font-semibold text-slate-700', labelClassName])}
          htmlFor={name}
        >
          {label} {isRequired ? <span className="text-red-500">*</span> : ''}
        </label>
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            onChange={onChange}
            className={cn([
              'w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all',
              className,
              errors
                ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none'
                : '',
              isShowOnly ? 'border-slate-100 bg-slate-50' : '',
            ])}
            defaultValue={Array.isArray(defaultValue) ? (defaultValue as any[])[0] : defaultValue}
            disabled={disabled}
            // {...(disabled ? { disabled: true } : {})}
            {...(isRequired ? { required: true } : {})}
            {...(isShowOnly ? { readOnly: true, disabled: true } : {})}
          >
            {allowEmpty || !defaultValue ? (
              <option />
            ) : placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : (
              ''
            )}
            {optGroup && groupedOptions
              ? Object.entries(groupedOptions).map(([optionGroupName, groupOptions]) =>
                  optionGroupName !== 'undefined' ? (
                    <optgroup key={optionGroupName} label={optionGroupName}>
                      {groupOptions.map((opt: { label: string; value: string }, index: number) => (
                        <option key={index} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  ) : (
                    groupOptions.map((opt: { label: string; value: string }, index: number) => (
                      <option key={index} value={opt.value}>
                        {opt.label}
                      </option>
                    ))
                  )
                )
              : options.map((opt, index) => {
                  return (
                    <option key={index} value={opt.value}>
                      {opt.label}
                    </option>
                  )
                })}
          </select>
        ) : type === 'select_multiple' ? (
          <Select
            id={name}
            name={name}
            isMulti={true}
            isClearable={false}
            // closeMenuOnSelect={false}
            options={options}
            onChange={onChange}
            classNames={cn([
              'w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all',
              className,
              errors
                ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none'
                : '',
              isShowOnly ? 'border-slate-100 bg-slate-50' : '',
            ])}
            defaultValue={defaultValue}
            isDisabled={disabled}
            // {...(disabled ? { disabled: true } : {})}
            {...(isRequired ? { required: true } : {})}
            {...(isShowOnly ? { readOnly: true, disabled: true } : {})}
          />
        ) : type === 'radio' ? (
          options.map((opt, index) => {
            return (
              <label
                key={index}
                className="flex rounded-md bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all indent-1.5"
              >
                <input
                  type="radio"
                  id={name}
                  name={name}
                  onChange={onChange}
                  className={cn([
                    'pl-2',
                    className,
                    errors
                      ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none'
                      : '',
                    isShowOnly ? 'border-slate-100 bg-slate-50' : '',
                  ])}
                  value={opt.value}
                  checked={String(opt.value) === String(defaultValue)}
                  disabled={disabled}
                  // {...(disabled ? { disabled: true } : {})}
                  {...(isRequired ? { required: true } : {})}
                  {...(isShowOnly ? { readOnly: true, disabled: true } : {})}
                />
                {opt.label}
              </label>
              // <option key={index} value={opt.value}>
              //   {opt.label}
              // </option>
            )
          })
        ) : (
          // <RadioGroup
          //   id={name}
          //   name={name}
          //   isMulti={true}
          //   isClearable={false}
          //   // closeMenuOnSelect={false}
          //   options={options}
          //   onChange={onChange}
          //   classNames={cn([
          //     'w-full flex h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b08730] focus:border-transparent transition-all',
          //     className,
          //     errors
          //       ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none'
          //       : '',
          //     isShowOnly ? 'border-slate-100 bg-slate-50' : '',
          //   ])}
          //   defaultValue={defaultValue}
          //   {...(isRequired ? { required: true } : {})}
          //   {...(isShowOnly ? { readOnly: true, disabled: true } : {})}
          // />
          <></>
        )}
        {errors && <p className="error-text">{errors}</p>}
      </div>
    </>
  )
}
