import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'
import { Visibility } from '~/generated/prisma/enums'

export class UpsertRankedListDto {
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  title!: string

  @IsEnum(Visibility)
  visibility!: Visibility
}
