import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator'
import { MediaType } from '~/generated/prisma/enums'

export class AddPlannedItemDto {
  @IsEnum(MediaType)
  mediaType!: MediaType

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  externalId!: string
}
