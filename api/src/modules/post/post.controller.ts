import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'

import { CreatePostDto } from './dto/create-post.dto'
import { ListRepliesQueryDto } from './dto/list-replies.query'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostService } from './post.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { OptionalAuth } from '~/common/decorators/optional-auth.decorator'
import { OptionalCurrentUser } from '~/common/decorators/optional-current-user.decorator'

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @OptionalAuth()
  @Get(':id')
  getPostById(@Param('id') id: string, @OptionalCurrentUser('userId') userId?: string) {
    return this.postService.getPostById(id, userId)
  }

  @OptionalAuth()
  @Get(':id/replies')
  listReplies(
    @Param('id') id: string,
    @Query() query: ListRepliesQueryDto,
    @OptionalCurrentUser('userId') userId?: string,
  ) {
    return this.postService.listReplies(id, query, userId)
  }

  @Post()
  createPost(@CurrentUser('userId') userId: string, @Body() dto: CreatePostDto) {
    return this.postService.createPost(userId, dto)
  }

  @Post(':id/replies')
  createReply(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.postService.createReply(id, userId, dto)
  }

  @Patch(':id')
  updatePost(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, userId, dto)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.postService.deletePost(id, userId)
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
