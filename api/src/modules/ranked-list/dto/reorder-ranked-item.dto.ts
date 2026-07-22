import { IsInt, IsPositive } from 'class-validator'

export class ReorderRankedItemDto {
  @IsInt()
  @IsPositive()
  position!: number
}
