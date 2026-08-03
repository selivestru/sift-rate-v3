import { Link } from '@tanstack/react-router'
import { CheckCircle, XCircle } from 'reicon-react'

import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

import type { AuthCallbackSearch } from '../schema/auth-callback.schema'

const MESSAGES: Record<AuthCallbackSearch['status'], string> = {
  invalid_or_expired: 'The confirmation link is invalid or has expired. Please request a new one.',
  verified: 'Your email has been successfully verified. You can now sign in.',
  email_changed: 'Your email address has been changed. You can now sign in with your new address.',
  email_change_failed:
    'The email change link is invalid or has expired, or the new email is already in use. Please request a new change.',
}

const SUCCESS_STATUSES: AuthCallbackSearch['status'][] = ['verified', 'email_changed']

interface AuthCallbackProps {
  status: AuthCallbackSearch['status']
}

export const AuthCallback = ({ status }: AuthCallbackProps) => {
  const message = MESSAGES[status]
  const isSuccess = SUCCESS_STATUSES.includes(status)
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
