import {
  PASSWORD_DIGIT,
  PASSWORD_LOWER,
  PASSWORD_SPECIAL,
  PASSWORD_UPPER,
  USERNAME_REGEX,
} from '../constants/validation'
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string

  @IsString({ message: 'Display name must be a string' })
  @MinLength(2, { message: 'Display name must be at least 2 characters' })
  @MaxLength(50, { message: 'Display name must be at most 50 characters' })
  displayName!: string

  @IsString({ message: 'Username must be a string' })
  @MinLength(4, { message: 'Username must be at least 4 characters' })
  @MaxLength(25, { message: 'Username must be at most 25 characters' })
  @Matches(USERNAME_REGEX, {
    message: 'Username may only contain letters, numbers, and underscores',
  })
  username!: string

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(64, { message: 'Password must be at most 64 characters' })
  @Matches(PASSWORD_LOWER, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(PASSWORD_UPPER, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(PASSWORD_DIGIT, {
    message: 'Password must contain at least one digit',
  })
  @Matches(PASSWORD_SPECIAL, {
    message: 'Password must contain at least one special character',
  })
  password!: string
}
