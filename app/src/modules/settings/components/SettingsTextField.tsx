import type { FieldError as RHFFieldError } from 'react-hook-form'

import { Field, FieldDescription, FieldError, FieldLabel } from '~/common/ui/Field'
import { Input, type InputProps } from '~/common/ui/Input'

interface SettingsTextFieldProps extends InputProps {
  label: string
  description?: string
  error?: RHFFieldError
  isInvalid?: boolean
}

export const SettingsTextField = ({
  label,
  description,
  error,
  isInvalid,
  id,
  ...props
}: SettingsTextFieldProps) => {
  const invalid = isInvalid ?? !!error
  const fieldId = id ?? props.name

  return (
    <Field isInvalid={invalid} className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Input id={fieldId} isInvalid={invalid} {...props} />
      {description && !error?.message && <FieldDescription>{description}</FieldDescription>}
      {error?.message && <FieldError>{error.message}</FieldError>}
    </Field>
  )
}
