import { Star } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { formatDate } from '~/common/utils/formatDate'

import type { GameDetail } from '../types/game-detail.types'

interface GameHeroBackdropProps {
  game: GameDetail
  showAlt: boolean
}

export const GameHeroBackdrop = ({ game, showAlt }: GameHeroBackdropProps) => {
  const accent = mediaTypeMeta[MEDIA_TYPES.GAME].color

  return (
    <div className="relative min-h-56 overflow-hidden rounded-t-2xl sm:min-h-72">
      {game.heroImageUrl ? (
        <>
          <img
            src={game.heroImageUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: [
                `radial-gradient(ellipse 70% 55% at 88% 12%, color-mix(in oklab, ${accent} 22%, transparent), transparent 62%)`,
                'linear-gradient(90deg, color-mix(in oklab, var(--background) 78%, transparent) 0%, color-mix(in oklab, var(--background) 35%, transparent) 42%, transparent 68%)',
                'linear-gradient(180deg, color-mix(in oklab, var(--background) 25%, transparent) 0%, color-mix(in oklab, var(--background) 15%, transparent) 35%, color-mix(in oklab, var(--background) 55%, transparent) 72%, var(--background) 100%)',
              ].join(', '),
            }}
          />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: [
              `radial-gradient(ellipse 80% 70% at 70% 20%, color-mix(in oklab, ${accent} 28%, transparent), transparent 55%)`,
              `linear-gradient(145deg, color-mix(in oklab, ${accent} 16%, var(--background)), var(--background))`,
            ].join(', '),
          }}
        />
      )}

      <div className="relative z-10 flex min-h-56 flex-col justify-end p-5 pb-16 sm:min-h-72 sm:p-6 sm:pb-20">
        <div className="flex max-w-xl min-w-0 flex-col gap-2.5">
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: accent }}>
            Game
          </span>

          <div className="flex flex-col gap-1">
            <h1 className="text-foreground text-3xl leading-[1.1] font-bold text-balance sm:text-[2.5rem]">
              {game.title}
            </h1>
            {showAlt && (
              <p className="text-muted-foreground line-clamp-1 text-sm text-pretty italic">
                {game.alternativeName}
              </p>
            )}
          </div>

          {(game.year || game.releaseDate) && (
            <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              {game.year && <span className="tabular-nums">{game.year}</span>}
              {game.releaseDate && (
                <>
                  {game.year && (
                    <span className="opacity-40" aria-hidden>
                      ·
                    </span>
                  )}
                  <span className="text-xs">{formatDate(game.releaseDate)}</span>
                </>
              )}
            </div>
          )}

          {game.igdbRating > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="border-foreground/10 bg-background/40 flex items-center gap-1 rounded-full border px-2 py-0.5 backdrop-blur-md"
                title={
                  game.igdbRatingCount > 0
                    ? `${game.igdbRatingCount.toLocaleString()} IGDB ratings`
                    : 'IGDB rating'
                }
              >
                <Star weight="Filled" className="stroke-rating size-3.5" aria-hidden />
                <span className="text-foreground text-xs font-semibold tabular-nums">
                  {game.igdbRating.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-[10px]">IGDB</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
