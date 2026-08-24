import { Injectable } from '@nestjs/common'

import {
  NotificationPayloadMap,
  NotificationResponsePayloadMap,
  PostRef,
} from './types/notification.types'
import { AUTHOR_SELECT } from '~/common/constants/author-select'
import { Author } from '~/common/types/user.types'
import { NotificationType } from '~/generated/prisma/enums'
import type { NotificationModel } from '~/generated/prisma/models'
import { PrismaService } from '~/infrastructure/prisma/prisma.service'

const EMPTY_AUTHOR: Author = {
  id: null,
  username: null,
  displayName: null,
  avatarUrl: null,
} as unknown as Author

const EMPTY_POST: PostRef = { id: null, content: null, review: null }

@Injectable()
export class NotificationPayloadResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(
    rows: NotificationModel[],
  ): Promise<Array<NotificationResponsePayloadMap[NotificationType] | null>> {
    const byType = new Map<NotificationType, Array<{ row: NotificationModel; index: number }>>()

    for (const [index, row] of rows.entries()) {
      const group = byType.get(row.type)
      if (group) {
        group.push({ row, index })
      } else {
        byType.set(row.type, [{ row, index }])
      }
    }

    const results = new Array<NotificationResponsePayloadMap[NotificationType] | null>(rows.length)

    await Promise.all([...byType].map(([type, group]) => this.resolveGroup(type, group, results)))

    return results
  }

  private async resolveGroup(
    type: NotificationType,
    group: Array<{ row: NotificationModel; index: number }>,
    results: Array<NotificationResponsePayloadMap[NotificationType] | null>,
  ): Promise<void> {
    switch (type) {
      case NotificationType.PASSWORD_CHANGED:
      case NotificationType.EMAIL_CHANGED:
        return
      case NotificationType.FOLLOW:
      case NotificationType.FOLLOW_REQUEST:
      case NotificationType.FOLLOW_REQUEST_ACCEPTED:
        return this.resolveFollow(group, results)
      case NotificationType.POST_LIKE:
        return this.resolvePostLike(group, results)
      case NotificationType.POST_COMMENT:
        return this.resolvePostComment(group, results)
    }
  }

  private async resolveFollow(
    group: Array<{ row: NotificationModel; index: number }>,
    results: Array<NotificationResponsePayloadMap[NotificationType] | null>,
  ): Promise<void> {
    const userIds = group.map(({ row }) => (row.payload as NotificationPayloadMap['FOLLOW']).userId)
    const users = await this.fetchAuthors(userIds)

    for (const { row, index } of group) {
      const { userId } = row.payload as NotificationPayloadMap['FOLLOW']
      results[index] = users.get(userId) ?? EMPTY_AUTHOR
    }
  }

  private async resolvePostLike(
    group: Array<{ row: NotificationModel; index: number }>,
    results: Array<NotificationResponsePayloadMap[NotificationType] | null>,
  ): Promise<void> {
    const payloads = group.map(({ row }) => row.payload as NotificationPayloadMap['POST_LIKE'])
    const [users, posts] = await Promise.all([
      this.fetchAuthors(payloads.map(({ userId }) => userId)),
      this.fetchPosts(payloads.map(({ postId }) => postId)),
    ])

    for (const [position, { index }] of group.entries()) {
      const { postId, userId } = payloads[position]

      results[index] = {
        user: users.get(userId) ?? EMPTY_AUTHOR,
        post: posts.get(postId) ?? EMPTY_POST,
      }
    }
  }

  private async resolvePostComment(
    group: Array<{ row: NotificationModel; index: number }>,
    results: Array<NotificationResponsePayloadMap[NotificationType] | null>,
  ): Promise<void> {
    const payloads = group.map(({ row }) => row.payload as NotificationPayloadMap['POST_COMMENT'])
    const commentIds = payloads.map(({ postId }) => postId)

    const [users, comments] = await Promise.all([
      this.fetchAuthors(payloads.map(({ userId }) => userId)),
      this.fetchComments(commentIds),
    ])

    const parentIds = [
      ...new Set(
        [...comments.values()]
          .filter((comment) => comment.parentId)
          .map((comment) => comment.parentId!),
      ),
    ]
    const posts = await this.fetchPosts(parentIds)

    for (const [position, { index }] of group.entries()) {
      const { postId, userId } = payloads[position]
      const comment = comments.get(postId)

      results[index] = {
        user: users.get(userId) ?? EMPTY_AUTHOR,
        post: comment?.parentId ? (posts.get(comment.parentId) ?? EMPTY_POST) : EMPTY_POST,
        comment: comment ?? EMPTY_POST,
      }
    }
  }

  private async fetchAuthors(ids: string[]): Promise<Map<string, Author>> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: AUTHOR_SELECT,
    })

    return new Map(users.map((user) => [user.id, user]))
  }

  private async fetchPosts(ids: string[]): Promise<Map<string, PostRef>> {
    const posts = await this.prisma.post.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        content: true,
        review: {
          select: {
            content: true,
            rating: true,
            media: { select: { title: true } },
          },
        },
      },
    })

    return new Map(posts.map((post) => [post.id, this.mapPostRef(post)]))
  }

  private async fetchComments(
    ids: string[],
  ): Promise<
    Map<string, { id: string; content: string | null; parentId: string | null; review: null }>
  > {
    const comments = await this.prisma.post.findMany({
      where: { id: { in: ids } },
      select: { id: true, content: true, parentId: true },
    })

    return new Map(comments.map((comment) => [comment.id, { ...comment, review: null }]))
  }

  private mapPostRef(post: {
    id: string
    content: string | null
    review: { content: string | null; rating: number; media: { title: string } } | null
  }): PostRef {
    return {
      id: post.id,
      content: post.content,
      review: post.review
        ? {
            content: post.review.content,
            rating: post.review.rating,
            mediaTitle: post.review.media.title,
          }
        : null,
    }
  }
}
