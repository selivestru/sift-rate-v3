import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { useDisclosure } from '~/common/hooks/useDisclosure'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { registerSchema, type RegisterInput } from '../schema/auth.schema'
import { useRegisterMutation } from './useRegisterMutation'

export const useRegisterForm = () => {
  const mutation = useRegisterMutation()

  const emailVerificationDialog = useDisclosure()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<RegisterInput>({
    defaultValues: {
      email: '',
      username: '',
      displayName: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)

    try {
      await mutation.mutateAsync(data)
      emailVerificationDialog.open()
      reset()
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(registerSchema.shape),
      })
    }
  })

  return {
    register,
    errors,
    onSubmit,
    isLoading: mutation.isPending,
    serverError,
    emailVerificationDialog,
  }
}
