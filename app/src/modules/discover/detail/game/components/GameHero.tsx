import { Gamepad2Icon } from 'lucide-react'

import { mediaTypeMeta, MEDIA_TYPES } from '~/common/constants/media-type'

import { MediaCoverLightbox } from '../../shared'
import type { GameDetail } from '../types/game-detail.types'
import { GameHeroBackdrop } from './GameHeroBackdrop'
import { GameHeroMeta } from './GameHeroMeta'

interface GameHeroProps {
  game: GameDetail
}

export const GameHero = ({ game }: GameHeroProps) => {
  const accent = mediaTypeMeta[MEDIA_TYPES.GAME].color
  const showAlt =
    Boolean(game.alternativeName) &&
    game.alternativeName.trim().toLowerCase() !== game.title.trim().toLowerCase()

  return (
    <div className="relative min-w-0 overflow-x-clip">
      <GameHeroBackdrop game={game} showAlt={showAlt} />

      <div className="relative z-10 -mt-12 flex min-w-0 flex-col gap-4 px-5 sm:-mt-14 sm:flex-row sm:items-start sm:gap-4 sm:px-6">
        <div
          className="bg-muted ring-foreground/10 relative aspect-2/3 w-32 shrink-0 overflow-hidden rounded-xl ring-1 sm:w-40"
          style={{
            boxShadow: `0 24px 48px -16px color-mix(in oklab, ${accent} 35%, transparent), 0 12px 24px -8px rgb(0 0 0 / 0.45)`,
          }}
        >
          <MediaCoverLightbox
            src={game.coverUrl}
            alt={game.title}
            priority
            width={320}
            height={480}
            fallback={
              <div className="flex size-full items-center justify-center">
                <Gamepad2Icon className="text-muted-foreground size-10" aria-hidden />
              </div>
            }
          />
        </div>

        <GameHeroMeta game={game} />
      </div>
    </div>
  )
}
