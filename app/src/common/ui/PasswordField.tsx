import { useState } from 'react'
import type { FieldError as RHFFieldError } from 'react-hook-form'
import { Eye, EyeOff } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { Field, FieldError, FieldLabel } from '~/common/ui/Field'
import { Input, type InputProps } from '~/common/ui/Input'
import { cn } from '~/common/utils/cn'

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
  id,
  className,
  ...props
}: PasswordFieldProps) => {
  const invalid = isInvalid ?? !!error
  const fieldId = id ?? props.name
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Field isInvalid={invalid} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
        {labelEnd}
      </div>

      <Input
        {...props}
        id={fieldId}
        isInvalid={invalid}
        type={isVisible ? 'text' : 'password'}
        className={cn('pr-1', className)}
        endIcon={
          <Button
            isIconOnly
            type="button"
            variant="ghost"
            size="sm"
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            onClick={() => setIsVisible((value) => !value)}
          >
            {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        }
      />

      {error?.message && <FieldError>{error.message}</FieldError>}
    </Field>
  )
}
