import { IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'
import { USERNAME_REGEX } from '~/modules/auth/constants/validation'

export class UpdateUsernameDto {
  @Trim()
  @IsString({ message: 'Username must be a string' })
  @MinLength(4, { message: 'Username must be at least 4 characters' })
  @MaxLength(25, { message: 'Username must be at most 25 characters' })
  @Matches(USERNAME_REGEX, {
    message: 'Username may only contain letters, numbers, and underscores',
  })
  username!: string
}
