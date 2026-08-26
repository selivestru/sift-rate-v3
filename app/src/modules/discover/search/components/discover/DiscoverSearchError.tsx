import { useIntlayer } from 'react-intlayer'
import { XCircle } from 'reicon-react'

import { Alert, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

interface DiscoverSearchErrorProps {
  message?: string
  onRetry: () => void
}

export const DiscoverSearchError = ({ message, onRetry }: DiscoverSearchErrorProps) => {
  const content = useIntlayer('discover-search-ui')
  const shared = useIntlayer('shared')
  return (
    <div className="mx-auto flex w-fit max-w-sm flex-col gap-3">
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>{message ?? content.searchError.value}</AlertTitle>
      </Alert>
      <Button fullWidth variant="secondary" onClick={onRetry}>
        {shared.retry.value}
      </Button>
    </div>
  )
}
