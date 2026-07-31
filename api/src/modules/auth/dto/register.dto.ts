import { USERNAME_REGEX } from '../constants/validation'
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { Normalize } from '~/common/decorators/normalize.decorator'
import { StrongPassword } from '~/common/decorators/strong-password.decorator'
import { Trim } from '~/common/decorators/trim.decorator'

export class RegisterDto {
  @Normalize()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string

  @Trim()
  @IsString({ message: 'Display name must be a string' })
  @MinLength(2, { message: 'Display name must be at least 2 characters' })
  @MaxLength(50, { message: 'Display name must be at most 50 characters' })
  displayName!: string

  @Normalize()
  @IsString({ message: 'Username must be a string' })
  @MinLength(4, { message: 'Username must be at least 4 characters' })
  @MaxLength(25, { message: 'Username must be at most 25 characters' })
  @Matches(USERNAME_REGEX, {
    message: 'Username may only contain letters, numbers, and underscores',
  })
  username!: string

  @Trim()
  @IsString({ message: 'Password must be a string' })
  @StrongPassword()
  password!: string
}
