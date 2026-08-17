import { IsEnum, IsOptional } from 'class-validator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'

export const REPLIES_SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
} as const

export type RepliesSort = (typeof REPLIES_SORT)[keyof typeof REPLIES_SORT]

export class ListRepliesQueryDto extends PaginationCursor {
  @IsOptional()
  @IsEnum(REPLIES_SORT)
  sort?: RepliesSort
}
