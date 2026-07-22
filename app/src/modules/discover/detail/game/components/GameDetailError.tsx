import { Link } from '@tanstack/react-router'
import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

interface GameDetailErrorProps {
  message?: string
  onRetry: () => void
}

export const GameDetailError = ({
  message = 'Something went wrong while loading this game. Try again.',
  onRetry,
}: GameDetailErrorProps) => {
  return (
    <div className="mx-auto flex w-fit max-w-sm flex-col gap-3 p-6">
      <Alert variant="danger">
        <XCircle />
        <AlertTitle>{message}</AlertTitle>
      </Alert>
      <Button fullWidth variant="secondary" onClick={onRetry}>
        Retry
      </Button>
      <Button fullWidth variant="outline" render={<Link to="/discover/game" />}>
        Back to game search
      </Button>
    </div>
  )
}
