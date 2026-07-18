import { CircleXIcon } from 'lucide-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

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
      <Alert variant="danger">
        <CircleXIcon />
        <AlertTitle>{message}</AlertTitle>
      </Alert>
      <Button variant="secondary" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}
