import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'
import { Compass, Search, Star } from 'reicon-react'

import { Button } from '~/common/ui/Button'

interface ReviewListEmptyProps {
  variant: 'archive' | 'search'
}

export const ReviewListEmpty = ({ variant }: ReviewListEmptyProps) => {
  const content = useIntlayer('review-list-empty')
  const shared = useIntlayer('shared')

  if (variant === 'search') {
    return (
      <div className="bg-card border-border flex flex-col items-center gap-3 rounded-xl border px-4 py-14 text-center">
        <span className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-lg">
          <Search className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="text-foreground font-semibold tracking-tight">{content.noMatches.value}</p>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            {content.noMatchesDescription.value}
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
        <p className="text-foreground font-semibold tracking-tight">{shared.noReviewsYet.value}</p>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
          {content.archiveDescription.value}
        </p>
      </div>
      <Button
        type="button"
        variant="default"
        startIcon={<Compass />}
        render={<Link to="/discover" />}
      >
        {shared.browseDiscover.value}
      </Button>
    </div>
  )
}
