import { HTTPError, NetworkError, TimeoutError } from 'ky'

export interface ApiError {
  message: string
  fieldErrors?: Record<string, string>
  status?: number
}

interface ApiErrorBody {
  message?: string
  errors?: Record<string, string | string[]>
  fieldErrors?: Record<string, string | string[]>
}

const SERVER_UNAVAILABLE_MESSAGE = 'Server is unavailable. Please try again later.'
const NETWORK_MESSAGE = 'No internet connection'
const FALLBACK_MESSAGE = 'Something went wrong'

const SERVER_UNAVAILABLE_STATUSES = new Set([502, 503, 504, 0])

const normalizeFieldErrors = (
  errors?: Record<string, string | string[]>,
): Record<string, string> | undefined => {
  if (!errors) return undefined

  const fieldErrors: Record<string, string> = {}

  for (const [key, value] of Object.entries(errors)) {
    const message = Array.isArray(value) ? value[0] : value
    if (typeof message === 'string' && message.length > 0) {
      fieldErrors[key] = message
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
}

export const getApiError = async (err: unknown): Promise<ApiError> => {
  if (err instanceof NetworkError || err instanceof TimeoutError) {
    return { message: SERVER_UNAVAILABLE_MESSAGE }
  }

  if (err instanceof HTTPError) {
    const status = err.response.status

    if (SERVER_UNAVAILABLE_STATUSES.has(status)) {
      return {
        message: SERVER_UNAVAILABLE_MESSAGE,
        status,
      }
    }

    try {
      const data = (await err.response.json()) as ApiErrorBody

      return {
        message: data.message ?? FALLBACK_MESSAGE,
        fieldErrors: normalizeFieldErrors(data.fieldErrors ?? data.errors),
        status,
      }
    } catch {
      return {
        message: FALLBACK_MESSAGE,
        status,
      }
    }
  }

  if (err instanceof TypeError) {
    const message = err.message.toLowerCase()

    if (
      message.includes('failed to fetch') ||
      message.includes('networkerror') ||
      message.includes('load failed') ||
      message.includes('network request failed')
    ) {
      return { message: SERVER_UNAVAILABLE_MESSAGE }
    }

    return { message: NETWORK_MESSAGE }
  }

  return { message: FALLBACK_MESSAGE }
}
