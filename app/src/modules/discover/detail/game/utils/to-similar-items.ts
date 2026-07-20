import type { MediaSimilarItem } from '../../shared'
import type { GameRelatedItem } from '../types/game-detail.types'

export const toSimilarItems = (items: GameRelatedItem[]): MediaSimilarItem[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    year: item.year,
    posterUrl: item.coverUrl,
    rating: item.rating,
  }))
