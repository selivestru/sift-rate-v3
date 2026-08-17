import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { createPostSchema, type CreatePostInput } from '../schema/create-post.schema'
import { useCreateReplyMutation } from './useCreateReplyMutation'

export const useCreateReplyForm = (postId: string) => {
  const createMutation = useCreateReplyMutation(postId)

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<CreatePostInput>({
    defaultValues: {
      content: '',
    },
    mode: 'onChange',
    resolver: zodResolver(createPostSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    try {
      await createMutation.mutateAsync(values)
      reset()
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
    errors,
    onSubmit,
    isLoading: createMutation.isPending,
    serverError,
    control,
  }
}
