import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'

import { loginSchema, type LoginInput } from '../schema/auth.schema'
import { useLoginMutation } from './useLoginMutation'

const LOGIN_FIELDS = ['email', 'password'] as const

export const useLoginForm = () => {
  const mutation = useLoginMutation()

  const [serverError, setServerError] = useState<string | null>(null)
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
  } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)

    try {
      await mutation.mutateAsync(data)
    } catch (error) {
      const apiError = await getApiError(error)

      if (apiError.code === 'TWO_FACTOR_REQUIRED') {
        setTwoFactorDialogOpen(true)
        return
      }

      if (apiError.code === 'INVALID_TWO_FACTOR_CODE') {
        setServerError('Invalid two-factor code')
        return
      }

      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: LOGIN_FIELDS,
      })
    }
  }

  const onSubmitWithTwoFactor = async (code: string) => {
    setValue('twoFactorCode', code)
    handleSubmit(onSubmit)()
  }

  return {
    register,
    errors,
    onSubmit: handleSubmit(onSubmit),
    isLoading: mutation.isPending,
    serverError,
    setValue,
    twoFactorState: {
      isOpen: twoFactorDialogOpen,
      onClose: () => {
        setTwoFactorDialogOpen(false)
        setValue('twoFactorCode', '')
      },
      onSubmit: onSubmitWithTwoFactor,
    },
  }
}
