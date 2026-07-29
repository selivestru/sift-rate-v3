import { transformMediaTypeSlug } from '../types/media.types'
import { Transform } from 'class-transformer'
import { IsEnum, IsString } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'
import { MediaType } from '~/generated/prisma/enums'

export class MediaByIdParamsDto {
  @Transform(transformMediaTypeSlug)
  @IsEnum(MediaType)
  mediaType!: MediaType

  @Trim()
  @IsString()
  externalId!: string
}
