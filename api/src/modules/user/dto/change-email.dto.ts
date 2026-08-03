import { IsEmail, IsOptional, IsString, Matches } from 'class-validator'
import { Normalize } from '~/common/decorators/normalize.decorator'
import { Trim } from '~/common/decorators/trim.decorator'

export class ChangeEmailDto {
  @Normalize()
  @IsEmail({}, { message: 'email must be a valid email address' })
  newEmail!: string

  @Trim()
  @IsString({ message: 'Current password must be a string' })
  currentPassword!: string

  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Two-factor code must be 6 digits' })
  twoFactorCode?: string
}
