import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'

import { forgotPasswordSchema, type ForgotPasswordInput } from '../schema/auth.schema'
import { useForgotPasswordMutation } from './useForgotPasswordMutation'

const FORGOT_FIELDS = ['email'] as const

export const useForgotPasswordForm = () => {
  const mutation = useForgotPasswordMutation()
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)

    try {
      await mutation.mutateAsync(data)
      setIsSuccess(true)
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: FORGOT_FIELDS,
      })
    }
  })

  return {
    register,
    errors,
    onSubmit,
    isLoading: mutation.isPending,
    isSuccess,
    serverError,
  }
}
