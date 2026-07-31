import { Link } from '@tanstack/react-router'
import { CheckCircle, XCircle } from 'reicon-react'

import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

import type { AuthCallbackSearch } from '../schema/auth-callback.schema'

const ERROR_MESSAGES: Record<AuthCallbackSearch['status'], string> = {
  invalid_or_expired: 'The confirmation link is invalid or has expired. Please request a new one.',
  verified: 'Your email has been successfully verified. You can now sign in.',
}

interface AuthCallbackProps {
  status: AuthCallbackSearch['status']
}

export const AuthCallback = ({ status }: AuthCallbackProps) => {
  const message = ERROR_MESSAGES[status]
  const isSuccess = status === 'verified'
  const Icon = isSuccess ? CheckCircle : XCircle

  return (
    <div className="flex flex-col gap-4">
      <Alert variant={isSuccess ? 'success' : 'destructive'}>
        <Icon />
        <AlertTitle>{isSuccess ? 'Success' : 'Failed'}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <Button fullWidth variant="secondary" render={<Link to="/auth/login" />}>
        Back to sign in
      </Button>
    </div>
  )
}
