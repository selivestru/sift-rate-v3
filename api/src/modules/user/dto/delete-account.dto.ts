import { IsOptional, IsString, Matches } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'

export class DeleteAccountDto {
  @IsOptional()
  @Trim()
  @IsString({ message: 'Password must be a string' })
  password?: string

  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Two-factor code must be 6 digits' })
  twoFactorCode?: string
}
