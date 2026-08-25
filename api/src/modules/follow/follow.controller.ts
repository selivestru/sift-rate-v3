import { Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common'

import { FollowService } from './follow.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'
import { PaginationCursor } from '~/common/types/pagination-cursor.types'

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':userId')
  follow(@CurrentUser('userId') currentUserId: string, @Param('userId') targetUserId: string) {
    return this.followService.follow(currentUserId, targetUserId)
  }

  @Delete(':userId')
  unfollow(@CurrentUser('userId') userId: string, @Param('userId') targetUserId: string) {
    return this.followService.unfollow(userId, targetUserId)
  }

  @Get('requests')
  getFollowRequests(@CurrentUser('userId') userId: string, @Query() query: PaginationCursor) {
    return this.followService.getFollowRequests(userId, query.cursor)
  }

  @Get('requests/count')
  getFollowRequestsCount(@CurrentUser('userId') userId: string) {
    return this.followService.getFollowRequestsCount(userId)
  }

  @Post('requests/:userId/accept')
  @HttpCode(204)
  acceptFollowRequest(@CurrentUser('userId') userId: string, @Param('userId') followerId: string) {
    return this.followService.acceptFollowRequest(userId, followerId)
  }

  @Delete('requests/:userId')
  @HttpCode(204)
  rejectFollowRequest(@CurrentUser('userId') userId: string, @Param('userId') followerId: string) {
    return this.followService.rejectFollowRequest(userId, followerId)
  }
}
