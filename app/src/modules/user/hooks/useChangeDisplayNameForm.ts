import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'
import { useAuthStore } from '~/modules/auth/store/auth.store'

import { changeDisplayNameSchema, type ChangeDisplayNameInput } from '../schema/displayName.schema'
import { useChangeDisplayNameMutation } from './useChangeDisplayNameMutation'

export const useChangeDisplayNameForm = () => {
  const mutation = useChangeDisplayNameMutation()
  const currentDisplayName = useAuthStore((state) => state.user?.displayName)
  const setDisplayName = useAuthStore((state) => state.setDisplayName)

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<ChangeDisplayNameInput>({
    defaultValues: {
      displayName: '',
    },
    resolver: zodResolver(changeDisplayNameSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    if (mutation.isPending) return

    if (currentDisplayName === data.displayName) {
      setError('displayName', {
        type: 'manual',
        message: 'Display name cannot be the same',
      })
      return
    }

    setServerError(null)

    try {
      const response = await mutation.mutateAsync(data.displayName)
      setDisplayName(response.displayName)
      toast.success('Display name updated')
      reset()
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(changeDisplayNameSchema.shape),
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
