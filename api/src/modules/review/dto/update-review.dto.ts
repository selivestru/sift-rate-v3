import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'

export class UpdateReviewDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number

  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  content?: string | null
}
