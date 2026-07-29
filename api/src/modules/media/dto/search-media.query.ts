import { IsString, Matches } from 'class-validator'
import { Trim } from '~/common/decorators/trim.decorator'

export class SearchMediaQueryDto {
  @Trim()
  @IsString()
  q!: string

  @Trim()
  @IsString()
  @Matches(/^[1-9]\d*$/, {
    message: 'page must be a positive integer',
  })
  page!: string
}
