import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'

import { UserService } from '../user/user.service'
import { FeedResponse } from './types/feed.types'
import { AUTHOR_SELECT } from '~/common/constants/author-select'
import { DEFAULT_PAGE_SIZE } from '~/common/constants/pagination'
import { MediaLanguage } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { MediaService } from '~/modules/media/media.service'

@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly mediaService: MediaService,
  ) {}

  async getFeed(language: MediaLanguage, cursor?: string): Promise<FeedResponse> {
    return this.fetchReviews(language, cursor)
  }

  async getUserFeed(
    username: string,
    language: MediaLanguage,
    cursor?: string,
  ): Promise<FeedResponse> {
    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.fetchReviews(language, cursor, user.id)
  }

  private async fetchReviews(
    language: MediaLanguage,
    cursor?: string,
    userId?: string,
  ): Promise<FeedResponse> {
    const reviews = await this.prisma.review.findMany({
      where: userId ? { userId } : undefined,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: DEFAULT_PAGE_SIZE + 1,
      include: { user: { select: AUTHOR_SELECT }, media: true },
    })

    const hasNextPage = reviews.length > DEFAULT_PAGE_SIZE

    if (hasNextPage) {
      reviews.pop()
    }

    const data = await this.mediaService.localizeMediaRelations(reviews, language)

    return {
      data,
      nextCursor: hasNextPage ? data[data.length - 1].id : null,
    }
  }
}
