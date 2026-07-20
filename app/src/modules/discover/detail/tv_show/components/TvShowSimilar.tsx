import { MEDIA_TYPES } from '~/common/constants/media-type'

import { SimilarRow } from '../../shared'
import type { TvShowSimilarItem } from '../types/tv-show-detail.types'

interface TvShowSimilarProps {
  items: TvShowSimilarItem[]
}

export const TvShowSimilar = ({ items }: TvShowSimilarProps) => {
  if (items.length === 0) return null

  return <SimilarRow title="You might also like" mediaType={MEDIA_TYPES.TV_SHOW} items={items} />
}
