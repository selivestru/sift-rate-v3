import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'

interface AuthFormAlertProps {
  message: string
}

export const AuthFormAlert = ({ message }: AuthFormAlertProps) => {
  return (
    <Alert variant="destructive">
      <XCircle />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  )
}
