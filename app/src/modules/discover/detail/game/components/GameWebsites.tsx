import { useIntlayer } from 'react-intlayer'
import { Globe, Link6, ShoppingBag, Video } from 'reicon-react'

import { mediaTypeMeta } from '~/common/constants/media-type'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

import type { GameWebsite, GameWebsiteKind } from '../types/game-detail.types'

interface GameWebsitesProps {
  websites: GameWebsite[]
  className?: string
}

const iconFor = (kind: GameWebsiteKind) => {
  if (kind === 'youtube' || kind === 'twitch') return Video
  if (kind === 'official') return Globe
  if (
    kind === 'steam' ||
    kind === 'epic' ||
    kind === 'gog' ||
    kind === 'itch' ||
    kind === 'store'
  ) {
    return ShoppingBag
  }
  return Link6
}

export const GameWebsites = ({ websites, className }: GameWebsitesProps) => {
  const content = useIntlayer('discover-detail')
  const MediaTypeIcon = mediaTypeMeta.GAME.icon

  if (websites.length === 0) return null

  return (
    <section className={cn('', className)} aria-labelledby="websites-heading">
      <div className="mb-3 flex items-center gap-2">
        <MediaTypeIcon className="text-muted-foreground size-4" aria-hidden />
        <h2 id="websites-heading" className="text-foreground text-lg font-semibold">
          {content.whereToPlay.value}
        </h2>
      </div>

      <ul className="flex flex-wrap gap-2">
        {websites.map((site) => {
          const Icon = iconFor(site.kind)
          return (
            <li key={site.url}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                render={<a href={site.url} target="_blank" rel="noopener noreferrer" />}
              >
                <Icon className="size-3.5 shrink-0" aria-hidden />
                {site.label}
                <Link6 className="text-muted-foreground size-3 shrink-0 opacity-70" aria-hidden />
              </Button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
