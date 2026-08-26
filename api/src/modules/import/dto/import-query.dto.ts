import { IsEnum, IsOptional } from 'class-validator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'
import { ImportRowStatus } from '~/generated/prisma/enums'

export class ImportHistoryQueryDto extends PaginationCursor {}

export class ImportRowsQueryDto extends PaginationCursor {
  @IsOptional()
  @IsEnum(ImportRowStatus)
  status?: ImportRowStatus
}
