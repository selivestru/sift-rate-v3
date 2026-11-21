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
  review: Review | null,
  seasonNumber: number | null,
  onClose: () => void,
) => {
  const mutation = useUpsertReviewMutation()
  const [serverError, setServerError] = useState<string | null>(null)

  const { handleSubmit, reset, setError, watch, ...form } = useForm<RateFormValues>({
    defaultValues: {
      rating: review?.rating ?? 5,
      content: review?.content ?? '',
    },
    resolver: zodResolver(rateFormSchema),
  })

  const reviewId = review?.id ?? null
  const reviewRating = review?.rating ?? null
  const reviewContent = review?.content ?? null
  const defaultRating = reviewRating ?? 5
  const defaultContent = reviewContent ?? ''

  useEffect(() => {
    reset({
      rating: review?.rating ?? 5,
      content: review?.content ?? '',
    })
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, reviewId, seasonNumber, reviewRating, reviewContent])

  const current = watch()
  const isDirty =
    (current.rating ?? 5) !== defaultRating || (current.content ?? '') !== defaultContent

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    const content = values.content?.trim()

    const sameRating = review?.rating === values.rating
    const sameContent = review?.content === content

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
        seasonNumber: seasonNumber ?? undefined,
        previousReview: review ? { id: review.id, rating: review.rating } : null,
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

  const resetForm = () => {
    reset({
      rating: defaultRating,
      content: defaultContent,
    })
    setServerError(null)
  }

  return {
    onSubmit,
    isLoading: mutation.isPending,
    reset,
    isDirty,
    resetForm,
    serverError,
    setError,
    ...form,
  }
}
