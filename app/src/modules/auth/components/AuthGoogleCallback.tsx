import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { CheckCircle, XCircle } from 'reicon-react'

import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { Spinner } from '~/common/ui/Spinner'
import { setStorageItem } from '~/common/utils/storage'

import { authApi } from '../api/auth.api'
import type { AuthGoogleCallbackSearch } from '../schema/auth-callback.schema'
import { useAuthStore } from '../store/auth.store'

const ERROR_MESSAGES: Record<AuthGoogleCallbackSearch['status'], string> = {
  email_taken:
    'This email is already linked to an account. Try signing in again, or contact us if that wasn’t you.',
  google_auth_failed: 'Google sign-in failed. Please try again.',
  success: 'Google sign-in successful.',
}

interface AuthGoogleCallbackProps {
  status: AuthGoogleCallbackSearch['status']
}

export const AuthGoogleCallback = ({ status }: AuthGoogleCallbackProps) => {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  const message = ERROR_MESSAGES[status]
  const isSuccess = status === 'success'
  const Icon = isSuccess ? CheckCircle : XCircle

  useEffect(() => {
    if (!isSuccess) {
      return
    }

    const handleCallback = async () => {
      try {
        const response = await authApi.me()
        setUser(response.user)
        setStorageItem('has_session', true)
        navigate({ to: '/' })
      } catch {
        navigate({ to: '/auth' })
      }
    }

    handleCallback()
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <Alert variant={isSuccess ? 'success' : 'destructive'}>
          <Icon />
          <AlertTitle>{isSuccess ? 'Success' : 'Failed'}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <Button fullWidth variant="secondary" render={<Link to="/auth" />}>
          Back to sign in
        </Button>
      </div>
    )
  }

  return <Spinner className="text-primary size-8" />
}
