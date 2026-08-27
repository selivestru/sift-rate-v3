import { Transform, Type } from 'class-transformer'
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator'
import { CURRENT_YEAR, MIN_YEAR } from '~/common/constants/common'
import { Trim } from '~/common/decorators/trim.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'
import { MediaType } from '~/generated/prisma/enums'
import { transformMediaTypeSlug } from '~/modules/media/types/media.types'

export const REVIEW_SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
} as const

export type ReviewSort = (typeof REVIEW_SORT)[keyof typeof REVIEW_SORT]

export class ReviewsQueryDto extends PaginationCursor {
  @Trim()
  @IsOptional()
  @MinLength(1)
  @MaxLength(128)
  q?: string

  @Transform(transformMediaTypeSlug)
  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number

  @Type(() => Number)
  @ValidateIf(
    (query: { year?: number; month?: number }) =>
      query.year !== undefined || query.month !== undefined,
  )
  @IsDefined()
  @IsInt()
  @Min(MIN_YEAR)
  @Max(CURRENT_YEAR)
  year?: number

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number

  @IsOptional()
  @IsEnum(REVIEW_SORT)
  sort?: ReviewSort
}

export class ReviewsStatsQueryDto {
  @Type(() => Number)
  @ValidateIf(
    (query: { year?: number; month?: number }) =>
      query.year !== undefined || query.month !== undefined,
  )
  @IsDefined()
  @IsInt()
  @Min(MIN_YEAR)
  @Max(CURRENT_YEAR)
  year?: number

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number
}
