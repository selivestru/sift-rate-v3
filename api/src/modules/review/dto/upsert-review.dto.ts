import { Transform, Type } from 'class-transformer'
import { IsEnum, IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'
import { Content } from '~/common/decorators/content.decorator'
import { Trim } from '~/common/decorators/trim.decorator'
import { MediaType } from '~/generated/prisma/enums'
import { transformMediaTypeSlug } from '~/modules/media/types/media.types'

export class UpsertReviewDto {
  @Transform(transformMediaTypeSlug)
  @IsEnum(MediaType)
  mediaType!: MediaType

  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  externalId!: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  rating!: number

  @Content({ optional: true })
  content!: string | null
}
