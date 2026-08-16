import { PaginationCursorResponse } from '~/common/types/pagination-cursor.types'
import { PostItem } from '~/modules/post/types/post.types'

export type FeedItem = PostItem

export type FeedResponse = PaginationCursorResponse<FeedItem>
