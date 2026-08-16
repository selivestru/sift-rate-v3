import { IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'

export const COMMENT_MAX_LENGTH = 1000

export class CreateCommentDto {
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(COMMENT_MAX_LENGTH)
  content!: string
}
