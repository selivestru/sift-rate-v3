import { USERNAME_REGEX } from '../constants/validation'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { Normalize } from '~/common/decorators/normalize.decorator'

export class CompleteProfileDto {
  @Normalize()
  @IsString({ message: 'Username must be a string' })
  @MinLength(4, { message: 'Username must be at least 4 characters' })
  @MaxLength(25, { message: 'Username must be at most 25 characters' })
  @Matches(USERNAME_REGEX, {
    message: 'Username may only contain letters, numbers, and underscores',
  })
  username!: string
}
