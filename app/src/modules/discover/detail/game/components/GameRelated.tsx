import { useIntlayer } from 'react-intlayer'

import { MEDIA_TYPES } from '~/common/constants/media-type'

import { SimilarRow } from '../../shared'
import type { GameDetail, GameRelatedItem } from '../types/game-detail.types'
import { toSimilarItems } from '../utils/to-similar-items'

interface GameRelatedProps {
  game: GameDetail
}

export const GameRelated = ({ game }: GameRelatedProps) => {
  const content = useIntlayer('discover-detail')
  const sections: Array<{ title: string; items: GameRelatedItem[] }> = [
    ...(game.parentGame ? [{ title: content.baseGame.value, items: [game.parentGame] }] : []),
    { title: content.dlc.value, items: game.dlcs },
    { title: content.expansions.value, items: game.expansions },
    { title: content.standaloneExpansions.value, items: game.standaloneExpansions },
    { title: content.remakes.value, items: game.remakes },
    { title: content.remasters.value, items: game.remasters },
    { title: content.ports.value, items: game.ports },
  ]

  const visible = sections.filter((section) => section.items.length > 0)

  if (visible.length === 0) return null

  return (
    <div className="flex flex-col gap-8">
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
