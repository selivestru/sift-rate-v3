import { IsOptional, IsString, Matches } from 'class-validator'
import { StrongPassword } from '~/common/decorators/strong-password.decorator'
import { Trim } from '~/common/decorators/trim.decorator'

export class ChangePasswordDto {
  @Trim()
  @IsString({ message: 'Current password must be a string' })
  currentPassword!: string

  @Trim()
  @IsString({ message: 'New password must be a string' })
  @StrongPassword()
  newPassword!: string

  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Two-factor code must be 6 digits' })
  twoFactorCode?: string
}
