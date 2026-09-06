import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import type { MediaRef } from '~/common/types/media-ref.types'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { rateFormSchema, type RateFormValues } from '../schema/rate.schema'
import { type Review } from '../types/review.types'
import { dateKeyToISOStartOfDayUTC, toDateKey, todayKey } from '../utils/review-date'
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
      createdAt: initialData ? toDateKey(initialData.createdAt) : todayKey(),
    },
    resolver: zodResolver(rateFormSchema),
  })

  useEffect(() => {
    if (initialData) {
      reset({
        rating: initialData.rating ?? 5,
        content: initialData.content ?? '',
        createdAt: toDateKey(initialData.createdAt),
      })
    }
  }, [reset, initialData])

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    const content = values.content?.trim()
    const initialKey = initialData ? toDateKey(initialData.createdAt) : todayKey()
    const createdAtKey = values.createdAt ?? initialKey

    const sameRating = initialData?.rating === values.rating
    const sameContent = initialData?.content === content
    const sameDate = createdAtKey === initialKey

    if (sameRating && sameContent && sameDate) {
      onClose()
      return
    }

    try {
      await mutation.mutateAsync({
        mediaType: media.mediaType,
        externalId: media.externalId,
        rating: values.rating,
        content: content && content.length > 0 ? content : null,
        createdAt: sameDate ? undefined : dateKeyToISOStartOfDayUTC(createdAtKey),
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
