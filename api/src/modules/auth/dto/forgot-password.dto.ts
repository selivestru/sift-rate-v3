import { IsEmail, IsString, Length } from 'class-validator'
import { ToLowerCase } from '~/common/decorators/lower-case.decorator'
import { StrongPassword } from '~/common/decorators/strong-password.decorator'
import { Trim } from '~/common/decorators/trim.decorator'

export class ForgotPasswordDto {
  @Trim()
  @ToLowerCase()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string
}

export class ResetPasswordVerifyDto {
  @Trim()
  @IsString({ message: 'token must be a string' })
  @Length(43, 43, { message: 'token must be 43 characters' })
  token!: string
}

export class ResetPasswordDto {
  @Trim()
  @IsString({ message: 'token must be a string' })
  @Length(43, 43, { message: 'token must be 43 characters' })
  token!: string

  @Trim()
  @IsString({ message: 'Password must be a string' })
  @StrongPassword()
  password!: string
}
