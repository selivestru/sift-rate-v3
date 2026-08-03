import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'
import { useAuthStore } from '~/modules/auth'

import { changeEmailSchema, type ChangeEmailInput } from '../schema/settings.schema'
import { useChangeEmailMutation } from './useChangeEmailMutation'

export const useChangeEmailForm = () => {
  const mutation = useChangeEmailMutation()
  const currentEmail = useAuthStore((state) => state.user?.email)
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
  } = useForm<ChangeEmailInput>({
    defaultValues: {
      newEmail: '',
      currentPassword: '',
    },
    resolver: zodResolver(changeEmailSchema),
    mode: 'onChange',
  })

  const onFormSubmit = async (data: ChangeEmailInput) => {
    if (mutation.isPending) return

    if (currentEmail === data.newEmail) {
      setError('newEmail', {
        type: 'manual',
        message: 'New email must be different from your current email',
      })
      return
    }

    setServerError(null)
    setTwoFactorError(null)

    try {
      await mutation.mutateAsync({
        newEmail: data.newEmail,
        currentPassword: data.currentPassword,
        twoFactorCode: data.twoFactorCode,
      })
      toast.success('Check your new email to confirm the change')
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
        fields: objectKeys(changeEmailSchema.shape),
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
