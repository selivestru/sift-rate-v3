import { HTTPError, isHTTPError, isNetworkError, isTimeoutError } from 'ky'

export interface ApiError {
  message: string
  fieldErrors?: Record<string, string>
  status?: number
  code?: string
}

interface ApiErrorBody {
  message?: string | string[]
  errors?: Record<string, string | string[]>
  fieldErrors?: Record<string, string | string[]>
  code?: string
}

const SERVER_UNAVAILABLE_MESSAGE = 'Server is unavailable. Please try again later.'
const NETWORK_MESSAGE = 'No internet connection'
const FALLBACK_MESSAGE = 'Something went wrong'

const SERVER_UNAVAILABLE_STATUSES = new Set([502, 503, 504, 0])

const normalizeMessage = (message?: string | string[]): string => {
  if (Array.isArray(message)) {
    const parts = message.filter(
      (item): item is string => typeof item === 'string' && item.length > 0,
    )
    return parts.length > 0 ? parts.join('. ') : FALLBACK_MESSAGE
  }

  if (typeof message === 'string' && message.length > 0) {
    return message
  }

  return FALLBACK_MESSAGE
}

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

const isApiErrorBody = (value: unknown): value is ApiErrorBody => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const parseBody = (data: unknown): ApiErrorBody | undefined => {
  if (isApiErrorBody(data)) {
    return data
  }

  if (typeof data === 'string' && data.length > 0) {
    try {
      const parsed: unknown = JSON.parse(data)
      if (isApiErrorBody(parsed)) {
        return parsed
      }
    } catch {
      return { message: data }
    }

    return { message: data }
  }

  return undefined
}

const readHttpErrorBody = async (err: HTTPError): Promise<ApiErrorBody | undefined> => {
  const fromData = parseBody(err.data)
  if (fromData) {
    return fromData
  }

  try {
    if (err.response.bodyUsed) {
      return undefined
    }

    const contentType = err.response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      return parseBody(await err.response.json())
    }

    return parseBody(await err.response.text())
  } catch {
    return undefined
  }
}

export const getApiError = async (err: unknown): Promise<ApiError> => {
  if (isNetworkError(err) || isTimeoutError(err)) {
    return { message: SERVER_UNAVAILABLE_MESSAGE }
  }

  if (isHTTPError(err)) {
    const status = err.response.status

    if (SERVER_UNAVAILABLE_STATUSES.has(status)) {
      return {
        message: SERVER_UNAVAILABLE_MESSAGE,
        status,
      }
    }

    const data = await readHttpErrorBody(err)

    return {
      message: normalizeMessage(data?.message),
      fieldErrors: normalizeFieldErrors(data?.fieldErrors ?? data?.errors),
      code: data?.code,
      status,
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
