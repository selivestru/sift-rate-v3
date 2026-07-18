import { CircleXIcon } from 'lucide-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'

interface AuthFormAlertProps {
  message: string
}

export const AuthFormAlert = ({ message }: AuthFormAlertProps) => {
  return (
    <Alert variant="danger">
      <CircleXIcon />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  )
}
