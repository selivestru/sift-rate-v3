import { IsString } from 'class-validator'

export class SearchMediaQueryDto {
  @IsString()
  q!: string

  @IsString()
  page!: string
}
