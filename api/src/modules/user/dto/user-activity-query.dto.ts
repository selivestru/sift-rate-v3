import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'
import { CURRENT_YEAR } from '~/common/constants/common'

export class UserActivityQuery {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(2026)
  @Max(CURRENT_YEAR)
  year: number = CURRENT_YEAR
}
