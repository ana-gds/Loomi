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
          <Label className="text-medium font-medium text-texto-principal">
            {label}
          </Label>

          <div className="relative mt-3">
            {icon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-texto-secundario/50">
              {icon}
            </span>
            )}

            <Input
                placeholder={placeholder}
                onChange={onChange}
                {...rest}
                className={clsx(
                    'block w-full rounded-lg border border-2 border-principal/25 bg-secundario placeholder-texto-secundario/50 px-3 py-1.5 text-sm text-texto-secundario',
                    icon && 'pl-10',
                    'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-principal/50'
                )}
            />
          </div>
        </Field>
      </div>
  )
}
