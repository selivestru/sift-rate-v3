import { MEDIA_TYPES } from '~/common/constants/media-type'

import { SimilarRow } from '../../shared'
import type { GameDetail, GameRelatedItem } from '../types/game-detail.types'
import { toSimilarItems } from '../utils/to-similar-items'

interface GameRelatedProps {
  game: GameDetail
}

export const GameRelated = ({ game }: GameRelatedProps) => {
  const sections: Array<{ title: string; items: GameRelatedItem[] }> = [
    ...(game.parentGame ? [{ title: 'Base game', items: [game.parentGame] }] : []),
    { title: 'DLC', items: game.dlcs },
    { title: 'Expansions', items: game.expansions },
    { title: 'Standalone expansions', items: game.standaloneExpansions },
    { title: 'Remakes', items: game.remakes },
    { title: 'Remasters', items: game.remasters },
    { title: 'Ports', items: game.ports },
  ]

  const visible = sections.filter((section) => section.items.length > 0)

  if (visible.length === 0) return null

  return (
    <div className="flex min-w-0 flex-col gap-8">
      {visible.map((section) => (
        <SimilarRow
          key={section.title}
          title={section.title}
          items={toSimilarItems(section.items)}
          mediaType={MEDIA_TYPES.GAME}
        />
      ))}
    </div>
  )
}
