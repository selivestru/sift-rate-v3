import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'
import { toast } from 'sonner'

import { getApiError, translateApiErrorMessage } from '~/common/api'
import { removeStorageItem } from '~/common/utils/storage'
import { useAuthStore } from '~/modules/auth'

import { useDeleteAccountMutation } from './useDeleteAccountMutation'

interface UseDeleteAccountFormOptions {
  onSuccess?: () => void
}

export const useDeleteAccountForm = ({ onSuccess }: UseDeleteAccountFormOptions = {}) => {
  const content = useIntlayer('delete-account-dialog')
  const mutation = useDeleteAccountMutation()
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async () => {
    if (mutation.isPending) return

    setServerError(null)

    try {
      await mutation.mutateAsync()
      setUser(null)
      removeStorageItem('has_session')
      queryClient.clear()
      onSuccess?.()
      toast.success(content.deletedToast.value)
      navigate({ to: '/' })
    } catch (error) {
      const apiError = await getApiError(error)
      setServerError(translateApiErrorMessage(apiError.message))
    }
  }

  return {
    onSubmit,
    isLoading: mutation.isPending,
    serverError,
  }
}
