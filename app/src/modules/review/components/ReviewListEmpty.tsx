import { Link } from '@tanstack/react-router'
import { Compass, Search, Star } from 'reicon-react'

import { Button } from '~/common/ui/Button'

interface ReviewListEmptyProps {
  variant: 'archive' | 'search'
}

export const ReviewListEmpty = ({ variant }: ReviewListEmptyProps) => {
  if (variant === 'search') {
    return (
      <div className="bg-card border-border flex flex-col items-center gap-3 rounded-xl border px-4 py-14 text-center">
        <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-lg">
          <Search className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="text-foreground font-semibold tracking-tight">No matches</p>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Nothing in your archive matches this search. Try another title or keyword.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border-border flex flex-col items-center gap-4 rounded-xl border px-4 py-14 text-center">
      <span className="bg-accent text-primary flex size-11 items-center justify-center rounded-lg">
        <Star className="size-5" aria-hidden />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="text-foreground font-semibold tracking-tight">No reviews yet</p>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
          Your rated media will live here as a personal archive. Rate something in Discover to
          start.
        </p>
      </div>
      <Button
        type="button"
        variant="default"
        startIcon={<Compass />}
        render={<Link to="/discover" />}
      >
        Browse Discover
      </Button>
    </div>
  )
}
