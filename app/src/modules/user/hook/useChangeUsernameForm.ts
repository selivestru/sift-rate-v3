import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { useAuthStore } from '~/modules/auth/store/auth.store'

import { changeUsernameSchema, type ChangeUsernameInput } from '../schema/username.schema'
import { useChangeUsernameMutation } from './useChangeUsernameMutation'

const CHANGE_USERNAME_FIELDS = ['username'] as const

export const useChangeUsernameForm = () => {
  const mutation = useChangeUsernameMutation()
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ChangeUsernameInput>({
    defaultValues: {
      username: '',
    },
    resolver: zodResolver(changeUsernameSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)

    try {
      const response = await mutation.mutateAsync(data.username)
      setUser(response.user)
      navigate({ to: '/' })
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: CHANGE_USERNAME_FIELDS,
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
