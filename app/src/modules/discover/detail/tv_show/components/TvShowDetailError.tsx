import { Link } from '@tanstack/react-router'
import { CircleXIcon } from 'lucide-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

interface TvShowDetailErrorProps {
  message?: string
  onRetry: () => void
}

export const TvShowDetailError = ({
  message = 'Something went wrong while loading this series. Try again.',
  onRetry,
}: TvShowDetailErrorProps) => {
  return (
    <div className="mx-auto flex w-fit max-w-sm flex-col gap-3 p-6">
      <Alert variant="danger">
        <CircleXIcon />
        <AlertTitle>{message}</AlertTitle>
      </Alert>
      <Button fullWidth variant="secondary" onClick={onRetry}>
        Retry
      </Button>
      <Button fullWidth variant="outline" render={<Link to="/discover/tv_show" />}>
        Back to TV search
      </Button>
    </div>
  )
}
