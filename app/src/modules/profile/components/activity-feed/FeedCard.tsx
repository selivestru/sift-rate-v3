import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Comment, FlagBanner, Heart, Link6, MoreH, Pen, Trash6 } from 'reicon-react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Button } from '~/common/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/common/ui/DropdownMenu'
import { cn } from '~/common/utils/cn'
import { formatCompactNumber } from '~/common/utils/formatCompactNumber'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'
import { getFirstLetter } from '~/common/utils/getFirstLetter'

import type { FeedItem, PostFeedItem, ReviewFeedItem } from '../../types/profile.types'
import { FeedMediaBlock } from './FeedMediaBlock'

const MAX_PREVIEW_LENGTH = 240

interface FeedCardProps {
  item: FeedItem
  isOwn: boolean
}

export const FeedCard = ({ item, isOwn }: FeedCardProps) => {
  const [isLiked] = useState(item.isLiked)
  const [likeCount] = useState(item.likeCount)
  const author = item.author

  const showComingSoon = (label: string) => toast.info(`${label} will be available soon`)

  return (
    <article className="hover:bg-muted/35 grid grid-cols-[auto_1fr] gap-2 p-2 transition-colors duration-300 sm:gap-3 sm:p-4">
      <Link to="/$username" params={{ username: author.username }} className="h-fit">
        <Avatar size="lg">
          <AvatarImage src={author.avatarUrl ?? undefined} alt={author.displayName} />
          <AvatarFallback className="text-base sm:text-lg">
            {getFirstLetter(author.displayName)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <Link
              to="/$username"
              params={{ username: author.username }}
              className="hover:text-primary focus-visible:text-primary truncate font-semibold outline-none sm:text-base"
            >
              {author.displayName}
            </Link>
            <span className="text-muted-foreground truncate text-sm">@{author.username}</span>
            <span className="text-muted-foreground text-sm" aria-hidden>
              ·
            </span>
            <time className="text-muted-foreground text-sm" dateTime={item.createdAt}>
              {formatRelativeTime(item.createdAt)}
            </time>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  className="text-muted-foreground size-9 shrink-0 rounded-full"
                  aria-label="More activity options"
                >
                  <MoreH weight="Filled" className="size-7" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-fit">
              {isOwn && (
                <>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => showComingSoon('Deleting')}
                  >
                    <Trash6 />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => showComingSoon('Editing')}>
                    <Pen />
                    Edit
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => showComingSoon('Sharing')}>
                <Link6 />
                Copy link
              </DropdownMenuItem>
              {!isOwn && (
                <DropdownMenuItem onClick={() => showComingSoon('Reporting')}>
                  <FlagBanner />
                  Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2.5 space-y-3">
          {item.kind === 'review' ? <ReviewContent item={item} /> : <PostContent item={item} />}

          <div className="-ml-3 flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              startIcon={<Heart className="size-5" weight={isLiked ? 'Filled' : 'Outline'} />}
              className={cn(
                'h-9 gap-2 rounded-full px-3! text-muted-foreground',
                isLiked && 'text-primary',
              )}
              aria-label={isLiked ? 'Unlike activity' : 'Like activity'}
              aria-pressed={isLiked}
            >
              {formatCompactNumber(likeCount)}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              startIcon={<Comment className="size-5" />}
              className="text-muted-foreground h-9 gap-2 rounded-full px-3!"
              aria-label="Open comments"
              onClick={() => showComingSoon('Comments')}
            >
              {formatCompactNumber(item.commentCount)}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

const ReviewContent = ({ item }: { item: ReviewFeedItem }) => {
  const hasContent = Boolean(item.content?.trim())

  return (
    <>
      <FeedMediaBlock media={item.media} rating={item.rating} />
      {hasContent && <ExpandableText content={item.content ?? ''} />}
    </>
  )
}

const PostContent = ({ item }: { item: PostFeedItem }) => {
  return (
    <>
      <ExpandableText content={item.content} />
      {item.media && <FeedMediaBlock media={item.media} />}
    </>
  )
}

interface ExpandableTextProps {
  content: string
}

const ExpandableText = ({ content }: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = content.length > MAX_PREVIEW_LENGTH
  const visibleContent =
    shouldTruncate && !isExpanded ? `${content.slice(0, MAX_PREVIEW_LENGTH).trimEnd()}...` : content

  return (
    <div>
      <p className="text-[15px] leading-6 break-all whitespace-pre-wrap sm:text-base">
        {visibleContent}
      </p>
      {shouldTruncate && (
        <button
          type="button"
          className="text-primary focus-visible:ring-ring/40 mt-2 text-sm font-medium outline-none hover:underline focus-visible:ring-2"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}
