import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { setStorageItem } from '~/common/utils/storage'

import { loginSchema, type LoginInput } from '../schema/auth.schema'
import { useAuthStore } from '../store/auth.store'
import { applyApiFormError } from '../utils/applyApiFormError'
import { useLoginMutation } from './useLoginMutation'

const LOGIN_FIELDS = ['email', 'password'] as const

export const useLoginForm = () => {
  const mutation = useLoginMutation()

  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

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
      const response = await mutation.mutateAsync(data)
      setUser(response.user)
      setStorageItem('has_session', true)
      navigate({ to: '/' })
    } catch (err) {
      const apiError = await getApiError(err)
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
