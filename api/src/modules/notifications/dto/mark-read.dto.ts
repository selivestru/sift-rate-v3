import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator'

export class MarkReadDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('7', { each: true })
  notificationIds: string[]
}
