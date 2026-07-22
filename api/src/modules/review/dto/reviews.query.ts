import { Transform, Type } from 'class-transformer'
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'
import { MediaType } from '~/generated/prisma/enums'
import { transformMediaTypeSlug } from '~/modules/media/types/media.types'

export const REVIEW_SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
} as const

export type ReviewSort = (typeof REVIEW_SORT)[keyof typeof REVIEW_SORT]

export class ReviewsQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(512)
  cursor?: string

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

  @IsOptional()
  @IsEnum(REVIEW_SORT)
  sort?: ReviewSort
}
