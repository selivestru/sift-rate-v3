import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { VISIBILITY } from '~/modules/review'

import {
  upsertRankedListSchema,
  type UpsertRankedListFormValues,
} from '../schema/upsert-ranked-list.schema'
import type { RankedListItem } from '../types/ranked-list.types'
import { useCreateRankedList } from './useCreateRankedList'
import { useUpdateRankedList } from './useUpdateRankedList'

const UPSERT_FIELDS = ['title', 'visibility'] as const

interface UseUpsertRankedListFormOptions {
  list?: RankedListItem | null
  onClose: () => void
}

export const useUpsertRankedListForm = ({ list, onClose }: UseUpsertRankedListFormOptions) => {
  const createMutation = useCreateRankedList(onClose)
  const updateMutation = useUpdateRankedList(onClose)

  const [serverError, setServerError] = useState<string | null>(null)

  const isEdit = !!list

  const { handleSubmit, reset, setError, ...form } = useForm<UpsertRankedListFormValues>({
    defaultValues: {
      title: list?.title ?? '',
      visibility: list?.visibility ?? VISIBILITY.PRIVATE,
    },
    resolver: zodResolver(upsertRankedListSchema),
  })

  useEffect(() => {
    reset({
      title: list?.title ?? '',
      visibility: list?.visibility ?? VISIBILITY.PRIVATE,
    })
  }, [list, reset])

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    if (isEdit && list) {
      if (list.title === values.title && list.visibility === values.visibility) {
        onClose()
        return
      }
    }

    try {
      if (isEdit && list) {
        await updateMutation.mutateAsync({
          listId: list.id,
          title: values.title,
          visibility: values.visibility,
        })
      } else {
        await createMutation.mutateAsync({
          title: values.title,
          visibility: values.visibility,
        })
      }

      onClose()
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: UPSERT_FIELDS,
      })
    }
  })

  return {
    ...form,
    reset,
    onSubmit,
    serverError,
    isLoading: createMutation.isPending || updateMutation.isPending,
    isEdit,
  }
}
