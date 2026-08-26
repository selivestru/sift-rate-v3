import { useIntlayer } from 'react-intlayer'

import { MEDIA_TYPES } from '~/common/constants/media-type'

import { SimilarRow } from '../../shared'
import type { BookRelatedItem } from '../types/book-detail.types'
import { toSimilarItems } from '../utils/to-similar-items'

interface BookMoreByAuthorProps {
  author: string
  items: BookRelatedItem[]
}

export const BookMoreByAuthor = ({ author, items }: BookMoreByAuthorProps) => {
  const content = useIntlayer('discover-detail')
  if (!author || items.length === 0) return null

  return (
    <SimilarRow
      title={content.moreBy({ author })}
      mediaType={MEDIA_TYPES.BOOK}
      items={toSimilarItems(items)}
    />
  )
}
