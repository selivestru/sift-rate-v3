import { Link } from '@tanstack/react-router'
import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

interface MovieDetailErrorProps {
  message?: string
  onRetry: () => void
}

export const MovieDetailError = ({
  message = 'Something went wrong while loading this movie. Try again.',
  onRetry,
}: MovieDetailErrorProps) => {
  return (
    <div className="mx-auto flex w-fit max-w-sm flex-col gap-3 p-6">
      <Alert variant="danger">
        <XCircle />
        <AlertTitle>{message}</AlertTitle>
      </Alert>
      <Button fullWidth variant="secondary" onClick={onRetry}>
        Retry
      </Button>
      <Button fullWidth variant="outline" render={<Link to="/discover/movie" />}>
        Back to movie search
      </Button>
    </div>
  )
}
