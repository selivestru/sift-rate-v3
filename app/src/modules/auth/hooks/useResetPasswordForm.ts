import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { resetPasswordSchema, type ResetPasswordInput } from '../schema/auth.schema'
import { useResetPasswordMutation } from './useRestPasswordMutation'

export const useResetPasswordForm = (token: string) => {
  const mutation = useResetPasswordMutation()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)

    try {
      await mutation.mutateAsync({
        token,
        password: data.password,
      })
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(resetPasswordSchema.shape),
      })
    }
  })

  return {
    register,
    errors,
    onSubmit,
    isLoading: mutation.isPending,
    result: mutation.data,
    serverError,
  }
}
