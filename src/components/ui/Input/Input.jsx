import { Description, Field, Input, Label } from '@headlessui/react'
import clsx from 'clsx'

export function InputL({
       label = '',
       icon = null,
       placeholder = '',
       onChange,
       ...rest
}) {

  return (
      <div className="w-full max-w-md px-4">
        <Field>
          <Label className="text-sm font-medium text-white">
            {label}
          </Label>

          <div className="relative mt-3">
            {icon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
              {icon}
            </span>
            )}

            <Input
                placeholder={placeholder}
                onChange={onChange}
                {...rest}
                className={clsx(
                    'block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm text-white',
                    icon && 'pl-10',
                    'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                )}
            />
          </div>
        </Field>
      </div>
  )
}
