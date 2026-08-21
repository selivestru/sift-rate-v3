import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { createPostSchema, type CreatePostInput } from '../schema/create-post.schema'
import { useCreatePostMutation } from './useCreatePostMutation'
import { useUpdatePostMutation } from './useUpdatePostMutation'

interface UsePostFormOptions {
  postId?: string
  initialContent?: string
  parentId?: string | null
  onSuccess: () => void
}

export const usePostForm = ({
  postId,
  initialContent,
  parentId,
  onSuccess,
}: UsePostFormOptions) => {
  const isEdit = postId != null

  const createMutation = useCreatePostMutation()
  const updateMutation = useUpdatePostMutation(parentId ?? null)

  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<CreatePostInput>({
    defaultValues: {
      content: initialContent ?? '',
    },
    mode: 'onChange',
    resolver: zodResolver(createPostSchema),
  })

  const content = useWatch({
    control,
    name: 'content',
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ postId: postId!, content: values.content })
      } else {
        await createMutation.mutateAsync(values)
      }

      onSuccess()

      setTimeout(reset, 100)
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
    isLoading: createMutation.isPending || updateMutation.isPending,
    serverError,
    isValid,
    content,
    reset,
  }
}
