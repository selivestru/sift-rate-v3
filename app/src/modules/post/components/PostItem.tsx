import { Link } from '@tanstack/react-router'
import { Comment } from 'reicon-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Button } from '~/common/ui/Button'
import { formatCompactNumber } from '~/common/utils/formatCompactNumber'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'
import { getFirstLetter } from '~/common/utils/getFirstLetter'

import type { Post } from '../types/post.types'
import { LikePostButton } from './LikePostButton'
import { PostContent } from './PostContent'
import { PostReviewCard } from './PostReviewCard'

interface PostItemProps {
  data: Post
}

export const PostItem = ({ data }: PostItemProps) => {
  return (
    <article className="hover:bg-muted/35 grid grid-cols-[auto_1fr] gap-2 p-2 transition-colors duration-300 sm:gap-3 sm:p-4">
      <Link to="/$username" params={{ username: data.user.username }} className="h-fit">
        <Avatar size="lg">
          <AvatarImage src={data.user.avatarUrl ?? undefined} alt={data.user.displayName} />
          <AvatarFallback className="text-base sm:text-lg">
            {getFirstLetter(data.user.displayName)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <Link
              to="/$username"
              params={{ username: data.user.username }}
              className="hover:text-primary focus-visible:text-primary truncate font-semibold outline-none sm:text-base"
            >
              {data.user.displayName}
            </Link>
            <span className="text-muted-foreground truncate text-sm">@{data.user.username}</span>
            <span className="text-muted-foreground text-sm" aria-hidden>
              ·
            </span>
            <time className="text-muted-foreground text-sm" dateTime={data.createdAt}>
              {formatRelativeTime(data.createdAt)}
            </time>
          </div>
        </div>

        {data.review ? (
          <PostReviewCard review={data.review} />
        ) : (
          data.content && <PostContent content={data.content} />
        )}

        <div className="-ml-3 flex items-center gap-1">
          <LikePostButton postId={data.id} isLiked={data.isLiked} likesCount={data.likesCount} />
          <Button
            variant="ghost"
            size="sm"
            startIcon={<Comment className="size-5" />}
            className="text-muted-foreground h-9 gap-2 rounded-full px-3!"
            aria-label="Open comments"
          >
            {formatCompactNumber(data.commentsCount)}
          </Button>
        </div>
      </div>
    </article>
  )
}
