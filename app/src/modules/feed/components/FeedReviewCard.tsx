import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useIntlayer } from 'react-intlayer'

import { MEDIA_TYPES, mediaDetailRouteByType, mediaTypeMeta } from '~/common/constants/media-type'
import { useAppLocale } from '~/common/i18n'
import { Avatar, AvatarFallback, AvatarImage } from '~/common/ui/Avatar'
import { Badge } from '~/common/ui/Badge'
import { MediaTypeBadge } from '~/common/ui/MediaTypeBadge'
import { RatingBadge } from '~/common/ui/RatingBadge'
import { cn } from '~/common/utils/cn'
import { formatRelativeTime } from '~/common/utils/formatRelativeTime'
import { getFirstLetter } from '~/common/utils/getFirstLetter'
import { tvShowDetailApi } from '~/modules/discover/detail/tv_show/api/tv-show-detail.api'

import type { FeedItem } from '../types/feed.types'

interface FeedReviewCardProps {
  item: FeedItem
  seasonItems?: FeedItem[]
  showSeasonPoster?: boolean
}

export const FeedReviewCard = ({
  item,
  seasonItems,
  showSeasonPoster = false,
}: FeedReviewCardProps) => {
  const { locale } = useAppLocale()
  const shared = useIntlayer('shared')
  const content = useIntlayer('feed')
  const { media, user } = item
  const typeMeta = mediaTypeMeta[media.mediaType]
  const TypeIcon = typeMeta.icon
  const isMusic = media.mediaType === MEDIA_TYPES.ALBUM || media.mediaType === MEDIA_TYPES.TRACK
  const detailTo = mediaDetailRouteByType[media.mediaType]
  const isPerfect = item.rating === 10
  const isSeasonEvent = item.seasonNumber != null

  const { data: tvDetail } = useQuery({
    queryKey: ['discover', 'detail', 'tv_show', locale, media.externalId],
    queryFn: () => tvShowDetailApi.getTvShow(media.externalId),
    enabled: showSeasonPoster && isSeasonEvent,
  })

  const seasonPosterUrl =
    showSeasonPoster && isSeasonEvent
      ? (tvDetail?.seasons.find((season) => season.seasonNumber === item.seasonNumber)?.posterUrl ??
        null)
      : null
  const posterUrl = seasonPosterUrl ?? media.posterUrl

  const avatar = (
    <Avatar size="lg">
      <AvatarImage src={user.avatarUrl ?? undefined} alt={user.username ?? undefined} />
      <AvatarFallback className="text-base sm:text-lg">
        {getFirstLetter(user.username)}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <article className="hover:bg-accent flex gap-3 p-3 transition-colors duration-300 sm:gap-4 sm:p-4">
      {user.username ? (
        <Link
          to="/$username"
          params={{ username: user.username }}
          aria-label={content.openProfile({ name: user.username ?? '' })}
          className="focus-visible:ring-ring/40 h-fit shrink-0 rounded-full outline-none focus-visible:ring-2"
        >
          {avatar}
        </Link>
      ) : (
        <div className="h-fit shrink-0">{avatar}</div>
      )}

      <div className="flex flex-1 flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 overflow-hidden">
          {user.username ? (
            <Link
              to="/$username"
              params={{ username: user.username }}
              className="hover:text-primary focus-visible:text-primary truncate font-semibold transition-colors duration-200 outline-none sm:text-base"
            >
              @{user.username}
            </Link>
          ) : null}
          <span className="text-muted-foreground shrink-0 text-sm" aria-hidden>
            ·
          </span>
          <time className="text-muted-foreground shrink-0 text-sm" dateTime={item.createdAt}>
            {formatRelativeTime(item.createdAt, locale)}
          </time>
        </div>

        <div className="bg-card border-border overflow-hidden rounded-xl border">
          <div className="flex gap-3 p-3">
            <Link
              to={detailTo}
              params={{ externalId: media.externalId }}
              aria-label={`${shared.open.value} ${media.title}`}
              className={cn(
                'bg-muted border-border relative shrink-0 overflow-hidden rounded-lg border outline-none',
                'focus-visible:ring-ring/40 focus-visible:ring-2',
                isMusic ? 'aspect-square w-20 sm:w-24' : 'aspect-2/3 w-20 sm:w-24',
              )}
            >
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={media.title}
                  className="size-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <TypeIcon className="size-6" style={{ color: typeMeta.color }} aria-hidden />
                </div>
              )}
            </Link>

            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <MediaTypeBadge mediaType={media.mediaType} />
                {item.seasonNumber != null && (
                  <Badge variant="default">
                    {content.seasonChip({ season: item.seasonNumber })}
                  </Badge>
                )}
                <RatingBadge rating={item.rating} variant={isPerfect ? 'rating' : 'default'} />
              </div>

              <Link
                to={detailTo}
                params={{ externalId: media.externalId }}
                className={cn(
                  'text-foreground line-clamp-2 w-fit text-base font-semibold tracking-tight outline-none transition-colors duration-200',
                  'hover:text-primary focus-visible:text-primary focus-visible:underline',
                )}
              >
                {media.title}
              </Link>

              {seasonItems && seasonItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {seasonItems.map((seasonItem) => (
                    <RatingBadge
                      key={seasonItem.id}
                      rating={seasonItem.rating}
                      variant={seasonItem.rating === 10 ? 'rating' : 'default'}
                      label={`S${seasonItem.seasonNumber}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
