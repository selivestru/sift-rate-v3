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
} from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'
import { Visibility } from '~/generated/prisma/enums'

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

  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasSpoiler?: boolean
}
