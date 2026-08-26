import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'
import { XCircle } from 'reicon-react'

import { useMediaTypeLabel } from '~/common/i18n'
import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

interface MovieDetailErrorProps {
  message?: string
  onRetry: () => void
}

export const MovieDetailError = ({ message, onRetry }: MovieDetailErrorProps) => {
  const content = useIntlayer('discover-detail')
  const shared = useIntlayer('shared')
  const media = useMediaTypeLabel('MOVIE')
  return (
    <div className="mx-auto flex w-fit max-w-sm flex-col gap-3 p-6">
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>{message ?? content.loadingError({ media })}</AlertTitle>
      </Alert>
      <Button fullWidth variant="secondary" onClick={onRetry}>
        {shared.retry.value}
      </Button>
      <Button fullWidth variant="outline" render={<Link to="/discover/movie" />}>
        {content.backToSearch({ media })}
      </Button>
    </div>
  )
}
