import { transformMediaTypeSlug } from '../types/media.types'
import { Transform } from 'class-transformer'
import { IsEnum, IsString } from 'class-validator'
import { MediaType } from '~/generated/prisma/enums'

export class MediaByIdParamsDto {
  @Transform(transformMediaTypeSlug)
  @IsEnum(MediaType)
  mediaType!: MediaType

  @IsString()
  id!: string
}
