import type { ResponseWithCursor } from '~/common/types/response-with-cursor.types'
import type { Post } from '~/modules/post'

export type FeedResponse = ResponseWithCursor<Post>
