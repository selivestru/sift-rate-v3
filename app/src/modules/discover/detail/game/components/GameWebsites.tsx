import { ExternalLinkIcon, Gamepad2Icon, GlobeIcon, ShoppingBagIcon, VideoIcon } from 'lucide-react'

import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

import type { GameWebsite, GameWebsiteKind } from '../types/game-detail.types'

interface GameWebsitesProps {
  websites: GameWebsite[]
  className?: string
}

const iconFor = (kind: GameWebsiteKind) => {
  if (kind === 'youtube' || kind === 'twitch') return VideoIcon
  if (kind === 'official') return GlobeIcon
  if (
    kind === 'steam' ||
    kind === 'epic' ||
    kind === 'gog' ||
    kind === 'itch' ||
    kind === 'store'
  ) {
    return ShoppingBagIcon
  }
  return ExternalLinkIcon
}

export const GameWebsites = ({ websites, className }: GameWebsitesProps) => {
  if (websites.length === 0) return null

  return (
    <section className={cn('min-w-0', className)} aria-labelledby="websites-heading">
      <div className="mb-3 flex items-center gap-2">
        <Gamepad2Icon className="text-muted-foreground size-4" aria-hidden />
        <h2 id="websites-heading" className="text-foreground text-lg font-semibold">
          Where to play
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
                className="min-h-11 gap-2"
                render={<a href={site.url} target="_blank" rel="noopener noreferrer" />}
              >
                <Icon className="size-3.5 shrink-0" aria-hidden />
                {site.label}
                <ExternalLinkIcon
                  className="text-muted-foreground size-3 shrink-0 opacity-70"
                  aria-hidden
                />
              </Button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
