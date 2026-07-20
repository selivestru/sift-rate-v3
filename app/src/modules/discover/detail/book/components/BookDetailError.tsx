import { Link } from '@tanstack/react-router'
import { CircleXIcon } from 'lucide-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

interface BookDetailErrorProps {
  message?: string
  onRetry: () => void
}

export const BookDetailError = ({
  message = 'Something went wrong while loading this book. Try again.',
  onRetry,
}: BookDetailErrorProps) => {
  return (
    <div className="mx-auto flex w-fit max-w-sm flex-col gap-3 p-6">
      <Alert variant="danger">
        <CircleXIcon />
        <AlertTitle>{message}</AlertTitle>
      </Alert>
      <Button fullWidth variant="secondary" onClick={onRetry}>
        Retry
      </Button>
      <Button fullWidth variant="outline" render={<Link to="/discover/book" />}>
        Back to book search
      </Button>
    </div>
  )
}
