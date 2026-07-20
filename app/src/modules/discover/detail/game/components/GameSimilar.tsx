import { MEDIA_TYPES } from '~/common/constants/media-type'

import { SimilarRow } from '../../shared'
import type { GameRelatedItem } from '../types/game-detail.types'
import { toSimilarItems } from '../utils/to-similar-items'

interface GameSimilarProps {
  items: GameRelatedItem[]
}

export const GameSimilar = ({ items }: GameSimilarProps) => {
  if (items.length === 0) return null

  return (
    <SimilarRow title="Similar games" mediaType={MEDIA_TYPES.GAME} items={toSimilarItems(items)} />
  )
}
