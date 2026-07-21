import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class ReviewsQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(512)
  cursor?: string
}
