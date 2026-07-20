import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string

  @IsString({ message: 'password must be a string' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(64, { message: 'password must be at most 64 characters' })
  password!: string
}
