import { Link } from '@tanstack/react-router'
import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

interface AlbumDetailErrorProps {
  message?: string
  onRetry: () => void
}

export const AlbumDetailError = ({
  message = 'Something went wrong while loading this album. Try again.',
  onRetry,
}: AlbumDetailErrorProps) => {
  return (
    <div className="mx-auto flex w-fit max-w-sm flex-col gap-3 p-6">
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>{message}</AlertTitle>
      </Alert>
      <Button fullWidth variant="secondary" onClick={onRetry}>
        Retry
      </Button>
      <Button fullWidth variant="outline" render={<Link to="/discover/album" />}>
        Back to album search
      </Button>
    </div>
  )
}
