import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator'
import { MediaType, Visibility } from '~/generated/prisma/enums'
import { transformMediaTypeSlug } from '~/modules/media/types/media.types'

export class UpsertReviewDto {
  @Transform(transformMediaTypeSlug)
  @IsEnum(MediaType)
  mediaType!: MediaType

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  externalId!: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  rating!: number

  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(1000)
  content!: string | null

  @IsEnum(Visibility)
  visibility!: Visibility

  @Type(() => Boolean)
  @IsBoolean()
  hasSpoiler!: boolean
}
