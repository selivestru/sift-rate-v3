import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Button } from '~/common/ui/Button'
import { Spinner } from '~/common/ui/Spinner'
import { setStorageItem } from '~/common/utils/storage'

import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import { AuthFormAlert } from './AuthFormAlert'
import { AuthFormHeader } from './AuthFormHeader'

const ERROR_MESSAGES: Record<string, string> = {
  email_taken: 'This email is already registered. Sign in with your password instead.',
  google_auth_failed: 'Google sign-in failed. Please try again.',
  invalid_or_expired: 'Invalid or expired code.',
}

interface AuthCallbackProps {
  error?: string
}

export const AuthCallback = ({ error }: AuthCallbackProps) => {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    if (error) {
      return
    }

    const handleCallback = async () => {
      try {
        const response = await authApi.me()
        setUser(response.user)
        setStorageItem('has_session', true)
        navigate({ to: '/' })
      } catch {
        navigate({ to: '/auth/login' })
      }
    }

    handleCallback()
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <AuthFormHeader title="Sign in failed" subtitle="We couldn't sign you" />
        {ERROR_MESSAGES[error] && <AuthFormAlert message={ERROR_MESSAGES[error]} />}
        <Button fullWidth variant="secondary" className="h-11" render={<Link to="/auth/login" />}>
          Back to sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-40 items-center justify-center">
      <Spinner className="text-primary size-8" />
    </div>
  )
}
