import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'

export class ReviewsQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(512)
  cursor?: string

  @Trim()
  @IsOptional()
  @MinLength(1)
  @MaxLength(128)
  q?: string
}
