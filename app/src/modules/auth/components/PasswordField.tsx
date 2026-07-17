import { Button, ErrorMessage, InputGroup, Label, TextField } from '@heroui/react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import type { FieldError as RHFFieldError } from 'react-hook-form'

interface PasswordFieldProps extends Omit<ComponentProps<'input'>, 'type' | 'className'> {
  label: string
  error?: RHFFieldError
  isInvalid?: boolean
  labelEnd?: ReactNode
}

export const PasswordField = ({
  label,
  error,
  isInvalid,
  labelEnd,
  ...props
}: PasswordFieldProps) => {
  const fieldId = useId()
  const invalid = isInvalid ?? !!error
  const [isVisible, setIsVisible] = useState(false)

  return (
    <TextField fullWidth isInvalid={invalid} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={fieldId} className="text-sm font-medium">
          {label}
        </Label>
        {labelEnd}
      </div>
      <InputGroup fullWidth variant="secondary" className="h-11">
        <InputGroup.Input
          id={fieldId}
          type={isVisible ? 'text' : 'password'}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          {...props}
        />
        <InputGroup.Suffix>
          <Button
            type="button"
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            onPress={() => setIsVisible((value) => !value)}
          >
            {isVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
      {error?.message && (
        <ErrorMessage className="text-danger text-xs">{error.message}</ErrorMessage>
      )}
    </TextField>
  )
}
