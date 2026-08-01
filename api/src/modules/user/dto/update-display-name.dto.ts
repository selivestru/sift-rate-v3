import { IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'

export class UpdateDisplayNameDto {
  @Trim()
  @IsString({ message: 'Display name must be a string' })
  @MinLength(2, { message: 'Display name must be at least 2 characters' })
  @MaxLength(50, { message: 'Display name must be at most 50 characters' })
  displayName!: string
}
