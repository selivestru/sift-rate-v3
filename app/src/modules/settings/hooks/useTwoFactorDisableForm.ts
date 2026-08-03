import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'
import { twoFactorCodeFormSchema, type TwoFactorCodeFormInput } from '~/modules/user'

import { useTwoFactorDisableMutation } from './useTwoFactorDisableMutation'

export const useTwoFactorDisableForm = () => {
  const [serverError, setServerError] = useState<string | null>(null)

  const twoFactorDisable = useTwoFactorDisableMutation()

  const { handleSubmit, setError, ...form } = useForm<TwoFactorCodeFormInput>({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(twoFactorCodeFormSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    if (twoFactorDisable.isPending) return

    setServerError(null)

    try {
      await twoFactorDisable.mutateAsync(data.code)
    } catch (error) {
      const apiError = await getApiError(error)
      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(twoFactorCodeFormSchema.shape),
      })
    }
  })

  return { onSubmit, ...form, isLoading: twoFactorDisable.isPending, serverError }
}
