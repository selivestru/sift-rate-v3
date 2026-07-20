import { Link } from '@tanstack/react-router'
import { Gamepad2Icon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'

interface GameDetailNotFoundProps {
  externalId?: string
}

export const GameDetailNotFound = ({ externalId }: GameDetailNotFoundProps) => {
  return (
    <div className="mx-auto flex w-fit max-w-sm flex-col gap-3 p-6">
      <Alert>
        <Gamepad2Icon />
        <AlertTitle>This game isn&apos;t available</AlertTitle>
        <AlertDescription>
          It may have been removed from the catalog, or the link is outdated.
          {externalId && (
            <span className="mt-1 block text-xs tabular-nums opacity-70">ID: {externalId}</span>
          )}
        </AlertDescription>
      </Alert>
      <Button fullWidth variant="secondary" render={<Link to="/discover/game" />}>
        Search games
      </Button>
    </div>
  )
}
