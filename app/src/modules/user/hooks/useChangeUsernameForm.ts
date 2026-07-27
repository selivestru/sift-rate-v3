import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { useAuthStore } from '~/modules/auth/store/auth.store'

import { changeUsernameSchema, type ChangeUsernameInput } from '../schema/username.schema'
import { useChangeUsernameMutation } from './useChangeUsernameMutation'

const CHANGE_USERNAME_FIELDS = ['username'] as const

export const useChangeUsernameForm = (onSuccess?: () => void) => {
  const mutation = useChangeUsernameMutation()
  const currentUsername = useAuthStore((state) => state.user?.username)
  const setUsername = useAuthStore((state) => state.setUsername)

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<ChangeUsernameInput>({
    defaultValues: {
      username: '',
    },
    resolver: zodResolver(changeUsernameSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    if (mutation.isPending) return

    if (currentUsername === data.username) {
      setError('username', { type: 'manual', message: 'Username cannot be the same' })
      return
    }

    setServerError(null)

    try {
      const response = await mutation.mutateAsync(data.username)
      setUsername(response.username)
      onSuccess?.()
      reset()
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
    isDirty,
    isValid,
  }
}
