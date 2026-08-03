import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { changePasswordSchema, type ChangePasswordInput } from '../schema/settings.schema'
import { useChangePasswordMutation } from './useChangePasswordMutation'

export const useChangePasswordForm = () => {
  const mutation = useChangePasswordMutation()
  const [serverError, setServerError] = useState<string | null>(null)
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false)
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<ChangePasswordInput>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(changePasswordSchema),
  })

  const onFormSubmit = async (data: ChangePasswordInput) => {
    if (mutation.isPending) return

    setServerError(null)
    setTwoFactorError(null)

    try {
      await mutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        twoFactorCode: data.twoFactorCode,
      })
      toast.success('Password changed')
      setTwoFactorDialogOpen(false)
      reset()
    } catch (error) {
      const apiError = await getApiError(error)

      if (apiError.code === 'TWO_FACTOR_REQUIRED') {
        setTwoFactorDialogOpen(true)
        return
      }

      if (twoFactorDialogOpen) {
        setTwoFactorError(apiError.message)
        return
      }

      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(changePasswordSchema.shape),
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
    isDirty,
    isValid,
    twoFactorState: {
      isOpen: twoFactorDialogOpen,
      onClose: onCloseTwoFactorDialog,
      onSubmit: onSubmitWithTwoFactor,
      isLoading: mutation.isPending,
      error: twoFactorError,
    },
  }
}
