import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import type { FieldError as RHFFieldError } from 'react-hook-form'

import { Button } from '~/common/ui/Button'
import { Field, FieldError, FieldLabel } from '~/common/ui/Field'
import { Input, type InputProps } from '~/common/ui/Input'

interface PasswordFieldProps extends InputProps {
  label: string
  error?: RHFFieldError
  isInvalid?: boolean
  labelEnd?: React.ReactNode
}

export const PasswordField = ({
  label,
  error,
  isInvalid,
  labelEnd,
  ...props
}: PasswordFieldProps) => {
  const invalid = isInvalid ?? !!error
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Field isInvalid={invalid} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor="inline-end-input">{label}</FieldLabel>
        {labelEnd}
      </div>

      <Input
        isInvalid={invalid}
        type={isVisible ? 'text' : 'password'}
        className="pr-1"
        endIcon={
          <Button
            isIconOnly
            type="button"
            variant="ghost"
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            onClick={() => setIsVisible((value) => !value)}
          >
            {isVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </Button>
        }
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        {...props}
      />

      {error?.message && <FieldError>{error.message}</FieldError>}
    </Field>
  )
}
