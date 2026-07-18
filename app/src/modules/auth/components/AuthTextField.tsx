import type { FieldError as RHFFieldError } from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '~/common/ui/Field'
import { Input, type InputProps } from '~/common/ui/Input'

interface AuthTextFieldProps extends InputProps {
  label: string
  error?: RHFFieldError
  isInvalid?: boolean
}

export const AuthTextField = ({ label, error, isInvalid, ...props }: AuthTextFieldProps) => {
  const invalid = isInvalid ?? !!error

  return (
    <Field data-invalid={invalid}>
      <FieldLabel>{label}</FieldLabel>
      <Input isInvalid={invalid} {...props} />
      {error?.message && <FieldError>{error.message}</FieldError>}
    </Field>
  )
}
