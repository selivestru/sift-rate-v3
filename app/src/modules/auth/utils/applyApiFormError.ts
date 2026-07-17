import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

import type { ApiError } from '~/common/api'

export const applyApiFormError = <TFieldValues extends FieldValues>({
  apiError,
  setError,
  setServerError,
  fields,
}: {
  apiError: ApiError
  setError: UseFormSetError<TFieldValues>
  setServerError: (message: string | null) => void
  fields: readonly Path<TFieldValues>[]
}) => {
  let hasFieldError = false

  if (apiError.fieldErrors) {
    for (const field of fields) {
      const message = apiError.fieldErrors[field]
      if (message) {
        setError(field, { type: 'server', message })
        hasFieldError = true
      }
    }
  }

  if (!hasFieldError || apiError.message) {
    setServerError(apiError.message)
  }
}
