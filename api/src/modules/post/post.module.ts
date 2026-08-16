import { Module } from '@nestjs/common'

import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
  controllers: [PostController, CommentController],
  providers: [PostService, CommentService],
})
export class PostModule {}
