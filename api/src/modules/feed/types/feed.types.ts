import { PaginationCursorResponse } from '~/common/types/pagination-cursor.types'
import { Author } from '~/common/types/user.types'
import { Media, Review } from '~/generated/prisma/client'

export type FeedItem = Review & { user: Author; media: Media }

export type FeedResponse = PaginationCursorResponse<FeedItem>
