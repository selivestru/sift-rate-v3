import type { FieldError as RHFFieldError } from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '~/common/ui/field'
import { Input } from '~/common/ui/Input'

interface AuthTextFieldProps extends React.ComponentProps<'input'> {
  label: string
  error?: RHFFieldError
  isInvalid?: boolean
}

export const AuthTextField = ({ label, error, isInvalid, ...props }: AuthTextFieldProps) => {
  const invalid = isInvalid ?? !!error

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Input {...props} />
      {error?.message && <FieldError className="text-danger text-xs">{error.message}</FieldError>}
    </Field>
  )
}
