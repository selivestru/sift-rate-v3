import { toast } from 'sonner'

import { getApiError } from './getApiError'
import { translateApiErrorMessage } from './translateApiError'

export const toastApiError = async (error: unknown) => {
  const { message } = await getApiError(error)
  toast.error(translateApiErrorMessage(message))
}
