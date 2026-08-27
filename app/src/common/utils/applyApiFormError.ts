import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

import { translateApiErrorMessage, type ApiError } from '~/common/api'

const matchFieldMessage = (message: string, field: string): boolean => {
  const normalizedMessage = message.toLowerCase()
  const normalizedField = field.toLowerCase()

  return (
    normalizedMessage === normalizedField ||
    normalizedMessage.startsWith(`${normalizedField} `) ||
    normalizedMessage.startsWith(`${normalizedField}.`) ||
    normalizedMessage.startsWith(`${normalizedField}:`)
  )
}

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
        setError(field, {
          type: 'server',
          message: translateApiErrorMessage(message, { fields: fields.map(String) }),
        })
        hasFieldError = true
      }
    }
  }

  if (!hasFieldError && apiError.message) {
    const messages = apiError.message
      .split('. ')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    const unmatched: string[] = []

    for (const message of messages) {
      const field = fields.find((item) => matchFieldMessage(message, String(item)))

      if (field) {
        setError(field, {
          type: 'server',
          message: translateApiErrorMessage(message, { fields: fields.map(String) }),
        })
        hasFieldError = true
      } else {
        unmatched.push(translateApiErrorMessage(message, { fields: fields.map(String) }))
      }
    }

    if (unmatched.length > 0) {
      setServerError(unmatched.join('. '))
      return
    }
  }

  if (!hasFieldError) {
    setServerError(translateApiErrorMessage(apiError.message, { fields: fields.map(String) }))
  }
}
