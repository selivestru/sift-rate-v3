import { useState } from 'react'

import { MEDIA_TYPES } from '~/common/constants/media-type'
import { Badge } from '~/common/ui/Badge'
import { cn } from '~/common/utils/cn'

import { MediaStateButtons } from '../../shared/components/MediaStateButtons'
import type { GameDetail } from '../types/game-detail.types'

interface GameHeroMetaProps {
  game: GameDetail
}

const GENRE_PREVIEW = 4
const PLATFORM_PREVIEW = 8

export const GameHeroMeta = ({ game }: GameHeroMetaProps) => {
  const [summaryExpanded, setSummaryExpanded] = useState(false)
  const summaryLong = game.summary.length > 200
  const genrePreview = game.genres.slice(0, GENRE_PREVIEW)
  const platformPreview = game.platforms.slice(0, PLATFORM_PREVIEW)
  const hasStudio = game.developers.length > 0 || game.publishers.length > 0

  return (
    <div className="bg-card ring-border flex-1 rounded-2xl p-3.5 ring-1 sm:p-4">
      <div className="flex flex-col gap-3">
        <MediaStateButtons externalId={game.id} mediaType={MEDIA_TYPES.GAME} />

        {hasStudio && (
          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-1.5">
            {game.developers.length > 0 && (
              <div className="">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Developer
                </p>
                <p className="text-foreground text-sm text-pretty">
                  {game.developers.slice(0, 2).join(', ')}
                </p>
              </div>
            )}
            {game.publishers.length > 0 && (
              <div className="">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Publisher
                </p>
                <p className="text-foreground text-sm text-pretty">
                  {game.publishers.slice(0, 2).join(', ')}
                </p>
              </div>
            )}
          </div>
        )}

        {genrePreview.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {genrePreview.map((genre) => (
              <Badge key={genre}>{genre}</Badge>
            ))}
            {game.genres.length > genrePreview.length && (
              <span className="text-muted-foreground self-center text-[11px]">
                +{game.genres.length - genrePreview.length}
              </span>
            )}
          </div>
        )}

        {platformPreview.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {platformPreview.map((platform) => (
              <span
                key={platform.name}
                title={platform.name}
                className={cn(
                  'inline-flex min-h-8 items-center rounded-lg px-2.5 text-[11px] font-semibold tracking-wide uppercase',
                  'bg-muted text-foreground ring-1 ring-border',
                  'transition-[transform,background-color,box-shadow] duration-300',
                )}
              >
                {platform.abbreviation || platform.name}
              </span>
            ))}
            {game.platforms.length > platformPreview.length && (
              <span className="text-muted-foreground self-center text-[11px]">
                +{game.platforms.length - platformPreview.length}
              </span>
            )}
          </div>
        )}

        {game.summary && (
          <div>
            <p
              className={cn(
                'text-sm leading-relaxed text-pretty text-muted-foreground',
                !summaryExpanded && summaryLong && 'line-clamp-3',
              )}
            >
              {game.summary}
            </p>
            {summaryLong && !summaryExpanded && (
              <button
                type="button"
                onClick={() => setSummaryExpanded(true)}
                className="text-foreground mt-1 cursor-pointer text-xs font-medium underline-offset-2 hover:underline"
              >
                Show more
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
