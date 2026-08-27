import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'

import { FeedService } from '../feed/feed.service'
import { FeedResponse } from '../feed/types/feed.types'
import { ReviewActivity, ReviewStats, UserProfile } from './types/user-profile.types'
import type { Request, Response } from 'express'
import sharp from 'sharp'
import { CURRENT_YEAR } from '~/common/constants/common'
import { REDIS_KEYS } from '~/common/constants/redis-keys'
import { normalize } from '~/common/utils/normalize'
import { omit } from '~/common/utils/omit'
import { safeUser } from '~/common/utils/safeUser'
import { MediaType, Prisma, User } from '~/generated/prisma/client'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { RedisService } from '~/infrastructure/redis/redis.service'
import { S3Service } from '~/infrastructure/s3/s3.service'
import { SessionService } from '~/modules/session/session.service'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
    @Inject(forwardRef(() => FeedService))
    private readonly feedService: FeedService,
    private readonly redis: RedisService,
    private readonly s3: S3Service,
  ) {}

  async getUserProfile(username: string): Promise<UserProfile> {
    const user = await this.findByUsername(username)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const [ratingDistribution, reviewStats, activityYears] = await Promise.all([
      this.getUserRatingDistribution(user.id),
      this.getUserReviewStats(user.id),
      this.getUserActivityYears(user.id),
    ])

    return {
      user: omit(safeUser(user), ['email', 'createdAt']),
      ratingDistribution,
      reviewStats,
      activityYears,
    }
  }

  async getUserActivity(username: string, year: number): Promise<ReviewActivity[]> {
    const user = await this.findByUsername(username)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.getReviewActivity(user.id, year)
  }

  getUserFeed(username: string, cursor?: string): Promise<FeedResponse> {
    return this.feedService.getUserFeed(username, cursor)
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: normalize(email) } })
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username: normalize(username) } })
  }

  createGoogleUser(data: {
    email: string
    displayName: string | null
    avatarUrl: string | null
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: normalize(data.email),
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
      },
    })
  }

  updateDisplayName(userId: string, displayName: string): Promise<Pick<User, 'displayName'>> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { displayName },
      select: { displayName: true },
    })
  }

  updateUsername(userId: string, username: string): Promise<Pick<User, 'username'>> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { username: normalize(username) },
      select: { username: true },
    })
  }

  async updateAvatar(userId: string, file?: Express.Multer.File): Promise<Pick<User, 'avatarUrl'>> {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      throw new BadRequestException('File must be a JPEG, PNG, or WebP image')
    }

    let optimized: Buffer

    try {
      const image = sharp(file.buffer)
      const metadata = await image.metadata()

      if (!['jpeg', 'png', 'webp'].includes(metadata.format ?? '')) {
        throw new BadRequestException('File must be a JPEG, PNG, or WebP image')
      }

      optimized = await image
        .rotate()
        .resize({ width: 300, height: 300, fit: 'cover', position: 'centre' })
        .webp({ quality: 100 })
        .toBuffer()
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }

      throw new BadRequestException('Invalid image')
    }

    const randomId = crypto.randomUUID().replace(/-/g, '')
    const key = `avatars/${randomId}.webp`

    await this.s3.putObject({
      key,
      body: optimized,
      contentType: 'image/webp',
    })

    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: this.s3.buildPublicUrl(key) },
      select: { avatarUrl: true },
    })
  }

  async deleteAccount(req: Request, res: Response, userId: string): Promise<void> {
    await this.findById(userId)
    await this.prisma.user.delete({ where: { id: userId } })
    await this.sessionService.destroyAllForUser(userId)
    await this.redis.del(REDIS_KEYS.USER_SESSIONS(userId))

    if (req.session?.userId === userId) {
      await this.sessionService.revokeCurrent(req, res)
    }

    this.logger.log({ userId }, 'Account deleted')
  }

  private async getUserActivityYears(userId: string): Promise<number[]> {
    const rows = await this.prisma.$queryRaw<{ year: number }[]>(Prisma.sql`
      SELECT DISTINCT EXTRACT(YEAR FROM r."createdAt")::int AS year
      FROM "Review" r
      WHERE r."userId" = ${userId}
      ORDER BY year DESC
    `)

    if (rows.length === 0) {
      return []
    }

    const firstYear = rows[rows.length - 1].year
    const years: number[] = []

    for (let year = CURRENT_YEAR; year >= firstYear; year--) {
      years.push(year)
    }

    return years
  }

  private async getUserRatingDistribution(userId: string): Promise<Record<string, number>> {
    const ratings = await this.prisma.review.findMany({
      where: { userId },
      select: { rating: true },
    })

    const ratingDistribution = Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [String(i + 1), 0]),
    )

    for (const { rating } of ratings) {
      ratingDistribution[rating]++
    }

    return ratingDistribution
  }

  private async getUserReviewStats(userId: string): Promise<ReviewStats> {
    const rows = await this.prisma.$queryRaw<{ mediaType: MediaType; count: bigint }[]>(Prisma.sql`
      SELECT
        m."mediaType",
        COUNT(*)::bigint AS count
      FROM "Review" r
      JOIN "Media" m ON m.id = r."mediaId"
      WHERE r."userId" = ${userId}
      GROUP BY m."mediaType"
    `)

    const byMediaType = Object.values(MediaType).reduce(
      (acc, type) => {
        acc[type] = 0
        return acc
      },
      {} as Record<MediaType, number>,
    )

    let total = 0

    for (const { mediaType, count } of rows) {
      const value = Number(count)
      byMediaType[mediaType] = value
      total += value
    }

    return { total, byMediaType }
  }

  private getReviewActivity(userId: string, year: number): Promise<ReviewActivity[]> {
    return this.prisma.$queryRaw<ReviewActivity[]>(Prisma.sql`
      SELECT
        TO_CHAR(DATE(r."createdAt"), 'YYYY-MM-DD') AS date,
        COUNT(*)::int AS count
      FROM "Review" r
      WHERE
        r."userId" = ${userId}
        AND r."createdAt" >= make_date(${year}, 1, 1)
        AND r."createdAt" < make_date(${year} + 1, 1, 1)
      GROUP BY DATE(r."createdAt")
      ORDER BY DATE(r."createdAt");
    `)
  }
}
