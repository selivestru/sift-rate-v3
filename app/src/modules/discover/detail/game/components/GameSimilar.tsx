import { useIntlayer } from 'react-intlayer'

import { MEDIA_TYPES } from '~/common/constants/media-type'

import { SimilarRow } from '../../shared'
import type { GameRelatedItem } from '../types/game-detail.types'
import { toSimilarItems } from '../utils/to-similar-items'

interface GameSimilarProps {
  items: GameRelatedItem[]
}

export const GameSimilar = ({ items }: GameSimilarProps) => {
  const content = useIntlayer('discover-detail')
  if (items.length === 0) return null

  return (
    <SimilarRow
      title={content.similarGames.value}
      mediaType={MEDIA_TYPES.GAME}
      items={toSimilarItems(items)}
    />
  )
}
