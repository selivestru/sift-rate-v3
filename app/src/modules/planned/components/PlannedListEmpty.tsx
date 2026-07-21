import { Link } from '@tanstack/react-router'
import { CompassIcon } from 'lucide-react'

import { Button } from '~/common/ui/Button'

export const PlannedListEmpty = () => {
  return (
    <div className="bg-surface/50 border-border/50 flex flex-col items-center gap-4 rounded-2xl border px-4 py-14 text-center">
      <div className="flex flex-col gap-1.5">
        <p className="text-foreground font-semibold tracking-tight">Nothing planned yet</p>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
          Save media you want to watch, play, read, or listen to. It will show up here as your
          backlog.
        </p>
      </div>
      <Button variant="secondary" render={<Link to="/discover" />} startIcon={<CompassIcon />}>
        Browse Discover
      </Button>
    </div>
  )
}
