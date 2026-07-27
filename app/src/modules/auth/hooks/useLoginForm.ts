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

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)

    try {
      await mutation.mutateAsync(data)
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: LOGIN_FIELDS,
      })
    }
  })

  return {
    register,
    errors,
    onSubmit,
    isLoading: mutation.isPending,
    serverError,
  }
}
