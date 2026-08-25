import { InjectQueue } from '@nestjs/bullmq'
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { FeedService } from '../feed/feed.service'
import { FeedResponse } from '../feed/types/feed.types'
import { FollowService } from '../follow/follow.service'
import { FollowUserListResponse } from '../follow/types/follow.types'
import { ChangeEmailDto } from './dto/change-email.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { DeleteAccountDto } from './dto/delete-account.dto'
import { ReviewActivity, ReviewStats, UserProfile } from './types/user-profile.types'
import { argon2id, hash, verify } from 'argon2'
import { Queue } from 'bullmq'
import type { Request, Response } from 'express'
import { createHash, randomBytes } from 'node:crypto'
import { REDIS_KEYS } from '~/common/constants/redis-keys'
import { normalize } from '~/common/utils/normalize'
import { omit } from '~/common/utils/omit'
import { safeUser } from '~/common/utils/safeUser'
import { AuthMethod, MediaType, NotificationType, Prisma, User } from '~/generated/prisma/client'
import { FollowStatus } from '~/generated/prisma/enums'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'
import { RedisService } from '~/infrastructure/redis/redis.service'
import {
  ACCOUNT_DELETED_JOB,
  DELETE_ACCOUNT_JOB,
  EMAIL_CHANGE_CONFIRM_JOB,
  EMAIL_CHANGE_NOTIFY_JOB,
  EMAIL_QUEUE,
  PASSWORD_CHANGED_JOB,
} from '~/infrastructure/resend/constants/email-queue'
import { NotificationsService } from '~/modules/notifications/notifications.service'
import { SessionService } from '~/modules/session/session.service'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  private readonly EMAIL_CHANGE_TTL = 86_400
  private readonly DELETE_ACCOUNT_TTL = 900

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionService: SessionService,
    @Inject(forwardRef(() => FeedService))
    private readonly feedService: FeedService,
    @Inject(forwardRef(() => FollowService))
    private readonly followService: FollowService,
    private readonly redis: RedisService,
    private readonly notificationsService: NotificationsService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  async getUserProfile(username: string, viewerId?: string): Promise<UserProfile> {
    const user = await this.findByUsername(username)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const omitUser = omit(safeUser(user), [
      'email',
      'isVerified',
      'method',
      'twoFactorEnabled',
      'createdAt',
    ])
    const [followersCount, followingCount, followStatus] = await Promise.all([
      this.prisma.follow.count({
        where: { followingId: user.id, status: FollowStatus.ACCEPTED },
      }),
      this.prisma.follow.count({
        where: { followerId: user.id, status: FollowStatus.ACCEPTED },
      }),
      viewerId
        ? this.followService.getFollowStatus(viewerId, user.id)
        : Promise.resolve({ followStatus: 'NONE' as const }),
    ])

    const canSeeContent =
      !user.isPrivate ||
      viewerId === user.id ||
      followStatus.followStatus === 'FOLLOWING' ||
      followStatus.followStatus === 'MUTUAL'

    const [ratingDistribution, reviewStats] = canSeeContent
      ? await Promise.all([
          this.getUserRatingDistribution(user.id),
          this.getUserReviewStats(user.id),
        ])
      : [null, null]

    const userProfile: UserProfile = {
      user: omitUser,
      ratingDistribution,
      reviewStats,
      followersCount,
      followingCount,
      followStatus: followStatus.followStatus,
    }

    return userProfile
  }

  async getUserActivity(username: string, year: number): Promise<ReviewActivity[]> {
    const user = await this.findByUsername(username)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.getReviewActivity(user.id, year)
  }

  getUserFeed(username: string, userId?: string, cursor?: string): Promise<FeedResponse> {
    return this.feedService.getUserFeed(username, userId, cursor)
  }

  async getFollowing(
    username: string,
    viewerId?: string,
    cursor?: string,
  ): Promise<FollowUserListResponse> {
    const user = await this.findByUsername(username)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.followService.getFollowUsers(user.id, viewerId, 'following', cursor)
  }

  async getFollowers(
    username: string,
    viewerId?: string,
    cursor?: string,
  ): Promise<FollowUserListResponse> {
    const user = await this.findByUsername(username)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.followService.getFollowUsers(user.id, viewerId, 'followers', cursor)
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: normalize(email) },
    })
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username: normalize(username) },
    })
  }

  createUser(data: {
    email: string
    displayName: string
    username: string
    passwordHash: string
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: normalize(data.email),
        username: normalize(data.username),
        displayName: data.displayName,
        passwordHash: data.passwordHash,
        method: AuthMethod.CREDENTIALS,
      },
    })
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
        method: AuthMethod.GOOGLE,
        isVerified: true,
      },
    })
  }

  verifyUser(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    })
  }

  updateTwoFactor(
    userId: string,
    data: Pick<Prisma.UserUpdateInput, 'twoFactorEnabled' | 'twoFactorSecret'>,
  ): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    })
  }

  updatePasswordHash(userId: string, passwordHash: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })
  }

  updateEmail(userId: string, email: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { email: normalize(email) },
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

  async updatePrivacy(userId: string, isPrivate: boolean): Promise<Pick<User, 'isPrivate'>> {
    if (!isPrivate) {
      await this.prisma.follow.updateMany({
        where: { followingId: userId, status: FollowStatus.PENDING },
        data: { status: FollowStatus.ACCEPTED },
      })
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { isPrivate },
      select: { isPrivate: true },
    })
  }

  async changePassword(
    userId: string,
    currentSid: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(userId)

    if (user.method !== AuthMethod.CREDENTIALS || !user.passwordHash) {
      throw new UnauthorizedException('Password change is not available for this account')
    }

    const isValidPassword = await verify(user.passwordHash, dto.currentPassword)

    if (!isValidPassword) {
      throw new UnauthorizedException('Current password is incorrect')
    }

    const passwordHash = await hash(dto.newPassword, { type: argon2id })

    await this.updatePasswordHash(userId, passwordHash)
    await this.notificationsService.create(userId, NotificationType.PASSWORD_CHANGED)
    await this.sessionService.destroyAllForUser(userId, currentSid)

    try {
      await this.emailQueue.add(
        PASSWORD_CHANGED_JOB,
        { to: user.email },
        {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5_000 },
        },
      )
    } catch {
      this.logger.warn({ userId }, 'Failed to enqueue password-changed email')
    }

    return { message: 'Password has been changed' }
  }

  async changeEmail(userId: string, dto: ChangeEmailDto): Promise<{ message: string }> {
    const user = await this.findById(userId)

    if (user.method !== AuthMethod.CREDENTIALS || !user.passwordHash) {
      throw new UnauthorizedException('Email change is not available for this account')
    }

    const isValidPassword = await verify(user.passwordHash, dto.currentPassword)

    if (!isValidPassword) {
      throw new UnauthorizedException('Current password is incorrect')
    }

    if (dto.newEmail === user.email) {
      throw new ConflictException('New email must be different from your current email')
    }

    const existing = await this.findByEmail(dto.newEmail)

    if (existing) {
      throw new ConflictException('This email is already in use')
    }

    await this.invalidatePendingEmailChange(userId)

    const token = randomBytes(32).toString('base64url')
    console.debug('token', token)
    const tokenHash = this.hashToken(token)

    await Promise.all([
      this.redis.set(REDIS_KEYS.EMAIL_CHANGE(userId), tokenHash, 'EX', this.EMAIL_CHANGE_TTL),
      this.redis.set(
        REDIS_KEYS.EMAIL_CHANGE_TOKEN(tokenHash),
        `${userId}:${dto.newEmail}`,
        'EX',
        this.EMAIL_CHANGE_TTL,
      ),
    ])

    try {
      await Promise.all([
        this.emailQueue.add(
          EMAIL_CHANGE_CONFIRM_JOB,
          { to: dto.newEmail, token },
          {
            attempts: 5,
            backoff: { type: 'exponential', delay: 5_000 },
          },
        ),
        this.emailQueue.add(
          EMAIL_CHANGE_NOTIFY_JOB,
          { to: user.email, newEmail: dto.newEmail },
          {
            attempts: 5,
            backoff: { type: 'exponential', delay: 5_000 },
          },
        ),
      ])
    } catch {
      this.logger.warn({ userId }, 'Failed to enqueue email-change emails')
    }

    return { message: 'Check your new email to confirm the change' }
  }

  async requestAccountDeletion(
    userId: string,
    dto: DeleteAccountDto,
  ): Promise<{ message: string }> {
    const user = await this.findById(userId)

    if (user.method === AuthMethod.CREDENTIALS) {
      if (!dto.password) {
        throw new BadRequestException('Password is required to delete your account')
      }

      const isValidPassword = await verify(user.passwordHash!, dto.password)

      if (!isValidPassword) {
        throw new UnauthorizedException('Current password is incorrect')
      }
    }

    await this.invalidatePendingDeleteRequest(userId)

    const token = randomBytes(32).toString('base64url')
    const tokenHash = this.hashToken(token)

    await Promise.all([
      this.redis.set(REDIS_KEYS.DELETE_ACCOUNT(userId), tokenHash, 'EX', this.DELETE_ACCOUNT_TTL),
      this.redis.set(
        REDIS_KEYS.DELETE_ACCOUNT_TOKEN(tokenHash),
        `${userId}:${user.email}`,
        'EX',
        this.DELETE_ACCOUNT_TTL,
      ),
    ])

    try {
      await this.emailQueue.add(
        DELETE_ACCOUNT_JOB,
        { to: user.email, token },
        {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5_000 },
        },
      )
    } catch {
      this.logger.warn({ userId }, 'Failed to enqueue delete-account email')
    }

    return { message: 'Check your email to confirm account deletion' }
  }

  async confirmAccountDeletion(req: Request, res: Response, token: string): Promise<void> {
    const tokenHash = this.hashToken(token)
    const data = await this.redis.getdel(REDIS_KEYS.DELETE_ACCOUNT_TOKEN(tokenHash))

    if (!data) {
      throw new UnauthorizedException('Invalid or expired account deletion token')
    }

    const separatorIndex = data.indexOf(':')
    const userId = data.slice(0, separatorIndex)
    const email = data.slice(separatorIndex + 1)

    await this.redis.del(REDIS_KEYS.DELETE_ACCOUNT(userId))

    await this.prisma.user.delete({ where: { id: userId } })

    await this.sessionService.destroyAllForUser(userId)
    await this.cleanupUserRedisState(userId)

    if (req.session?.userId === userId) {
      await this.sessionService.revokeCurrent(req, res)
    }

    try {
      await this.emailQueue.add(
        ACCOUNT_DELETED_JOB,
        { to: email },
        {
          attempts: 5,
          backoff: { type: 'exponential', delay: 5_000 },
        },
      )
    } catch {
      this.logger.warn({ userId }, 'Failed to enqueue account-deleted email')
    }

    this.logger.log({ userId }, 'Account deleted')
  }

  private async getUserRatingDistribution(userId: string): Promise<Record<number, number>> {
    const ratings = await this.prisma.review.findMany({
      where: { userId },
      select: { rating: true },
    })

    const ratingDistribution = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i + 1, 0]))

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

    return {
      total,
      byMediaType,
    }
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

  private async invalidatePendingEmailChange(userId: string): Promise<void> {
    const oldHash = await this.redis.get(REDIS_KEYS.EMAIL_CHANGE(userId))

    if (!oldHash) {
      return
    }

    await this.redis.del(REDIS_KEYS.EMAIL_CHANGE(userId), REDIS_KEYS.EMAIL_CHANGE_TOKEN(oldHash))
  }

  private async invalidatePendingDeleteRequest(userId: string): Promise<void> {
    const oldHash = await this.redis.get(REDIS_KEYS.DELETE_ACCOUNT(userId))

    if (!oldHash) {
      return
    }

    await this.redis.del(
      REDIS_KEYS.DELETE_ACCOUNT(userId),
      REDIS_KEYS.DELETE_ACCOUNT_TOKEN(oldHash),
    )
  }

  private async cleanupUserRedisState(userId: string): Promise<void> {
    const keys: string[] = [REDIS_KEYS.TWO_FA(userId), REDIS_KEYS.USER_SESSIONS(userId)]

    const reversePairs: Array<{
      primaryKey: string
      reverseKeyBuilder: (value: string) => string
    }> = [
      {
        primaryKey: REDIS_KEYS.EMAIL_VERIFY(userId),
        reverseKeyBuilder: REDIS_KEYS.EMAIL_VERIFY_TOKEN,
      },
      {
        primaryKey: REDIS_KEYS.PASSWORD_RESET(userId),
        reverseKeyBuilder: REDIS_KEYS.PASSWORD_RESET_TOKEN,
      },
      {
        primaryKey: REDIS_KEYS.EMAIL_CHANGE(userId),
        reverseKeyBuilder: REDIS_KEYS.EMAIL_CHANGE_TOKEN,
      },
      {
        primaryKey: REDIS_KEYS.DELETE_ACCOUNT(userId),
        reverseKeyBuilder: REDIS_KEYS.DELETE_ACCOUNT_TOKEN,
      },
    ]

    for (const { primaryKey, reverseKeyBuilder } of reversePairs) {
      const storedValue = await this.redis.get(primaryKey)

      if (storedValue) {
        keys.push(reverseKeyBuilder(storedValue))
      }
    }

    await this.redis.del(...keys)
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }
}
