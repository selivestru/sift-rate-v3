import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { completeProfileSchema, type CompleteProfileInput } from '../schema/auth.schema'
import { useAuthStore } from '../store/auth.store'
import { useCompleteProfileMutation } from './useCompleteProfileMutation'

export const useCompleteProfileForm = () => {
  const displayName = useAuthStore((state) => state.user?.displayName)

  const navigate = useNavigate()
  const setCompleteProfile = useAuthStore((state) => state.setCompleteProfile)
  const completeProfileMutation = useCompleteProfileMutation()

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CompleteProfileInput>({
    defaultValues: {
      displayName: displayName ?? '',
      username: '',
    },
    resolver: zodResolver(completeProfileSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null)

    try {
      const response = await completeProfileMutation.mutateAsync(data)
      setCompleteProfile(response)
      navigate({ to: '/' })
      toast.success('Profile completed')
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(completeProfileSchema.shape),
      })
    }
  })

  return {
    register,
    onSubmit,
    isLoading: completeProfileMutation.isPending,
    errors,
    serverError,
  }
}
