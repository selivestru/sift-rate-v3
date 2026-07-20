import type { MediaSimilarItem } from '../../shared'
import type { BookRelatedItem } from '../types/book-detail.types'

export const toSimilarItems = (items: BookRelatedItem[]): MediaSimilarItem[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    year: item.year,
    posterUrl: item.coverUrl,
    rating: item.rating ?? 0,
  }))
