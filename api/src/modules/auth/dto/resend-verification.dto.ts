import { IsEmail } from 'class-validator'
import { ToLowerCase } from '~/common/decorators/lower-case.decorator'
import { Trim } from '~/common/decorators/trim.decorator'

export class ResendVerificationDto {
  @Trim()
  @ToLowerCase()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string
}
