import { ErrorMessage, Input, Label, TextField, type InputProps } from '@heroui/react'
import type { FieldError as RHFFieldError } from 'react-hook-form'

interface AuthTextFieldProps extends InputProps {
  label: string
  error?: RHFFieldError
  isInvalid?: boolean
}

export const AuthTextField = ({ label, error, isInvalid, ...props }: AuthTextFieldProps) => {
  const invalid = isInvalid ?? !!error

  return (
    <TextField fullWidth isInvalid={invalid} className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <Input {...props} fullWidth variant="secondary" className="h-11" />
      {error?.message && (
        <ErrorMessage className="text-danger text-xs">{error.message}</ErrorMessage>
      )}
    </TextField>
  )
}
