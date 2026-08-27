import { Type } from 'class-transformer'
import { IsInt, Max, Min } from 'class-validator'
import { CURRENT_YEAR, MIN_YEAR } from '~/common/constants/common'

export class UserActivityQuery {
  @Type(() => Number)
  @IsInt()
  @Min(MIN_YEAR)
  @Max(CURRENT_YEAR)
  year!: number
}
