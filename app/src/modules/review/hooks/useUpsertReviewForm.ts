import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import type { MediaRef } from '~/common/types/media-ref.types'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { rateFormSchema, type RateFormValues } from '../schema/rate.schema'
import { type Review } from '../types/review.types'
import { useUpsertReviewMutation } from './useUpsertReviewMutation'

export const useUpsertReviewForm = (
  media: MediaRef,
  onClose: () => void,
  initialData?: Review | null,
) => {
  const mutation = useUpsertReviewMutation()
  const [serverError, setServerError] = useState<string | null>(null)

  const { handleSubmit, reset, setError, ...form } = useForm<RateFormValues>({
    defaultValues: {
      rating: initialData?.rating ?? 5,
      content: initialData?.content ?? '',
    },
    resolver: zodResolver(rateFormSchema),
  })

  useEffect(() => {
    if (initialData) {
      reset({
        rating: initialData.rating ?? 5,
        content: initialData.content ?? '',
      })
    }
  }, [reset, initialData])

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    const content = values.content?.trim()

    const sameRating = initialData?.rating === values.rating
    const sameContent = initialData?.content === content

    if (sameRating && sameContent) {
      onClose()
      return
    }

    try {
      await mutation.mutateAsync({
        mediaType: media.mediaType,
        externalId: media.externalId,
        rating: values.rating,
        content: content && content.length > 0 ? content : null,
        previousReview: initialData ? { id: initialData.id, rating: initialData.rating } : null,
      })

      onClose()
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(rateFormSchema.shape),
      })
    }
  })

  return {
    onSubmit,
    isLoading: mutation.isPending,
    reset,
    serverError,
    setError,
    ...form,
  }
}
