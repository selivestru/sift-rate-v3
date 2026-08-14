import { Link } from '@tanstack/react-router'
import { Comment, Heart } from 'reicon-react'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'
import { getFirstLetter } from '~/common/utils/getFirstLetter'

import type { FeedItem } from '../types/feed.types'
import { FeedContent } from './FeedContent'
import { FeedReviewCard } from './FeedReviewCard'

interface FeedRowProps {
  data: FeedItem
}

export const FeedRow = ({ data }: FeedRowProps) => {
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
          <FeedReviewCard review={data.review} />
        ) : (
          data.content && <FeedContent content={data.content} />
        )}

        <div className="-ml-3 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            startIcon={<Heart className="size-5" />}
            //  weight={isLiked ? 'Filled' : 'Outline'}
            className={cn(
              'h-9 gap-2 rounded-full px-3! text-muted-foreground',
              // isLiked && 'text-primary',
            )}
            // aria-label={isLiked ? 'Unlike activity' : 'Like activity'}
            // aria-pressed={isLiked}
          >
            {/* {formatCompactNumber(likeCount)} */}
            {10}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            startIcon={<Comment className="size-5" />}
            className="text-muted-foreground h-9 gap-2 rounded-full px-3!"
            aria-label="Open comments"
            // onClick={() => showComingSoon('Comments')}
          >
            {/* {formatCompactNumber(item.commentCount)} */}
            {23}
          </Button>
        </div>
      </div>
    </article>
  )
}
