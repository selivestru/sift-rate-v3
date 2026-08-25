import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import {
  upsertRankedListSchema,
  type UpsertRankedListFormValues,
} from '../schema/upsert-ranked-list.schema'
import type { RankedListItem } from '../types/ranked-list.types'
import { useCreateRankedList } from './useCreateRankedList'
import { useUpdateRankedList } from './useUpdateRankedList'

interface UseUpsertRankedListFormOptions {
  list?: RankedListItem | null
  onClose: () => void
}

export const useUpsertRankedListForm = ({ list, onClose }: UseUpsertRankedListFormOptions) => {
  const createMutation = useCreateRankedList()
  const updateMutation = useUpdateRankedList()

  const [serverError, setServerError] = useState<string | null>(null)

  const isEdit = !!list

  const { handleSubmit, reset, setError, ...form } = useForm<UpsertRankedListFormValues>({
    defaultValues: {
      title: list?.title ?? '',
    },
    resolver: zodResolver(upsertRankedListSchema),
  })

  useEffect(() => {
    reset({
      title: list?.title ?? '',
    })
  }, [list, reset])

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)

    if (isEdit && list) {
      if (list.title === values.title) {
        onClose()
        return
      }
    }

    try {
      if (isEdit && list) {
        await updateMutation.mutateAsync({
          listId: list.id,
          title: values.title,
        })
      } else {
        await createMutation.mutateAsync({
          title: values.title,
        })
      }

      onClose()
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(upsertRankedListSchema.shape),
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
