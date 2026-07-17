import { Alert } from '@heroui/react'

interface AuthFormAlertProps {
  message: string
}

export const AuthFormAlert = ({ message }: AuthFormAlertProps) => {
  return (
    <Alert status="danger">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{message}</Alert.Title>
      </Alert.Content>
    </Alert>
  )
}
