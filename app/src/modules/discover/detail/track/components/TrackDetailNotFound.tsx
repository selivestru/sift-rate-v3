import { Link } from '@tanstack/react-router'

import { mediaTypeMeta } from '~/common/constants/media-type'
import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

interface TrackDetailNotFoundProps {
  externalId?: string
}

export const TrackDetailNotFound = ({ externalId }: TrackDetailNotFoundProps) => {
  const MediaTypeIcon = mediaTypeMeta.TRACK.icon

  return (
    <div className="mx-auto flex w-fit max-w-sm flex-col gap-3 p-6">
      <Alert>
        <MediaTypeIcon />
        <AlertTitle>This track isn&apos;t available</AlertTitle>
        <AlertDescription>
          It may have been removed from the catalog, or the link is outdated.
          {externalId && (
            <span className="mt-1 block text-xs tabular-nums opacity-70">ID: {externalId}</span>
          )}
        </AlertDescription>
      </Alert>
      <Button fullWidth variant="secondary" render={<Link to="/discover/track" />}>
        Search tracks
      </Button>
    </div>
  )
}
