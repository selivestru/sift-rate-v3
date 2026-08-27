import { useIntlayer } from 'react-intlayer'
import { Star } from 'reicon-react'

import { MEDIA_TYPES, mediaTypeMeta } from '~/common/constants/media-type'
import { useMediaTypeSingularLabel } from '~/common/i18n'
import { Badge } from '~/common/ui/Badge'
import { cn } from '~/common/utils/cn'

import { MediaCoverLightbox } from '../../shared'
import { MediaStateButtons } from '../../shared/components/MediaStateButtons'
import type { BookDetail } from '../types/book-detail.types'
import { formatPublished } from '../utils/format-published'

interface BookHeroProps {
  book: BookDetail
}

export const BookHero = ({ book }: BookHeroProps) => {
  const content = useIntlayer('discover-detail')
  const typeLabel = useMediaTypeSingularLabel(MEDIA_TYPES.BOOK)
  const accent = mediaTypeMeta[MEDIA_TYPES.BOOK].color
  const MediaTypeIcon = mediaTypeMeta.BOOK.icon
  const publishedLabel = formatPublished(book.publishedDate, book.year)
  const categoryPreview = book.categories.slice(0, 3)

  const stats: Array<{ label: string; value: string }> = []
  if (publishedLabel) stats.push({ label: content.published.value, value: publishedLabel })
  if (book.pageCount != null)
    stats.push({ label: content.pages.value, value: String(book.pageCount) })
  if (book.language) stats.push({ label: content.language.value, value: book.language })
  if (book.publisher) stats.push({ label: content.publisher.value, value: book.publisher })

  return (
    <div className="relative overflow-hidden rounded-t-2xl max-md:rounded-t-none">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(ellipse 90% 70% at 50% 0%, color-mix(in oklab, ${accent} 16%, transparent), transparent 55%)`,
            `linear-gradient(180deg, color-mix(in oklab, ${accent} 6%, var(--background)) 0%, var(--background) 55%, var(--background) 100%)`,
          ].join(', '),
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px sm:inset-x-12"
        style={{
          background: `linear-gradient(90deg, transparent, color-mix(in oklab, ${accent} 55%, transparent), transparent)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-5 pt-10 pb-7 sm:px-8 sm:pt-12 sm:pb-9">
        <div className="relative mb-7 sm:mb-8">
          <div
            aria-hidden
            className="absolute -inset-x-8 -bottom-4 h-10 rounded-[100%] opacity-70 blur-xl sm:-inset-x-12 sm:h-12"
            style={{
              background: `radial-gradient(ellipse at center, color-mix(in oklab, ${accent} 35%, transparent), transparent 70%)`,
            }}
          />

          <div
            className="bg-muted relative aspect-2/3 w-38 overflow-hidden rounded-sm sm:w-48"
            style={{
              boxShadow: [
                `-10px 0 0 -4px color-mix(in oklab, ${accent} 55%, var(--background))`,
                `-6px 0 0 -2px color-mix(in oklab, ${accent} 25%, var(--card))`,
                `0 28px 50px -18px rgb(0 0 0 / 0.55)`,
                `0 14px 28px -12px color-mix(in oklab, ${accent} 30%, transparent)`,
              ].join(', '),
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-2.5"
              style={{
                background: `linear-gradient(90deg, color-mix(in oklab, ${accent} 40%, transparent), transparent)`,
              }}
            />
            <MediaCoverLightbox
              src={book.coverUrl}
              alt={book.title}
              priority
              width={384}
              height={576}
              fallback={
                <div className="flex size-full flex-col items-center justify-center gap-2 px-3">
                  <MediaTypeIcon className="text-muted-foreground size-10" aria-hidden />
                  <span className="text-muted-foreground text-center text-[10px] tracking-wide uppercase">
                    {content.noCover.value}
                  </span>
                </div>
              }
            />
          </div>
        </div>

        <div className="flex w-full max-w-md flex-col items-center text-center">
          <div className="mb-3 flex items-center gap-2.5">
            <span
              aria-hidden
              className="h-px w-6 sm:w-8"
              style={{ background: `color-mix(in oklab, ${accent} 60%, transparent)` }}
            />
            <span
              className="text-[10px] font-semibold tracking-[0.28em] uppercase"
              style={{ color: accent }}
            >
              {typeLabel}
            </span>
            {book.isEbook && (
              <Badge className="h-5 px-1.5 text-[10px] uppercase">{content.ebook.value}</Badge>
            )}
            <span
              aria-hidden
              className="h-px w-6 sm:w-8"
              style={{ background: `color-mix(in oklab, ${accent} 60%, transparent)` }}
            />
          </div>

          <h1 className="text-foreground text-[1.75rem] leading-[1.15] font-bold text-balance sm:text-4xl">
            {book.title}
          </h1>

          {book.subtitle && (
            <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-snug text-pretty italic sm:text-[0.95rem]">
              {book.subtitle}
            </p>
          )}

          {book.authors.length > 0 && (
            <p className="text-foreground mt-4 text-sm tracking-wide text-pretty sm:text-base">
              {content.byAuthors({ authors: book.authors.join(' · ') })}
            </p>
          )}

          <div
            aria-hidden
            className="my-5 h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, color-mix(in oklab, ${accent} 50%, var(--border)), transparent)`,
            }}
          />

          <MediaStateButtons externalId={book.id} mediaType={MEDIA_TYPES.BOOK} className="mb-5" />

          {stats.length > 0 && (
            <dl className="mb-5 flex max-w-full flex-wrap items-start justify-center gap-x-0 gap-y-3">
              {stats.slice(0, 4).map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    'flex flex-col items-center px-3.5 sm:px-4',
                    index > 0 && 'border-l border-border',
                  )}
                >
                  <dt className="text-muted-foreground text-[9px] font-medium tracking-[0.16em] uppercase">
                    {stat.label}
                  </dt>
                  <dd className="text-foreground mt-0.5 max-w-30 truncate text-xs font-medium tabular-nums sm:text-sm">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {book.googleRating != null && book.googleRating > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div
                className="border-border bg-muted flex items-center gap-1 rounded-full border px-2.5 py-1"
                title={
                  book.googleRatingsCount > 0
                    ? content.ratingCount({
                        count: book.googleRatingsCount.toLocaleString(),
                        provider: 'Google',
                      })
                    : content.ratingLabel({ provider: 'Google' })
                }
              >
                <Star weight="Filled" className="text-muted-foreground size-3.5" aria-hidden />
                <span className="text-foreground text-xs font-semibold tabular-nums">
                  {book.googleRating.toFixed(1)}
                </span>
                <span className="text-muted-foreground text-[10px]">Google</span>
              </div>
            </div>
          )}

          {categoryPreview.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {categoryPreview.map((category) => (
                <Badge key={category} className="font-normal">
                  {category}
                </Badge>
              ))}
              {book.categories.length > categoryPreview.length && (
                <span className="text-muted-foreground self-center text-[11px]">
                  +{book.categories.length - categoryPreview.length}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
