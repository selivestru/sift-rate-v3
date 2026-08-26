import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useIntlayer } from 'react-intlayer'
import { CheckCircle, XCircle } from 'reicon-react'

import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { Spinner } from '~/common/ui/Spinner'
import { setStorageItem } from '~/common/utils/storage'

import { authApi } from '../api/auth.api'
import type { AuthGoogleCallbackSearch } from '../schema/auth-callback.schema'
import { useAuthStore } from '../store/auth.store'

interface AuthGoogleCallbackProps {
  status: AuthGoogleCallbackSearch['status']
}

export const AuthGoogleCallback = ({ status }: AuthGoogleCallbackProps) => {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const content = useIntlayer('auth-google-callback')
  const shared = useIntlayer('shared')

  const message = {
    email_taken: content.emailAlreadyLinked.value,
    google_auth_failed: content.googleSignInFailed.value,
    success: content.googleSignInSuccessful.value,
  }[status]
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
          <AlertTitle>{isSuccess ? content.success.value : content.failed.value}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <Button fullWidth variant="secondary" render={<Link to="/auth" />}>
          {content.backToSignIn({ signIn: shared.signIn.value })}
        </Button>
      </div>
    )
  }

  return <Spinner className="text-primary size-8" />
}
