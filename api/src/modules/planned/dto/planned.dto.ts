import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'
import { MediaType } from '~/generated/prisma/enums'

export class AddPlannedItemDto {
  @IsEnum(MediaType)
  mediaType!: MediaType

  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  externalId!: string
}
