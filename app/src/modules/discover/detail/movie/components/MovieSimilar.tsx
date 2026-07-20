import { MEDIA_TYPES } from '~/common/constants/media-type'

import { SimilarRow } from '../../shared'
import type { MovieSimilarItem } from '../types/movie-detail.types'

interface MovieSimilarProps {
  items: MovieSimilarItem[]
}

export const MovieSimilar = ({ items }: MovieSimilarProps) => {
  if (items.length === 0) return null

  return <SimilarRow title="You might also like" mediaType={MEDIA_TYPES.MOVIE} items={items} />
}
