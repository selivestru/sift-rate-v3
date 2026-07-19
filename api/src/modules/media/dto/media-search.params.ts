import { transformMediaTypeSlug } from '../types/media.types'
import { Transform } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { MediaType } from '~/generated/prisma/enums'

export class MediaTypeParamsDto {
  @Transform(transformMediaTypeSlug)
  @IsEnum(MediaType)
  mediaType!: MediaType
}
