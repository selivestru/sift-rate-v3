import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { twoFactorCodeSchema, type TwoFactorCodeInput } from '../schema/settings.schema'
import { useTwoFactorEnableMutation } from './useTwoFactorEnableMutation'

export const useTwoFactorEnableForm = () => {
  const [serverError, setServerError] = useState<string | null>(null)

  const twoFactorEnable = useTwoFactorEnableMutation()

  const { handleSubmit, setError, ...form } = useForm<TwoFactorCodeInput>({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(twoFactorCodeSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    if (twoFactorEnable.isPending) return

    setServerError(null)

    try {
      await twoFactorEnable.mutateAsync(data.code)
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(twoFactorCodeSchema.shape),
      })
    }
  })

  return { onSubmit, ...form, isLoading: twoFactorEnable.isPending, serverError }
}
