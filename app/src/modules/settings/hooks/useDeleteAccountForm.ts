import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { createDeleteAccountSchema, type DeleteAccountInput } from '../schema/settings.schema'
import { useDeleteAccountMutation } from './useDeleteAccountMutation'

interface UseDeleteAccountFormOptions {
  requirePassword?: boolean
  onSuccess?: () => void
}

export const useDeleteAccountForm = ({
  requirePassword = false,
  onSuccess,
}: UseDeleteAccountFormOptions = {}) => {
  const mutation = useDeleteAccountMutation()
  const schema = createDeleteAccountSchema(requirePassword)
  const [serverError, setServerError] = useState<string | null>(null)
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null)
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<DeleteAccountInput>({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(schema),
  })

  const onFormSubmit = async (data: DeleteAccountInput) => {
    if (mutation.isPending) return

    setServerError(null)
    setTwoFactorError(null)

    try {
      await mutation.mutateAsync(data)
      toast.success('Check your email to confirm account deletion')
      setTwoFactorDialogOpen(false)
      onSuccess?.()
      reset()
    } catch (error) {
      const apiError = await getApiError(error)

      if (apiError.code === 'TWO_FACTOR_REQUIRED') {
        setTwoFactorDialogOpen(true)
        return
      }

      if (apiError.code === 'INVALID_TWO_FACTOR_CODE') {
        setTwoFactorError('Invalid two-factor code')
        return
      }

      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(schema.shape),
      })
    }
  }

  const onSubmit = handleSubmit(onFormSubmit)

  const onSubmitWithTwoFactor = (code: string) => {
    setValue('twoFactorCode', code)
    handleSubmit(onFormSubmit)()
  }

  const onCloseTwoFactorDialog = () => {
    setTwoFactorDialogOpen(false)
    setTwoFactorError(null)
    setValue('twoFactorCode', undefined)
  }

  return {
    register,
    errors,
    onSubmit,
    isLoading: mutation.isPending,
    serverError,
    isValid,
    reset,
    twoFactorState: {
      isOpen: twoFactorDialogOpen,
      onClose: onCloseTwoFactorDialog,
      onSubmit: onSubmitWithTwoFactor,
      isLoading: mutation.isPending,
      error: twoFactorError,
    },
  }
}
