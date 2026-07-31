import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { getApiError } from '~/common/api'
import { applyApiFormError } from '~/common/utils/applyApiFormError'
import { objectKeys } from '~/common/utils/typedObject'

import { loginSchema, type LoginInput } from '../schema/auth.schema'
import { useLoginMutation } from './useLoginMutation'
import { useResendVerificationMutation } from './useResendVerificationMutation'

export const useLoginForm = () => {
  const loginMutation = useLoginMutation()
  const resendMutation = useResendVerificationMutation()

  const [serverError, setServerError] = useState<string | null>(null)
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false)
  const [resendDialogOpen, setResendDialogOpen] = useState(false)
  const resendEmailRef = useRef<string | null>(null)
  const cooldownUntilRef = useRef<number | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
  } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const onResend = async () => {
    if (!resendEmailRef.current) return
    if (cooldownUntilRef.current && cooldownUntilRef.current > Date.now()) return

    try {
      const data = await resendMutation.mutateAsync({ email: resendEmailRef.current })
      cooldownUntilRef.current = Date.now() + data.retryAfter * 1000
    } catch {}
  }

  const onResendClose = () => {
    setResendDialogOpen(false)
    resendMutation.reset()
    setTimeout(() => {
      resendEmailRef.current = null
    }, 200)
  }

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)

    try {
      await loginMutation.mutateAsync(data)
    } catch (error) {
      const apiError = await getApiError(error)

      if (apiError.code === 'EMAIL_NOT_VERIFIED') {
        resendEmailRef.current = data.email
        setResendDialogOpen(true)
        return
      }

      if (apiError.code === 'TWO_FACTOR_REQUIRED') {
        setTwoFactorDialogOpen(true)
        return
      }

      if (apiError.code === 'INVALID_TWO_FACTOR_CODE') {
        setServerError('Invalid two-factor code')
        return
      }

      applyApiFormError({
        apiError,
        setError,
        setServerError,
        fields: objectKeys(loginSchema.shape),
      })
    }
  }

  const onSubmitWithTwoFactor = async (code: string) => {
    setValue('twoFactorCode', code)
    handleSubmit(onSubmit)()
  }

  return {
    register,
    errors,
    onSubmit: handleSubmit(onSubmit),
    isLoading: loginMutation.isPending,
    serverError,
    setValue,
    twoFactorState: {
      isOpen: twoFactorDialogOpen,
      onClose: () => {
        setTwoFactorDialogOpen(false)
        setValue('twoFactorCode', undefined)
      },
      onSubmit: onSubmitWithTwoFactor,
    },
    resendState: {
      isOpen: resendDialogOpen,
      email: resendEmailRef.current,
      isLoading: resendMutation.isPending,
      result: resendMutation.data,
      error: resendMutation.isError ? 'Failed to resend verification email' : null,
      cooldownSeconds: cooldownUntilRef.current
        ? Math.max(0, Math.ceil((cooldownUntilRef.current - Date.now()) / 1000))
        : 0,
      onResend,
      onClose: onResendClose,
    },
  }
}
