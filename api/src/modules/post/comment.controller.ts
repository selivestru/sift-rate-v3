import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'

import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { OptionalAuth } from '~/common/decorators/optional-auth.decorator'
import { OptionalCurrentUser } from '~/common/decorators/optional-current-user.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @OptionalAuth()
  @Get(':id/replies')
  listReplies(
    @Param('id') id: string,
    @Query() query?: PaginationCursor,
    @OptionalCurrentUser('userId') userId?: string,
  ) {
    return this.commentService.listReplies(id, query?.cursor, userId)
  }

  @Post(':id/replies')
  createReply(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.createReply(id, userId, dto)
  }

  @Patch(':id')
  updateComment(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(id, userId, dto)
  }

  @Delete(':id')
  deleteComment(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.commentService.deleteComment(id, userId)
  }

  @Post(':id/like')
  likeComment(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.commentService.likeComment(id, userId)
  }

  @Delete(':id/like')
  unlikeComment(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.commentService.unlikeComment(id, userId)
  }
}
