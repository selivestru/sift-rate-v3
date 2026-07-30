import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import type { MediaRef } from '~/common/types/media-ref.types'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { rateFormSchema, type RateFormValues } from '../schema/rate.schema'
import { VISIBILITY, type Review } from '../types/review.types'
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
      visibility: initialData?.visibility ?? VISIBILITY.PRIVATE,
      hasSpoiler: initialData?.hasSpoiler ?? false,
    },
    resolver: zodResolver(rateFormSchema),
  })

  useEffect(() => {
    if (initialData) {
      reset({
        rating: initialData.rating ?? 5,
        content: initialData.content ?? '',
        visibility: initialData.visibility ?? VISIBILITY.PRIVATE,
        hasSpoiler: initialData.hasSpoiler ?? false,
      })
    }
  }, [reset, initialData])

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    const sameRating = initialData?.rating === values.rating
    const sameContent = initialData?.content === values.content
    const sameVisibility = initialData?.visibility === values.visibility
    const sameHasSpoiler = initialData?.hasSpoiler === values.hasSpoiler

    if (sameRating && sameContent && sameVisibility && sameHasSpoiler) {
      onClose()
      return
    }

    const content = values.content ? values.content.trim() : null

    try {
      await mutation.mutateAsync({
        mediaType: media.mediaType,
        externalId: media.externalId,
        rating: values.rating,
        content: values.content ? values.content.trim() : null,
        visibility: values.visibility,
        hasSpoiler: content ? values.hasSpoiler : false,
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
