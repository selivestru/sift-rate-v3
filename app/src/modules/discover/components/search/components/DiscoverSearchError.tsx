import { Alert, Button } from '@heroui/react'

interface DiscoverSearchErrorProps {
  message?: string
  onRetry: () => void
}

export const DiscoverSearchError = ({
  message = 'Something went wrong while searching. Try again.',
  onRetry,
}: DiscoverSearchErrorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Alert status="danger">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{message}</Alert.Title>
        </Alert.Content>
      </Alert>
      <Button variant="secondary" className="w-fit" onPress={onRetry}>
        Retry
      </Button>
    </div>
  )
}
