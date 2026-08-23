import { IsBoolean } from 'class-validator'

export class UpdatePrivacyDto {
  @IsBoolean({ message: 'isPrivate must be a boolean' })
  isPrivate!: boolean
}
