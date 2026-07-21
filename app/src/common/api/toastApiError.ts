import { toast } from 'sonner'

import { getApiError } from './getApiError'

export const toastApiError = async (error: unknown) => {
  const { message } = await getApiError(error)
  toast.error(message)
}
