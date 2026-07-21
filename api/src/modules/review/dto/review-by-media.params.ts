import { Transform } from 'class-transformer'
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator'
import { MediaType } from '~/generated/prisma/enums'
import { transformMediaTypeSlug } from '~/modules/media/types/media.types'

export class ReviewByMediaParamsDto {
  @Transform(transformMediaTypeSlug)
  @IsEnum(MediaType)
  mediaType!: MediaType

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  externalId!: string
}
