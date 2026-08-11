import { Controller, Delete, Get, Param, Post } from '@nestjs/common'

import { FollowService } from './follow.service'
import { CurrentUser } from '~/common/decorators/current-user.decorator'

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

  @Get('following')
  getFollowing(@CurrentUser('userId') userId: string) {
    return this.followService.getFollowing(userId)
  }

  @Get('followers')
  getFollowers(@CurrentUser('userId') userId: string) {
    return this.followService.getFollowers(userId)
  }
}
