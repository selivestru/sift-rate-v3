import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'

import { mediaTypeMeta } from '~/common/constants/media-type'
import { useMediaTypeLabel } from '~/common/i18n'
import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

interface GameDetailNotFoundProps {
  externalId?: string
}

export const GameDetailNotFound = ({ externalId }: GameDetailNotFoundProps) => {
  const content = useIntlayer('discover-detail')
  const media = useMediaTypeLabel('GAME')
  const MediaTypeIcon = mediaTypeMeta.GAME.icon

  return (
    <div className="mx-auto flex w-fit max-w-sm flex-col gap-3 p-6">
      <Alert>
        <MediaTypeIcon />
        <AlertTitle>{content.unavailable({ media })}</AlertTitle>
        <AlertDescription>
          {content.unavailableDescription.value}
          {externalId && (
            <span className="mt-1 block text-xs tabular-nums opacity-70">ID: {externalId}</span>
          )}
        </AlertDescription>
      </Alert>
      <Button fullWidth variant="secondary" render={<Link to="/discover/game" />}>
        {content.searchMedia({ media })}
      </Button>
    </div>
  )
}
