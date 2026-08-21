import { Link } from '@tanstack/react-router'
import { Comment } from 'reicon-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'
import { formatCompactNumber } from '~/common/utils/formatCompactNumber'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'
import { getFirstLetter } from '~/common/utils/getFirstLetter'

import type { Post } from '../types/post.types'
import { LikePostButton } from './LikePostButton'
import { PostContent } from './PostContent'
import { PostDropdownMenu } from './PostDropdownMenu'
import { PostReviewCard } from './PostReviewCard'

interface PostItemProps {
  data: Post
  isDetailView?: boolean
}

export const PostItem = ({ data, isDetailView = false }: PostItemProps) => {
  const avatar = (
    <Avatar size="lg">
      <AvatarImage src={data.user.avatarUrl ?? undefined} alt={data.user.displayName} />
      <AvatarFallback className="text-base sm:text-lg">
        {getFirstLetter(data.user.displayName)}
      </AvatarFallback>
    </Avatar>
  )

  const userInfo = (
    <div className="z-px relative flex items-center gap-x-1.5 overflow-hidden max-sm:flex-col max-sm:items-start">
      {isDetailView ? (
        data.user.displayName
      ) : (
        <Link
          to="/$username"
          params={{ username: data.user.username }}
          className="hover:text-primary focus-visible:text-primary z-px relative truncate font-semibold outline-none sm:text-base"
        >
          {data.user.displayName}
        </Link>
      )}
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground truncate text-sm">@{data.user.username}</span>
        <span className="text-muted-foreground shrink-0 text-sm" aria-hidden>
          ·
        </span>
        <time className="text-muted-foreground shrink-0 text-sm" dateTime={data.createdAt}>
          {formatRelativeTime(data.createdAt)}
        </time>
      </div>
    </div>
  )

  const content = data.review ? (
    <PostReviewCard isDetailView={isDetailView} review={data.review} />
  ) : (
    data.content && <PostContent isReview={false} content={data.content} />
  )

  const actions = (
    <div className="z-px relative -ml-3 flex w-fit items-center gap-1">
      <LikePostButton
        postId={data.id}
        parentId={data.parentId}
        isLiked={data.isLiked}
        likesCount={data.likesCount}
      />
      <Button
        variant="ghost"
        size="sm"
        startIcon={<Comment className="size-5" />}
        className="text-muted-foreground z-px relative h-9 gap-2 rounded-full px-3!"
        aria-label="Open comments"
        render={isDetailView ? undefined : <Link to="/post/$postId" params={{ postId: data.id }} />}
      >
        {formatCompactNumber(data.repliesCount)}
      </Button>
    </div>
  )

  const menu = <PostDropdownMenu post={data} />

  const overlay = (
    <Link
      to="/post/$postId"
      params={{ postId: data.id }}
      aria-label={`Open post by ${data.user.displayName}`}
      className="focus-visible:ring-ring/40 absolute inset-0 z-0 focus-visible:ring-2 focus-visible:outline-none"
    />
  )

  if (isDetailView) {
    return (
      <article className="hover:bg-muted/35 relative flex flex-col gap-2 p-3 pb-2! transition-colors duration-300 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {avatar}
          {userInfo}
          <div className="ml-auto">{menu}</div>
        </div>
        {content}
        {actions}
      </article>
    )
  }

  return (
    <article className="hover:bg-muted/35 relative grid grid-cols-[auto_1fr] gap-2 p-3 pb-2! transition-colors duration-300 sm:gap-3 sm:p-4">
      {overlay}
      <Link
        to="/$username"
        params={{ username: data.user.username }}
        className="z-px relative h-fit shrink-0"
      >
        {avatar}
      </Link>
      <div>
        <div className={cn('flex items-center justify-between gap-2', data.review && 'mb-1.5')}>
          {userInfo}
          {menu}
        </div>
        {content}
        {actions}
      </div>
    </article>
  )
}
