import { Trim } from '../decorators/trim.decorator'
import { IsOptional, IsUUID } from 'class-validator'

export class PaginationCursor {
  @Trim()
  @IsOptional()
  @IsUUID('7', { message: 'Cursor must be a valid UUID' })
  cursor?: string
}
