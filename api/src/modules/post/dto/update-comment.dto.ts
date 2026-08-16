import { COMMENT_MAX_LENGTH } from './create-comment.dto'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'

export class UpdateCommentDto {
  @Trim()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(COMMENT_MAX_LENGTH)
  content?: string
}
