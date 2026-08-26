import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntlayer } from 'react-intlayer'
import { toast } from 'sonner'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'
import { useAuthStore } from '~/modules/auth'

import { changeUsernameSchema, type ChangeUsernameInput } from '../schema/username.schema'
import { useChangeUsernameMutation } from './useChangeUsernameMutation'

export const useChangeUsernameForm = () => {
  const content = useIntlayer('user-change-username-form')
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
      setError('username', { type: 'manual', message: content.same.value })
      return
    }

    setServerError(null)

    try {
      const response = await mutation.mutateAsync(data.username)
      setUsername(response.username)
      toast.success(content.updated.value)
      reset()
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(changeUsernameSchema.shape),
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
