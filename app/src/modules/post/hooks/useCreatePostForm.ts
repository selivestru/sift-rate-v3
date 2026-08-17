import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { createPostSchema, type CreatePostInput } from '../schema/create-post.schema'
import { useCreatePostMutation } from './useCreatePostMutation'

interface UseCreatePostFormOptions {
  onSuccess: () => void
}

export const useCreatePostForm = ({ onSuccess }: UseCreatePostFormOptions) => {
  const createMutation = useCreatePostMutation()

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm<CreatePostInput>({
    defaultValues: {
      content: '',
    },
    mode: 'onChange',
    resolver: zodResolver(createPostSchema),
  })

  const content = watch('content')

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    try {
      await createMutation.mutateAsync(values)
      onSuccess()
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(createPostSchema.shape),
      })
    }
  })

  return {
    register,
    errors,
    onSubmit,
    isLoading: createMutation.isPending,
    serverError,
    isValid,
    content,
  }
}
