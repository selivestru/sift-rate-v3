import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { setStorageItem } from '~/common/utils/storage'

import { registerSchema, type RegisterInput } from '../schema/auth.schema'
import { useRegisterMutation } from './useRegisterMutation'

const REGISTER_FIELDS = ['email', 'username', 'password', 'confirmPassword'] as const

export const useRegisterForm = () => {
  const mutation = useRegisterMutation()
  const navigate = useNavigate()

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)

    try {
      await mutation.mutateAsync(data)
      setStorageItem('has_session', true)
      navigate({ to: '/' })
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: REGISTER_FIELDS,
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
