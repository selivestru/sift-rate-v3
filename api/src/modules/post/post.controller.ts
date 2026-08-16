import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'

import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { PostService } from './post.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { OptionalAuth } from '~/common/decorators/optional-auth.decorator'
import { OptionalCurrentUser } from '~/common/decorators/optional-current-user.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @OptionalAuth()
  @Get(':id')
  getPostById(@Param('id') id: string, @OptionalCurrentUser('userId') userId?: string) {
    return this.postService.getPostById(id, userId)
  }

  @OptionalAuth()
  @Get(':id/comments')
  listComments(
    @Param('id') id: string,
    @Query() query?: PaginationCursor,
    @OptionalCurrentUser('userId') userId?: string,
  ) {
    return this.postService.listComments(id, query?.cursor, userId)
  }

  @Post(':id/comments')
  createComment(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.createComment(id, userId, dto)
  }

  @Post(':id/like')
  likePost(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.postService.likePost(id, userId)
  }

  @Delete(':id/like')
  unlikePost(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.postService.unlikePost(id, userId)
  }
}
