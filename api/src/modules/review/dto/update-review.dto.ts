import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator'
import { ReviewVisibility } from '~/generated/prisma/enums'

export class UpdateReviewDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number

  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(1000)
  content?: string | null

  @IsOptional()
  @IsEnum(ReviewVisibility)
  visibility?: ReviewVisibility

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasSpoiler?: boolean
}
